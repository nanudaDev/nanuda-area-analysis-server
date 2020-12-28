import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { abort } from 'process';
import { ORDER_BY_VALUE } from 'src/common';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { EntityManager } from 'typeorm';
import { KbDeliveryPrep } from '../kb-delivery-prep/kb-delivery-prep.entity';
import { CompanyDistrict } from '../nanuda-company-entities/nanuda-company-district.entity';
import { DeliverySpace } from '../nanuda-company-entities/nanuda-delivery-space.entity';
import { BusinessRegListDto } from './dto';

@Injectable()
export class BusinessRegService extends BaseService {
  constructor(
    @InjectEntityManager() private readonly wqEntityManager: EntityManager,
    @InjectEntityManager('nanuda')
    private readonly entityManager: EntityManager,
  ) {
    super();
  }
  /**
   * get score for company distrit vs delivery space deposit
   * @param businessRegListDto
   * @param deliverySpaceNo
   */
  async compareDistrictPriceWithAverage(
    businessRegListDto: BusinessRegListDto,
    deliverySpaceNo: number,
  ) {
    const averageForDistrict = await this.__find_average_for_district(
      businessRegListDto,
    );
    const deliverySpace = await this.entityManager
      .getRepository(DeliverySpace)
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere('deliverySpace.no = :no', { no: deliverySpaceNo })
      .getOne();
    return {
      deposit: await this.__is_above_or_not(
        deliverySpace.deposit,
        averageForDistrict[0].depositSum,
      ),
      //   monthlyRentFee: await this.__is_above_or_not(
      //     deliverySpace.monthlyRentFee,
      //     averageForDistrict[0].monthlyRentFeeSum,
      //   ),
    };
  }

  /**
   * get best locations
   * @param businessRegListDto
   */
  async getBestLocations(businessRegListDto: BusinessRegListDto) {
    const allData = [];
    const firstYearList = await this.wqEntityManager
      .getRepository(KbDeliveryPrep)
      .createQueryBuilder('kbDeliveryPrep')
      .CustomInnerJoinAndSelect(['kbCategoryInfo', 'bdongInfo'])
      .where('kbDeliveryPrep.yymm > 2008')
      .andWhere('kbDeliveryPrep.admiCd LIKE :seoulCode', { seoulCode: '11%' })
      .AndWhereLike(
        'kbDeliveryPrep',
        'mediumCategoryCd',
        businessRegListDto.mediumCategoryCd,
      )
      .AndWhereLike(
        'kbDeliveryPrep',
        'sSmallCategoryCd',
        businessRegListDto.smallCategoryCd,
      )
      .AndWhereEqual(
        'kbCategoryInfo',
        'baeminCategoryName',
        businessRegListDto.baeminCategoryName,
      )
      // .andWhere(`kbCategoryInfo.smallCategoryCd NOT IN ('F15012')`)
      // .andWhere(
      //   `kbCategoryInfo.baeminCategoryName NOT IN ('패스트푸드', '카페/디저트')`,
      // )
      // .andWhere(
      //   `kbCategoryInfo.mediumCategoryName NOT IN ('패스트푸드', '커피/음료')`,
      // )
      .innerJoinAndSelect('bdongInfo.hCodes', 'hCodes')
      .having('count (distinct hCodes.id) = 1')
      .orderBy('kbDeliveryPrep.wTotalAmt', ORDER_BY_VALUE.DESC)
      .addOrderBy('kbDeliveryPrep.wTotalCnt', ORDER_BY_VALUE.DESC)
      .addOrderBy('kbDeliveryPrep.pStoreCnt', ORDER_BY_VALUE.ASC)
      .groupBy('kbDeliveryPrep.admiCd')
      .addGroupBy('kbDeliveryPrep.sSmallCategoryCd')
      .limit(10)
      .getMany();

    // const lastThreeMonths = await this.wqEntityManager
    //   .getRepository(KbDeliveryPrep)
    //   .createQueryBuilder('kbDeliveryPrep')
    //   .CustomInnerJoinAndSelect(['kbCategoryInfo', 'bdongInfo'])
    //   // .where('kbDeliveryPrep.yymm >= 2007')
    //   .andWhere('kbDeliveryPrep.admiCd LIKE :seoulCode', { seoulCode: '11%' })
    //   .AndWhereLike(
    //     'kbDeliveryPrep',
    //     'mediumCategoryCd',
    //     businessRegListDto.mediumCategoryCd,
    //   )
    //   .AndWhereLike(
    //     'kbDeliveryPrep',
    //     'sSmallCategoryCd',
    //     businessRegListDto.smallCategoryCd,
    //   )
    //   .AndWhereEqual(
    //     'kbCategoryInfo',
    //     'baeminCategoryName',
    //     businessRegListDto.baeminCategoryName,
    //   )
    //   .andWhere(`kbCategoryInfo.smallCategoryCd NOT IN ('F15012')`)
    //   // .andWhere(
    //   //   `kbCategoryInfo.mediumCategoryName NOT IN ('패스트푸드', '커피/음료')`,
    //   // )
    //   .orderBy('kbDeliveryPrep.wTotalAmt', ORDER_BY_VALUE.DESC)
    //   .addOrderBy('kbDeliveryPrep.wTotalCnt', ORDER_BY_VALUE.DESC)
    //   .addOrderBy('kbDeliveryPrep.pStoreCnt', ORDER_BY_VALUE.ASC)
    //   .groupBy('kbDeliveryPrep.admiCd')
    //   .addGroupBy('kbDeliveryPrep.sSmallCategoryCd')
    //   .limit(20)
    //   .getMany();

    // allData.push(
    //   { recentMonth: firstYearList },
    //   { lastThreeMonths: lastThreeMonths },
    // );
    return firstYearList;
  }

  /**
   * 서울시 전체 업종 별 집계 쿼리
   */
  async foodCategoryRankingSummary() {
    const query = `select W1.baeminCategoryName, W1.s_small_category_nm, 
    round(avg(W1.transCnt)) as transCntAvg, 
    round(avg(W1.transAmt)) as transAmtAvg, 
    round(avg(W1.transAmt)/avg(W1.transCnt)) as amtPerCnt,
    round(avg(W1.storeCnt)) as storeCntAvg,
    round(avg(W1.transCnt) / avg(W1.storeCnt)) as transCntPerStoreCnt,
    count(*) as aggCnt
from (select T2.bdongCode, T2.sidoName, T2.guName, T2.bdongName, T3.baeminCategoryName, T1.s_small_category_cd, T3.s_small_category_nm, 
  T1.transCnt, T1.transAmt, round(T1.transAmt / T1.transCnt) as amtPerCnt, T1.storeCnt, round(T1.transCnt / T1.storeCnt) as transCntPerStoreCnt
from (select t1.admi_cd, t2.s_small_category_cd, 
          round(avg(t1.w_total_cnt)) as transCnt, 
          round(avg(t1.w_total_amt)) as transAmt, 
          round(avg(t1.p_store_cnt)) as storeCnt
   from wq.kb_delivery_prep t1
   join wq.code_kb_category t2
   on t1.s_small_category_cd = t2.s_small_category_cd
   where t1.admi_cd like '11%'
   group by t1.admi_cd, t2.s_small_category_cd
   ) T1
join wq.code_bdong T2
on T1.admi_cd = T2.bdongCode
join wq.code_kb_category T3
on T1.s_small_category_cd = T3.s_small_category_cd
) W1
where W1.baeminCategoryName is not null
group by W1.baeminCategoryName, W1.s_small_category_nm
having aggCnt > 50
order by transCntPerStoreCnt desc
;`;
    const list = await this.wqEntityManager.query(query);
    return list;
  }

  private async __is_above_or_not(initialValue: number, averageValue: number) {
    let grade = 'REGULAR';
    let point = 0;
    if (initialValue > averageValue && initialValue - averageValue > 800) {
      grade = 'DANGER';
      point = 0;
    } else if (
      initialValue > averageValue &&
      initialValue - averageValue <= 799
    ) {
      grade = 'REGULAR';
      point = 1;
    } else if (initialValue < averageValue) {
      grade = 'ACCEPTABLE';
      point = 2;
    } else if (
      initialValue < averageValue &&
      averageValue - initialValue < 500
    ) {
      grade = 'VERY_ACCEPTABLE';
      point = 3;
    }
    const value = {
      message:
        initialValue > averageValue
          ? `Higher than average (${initialValue} : ${averageValue})`
          : `Lower than average (${initialValue} : ${averageValue})`,
      grade: grade,
      point: point,
    };
    return value;
  }

  /**
   * average deposit for all districts
   * in seoul
   * @param businessRegListDto \
   */
  private async __find_average_for_district(
    businessRegListDto?: BusinessRegListDto,
  ) {
    const districts = this.entityManager
      .getRepository(CompanyDistrict)
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['company', 'deliverySpaces'])
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      //   TODO: 현재 서울 시만 적용
      .andWhere('companyDistrict.region1DepthName = :region1DepthName', {
        region1DepthName: '서울',
      })
      .AndWhereEqual(
        'companyDistrict',
        'region2DepthName',
        businessRegListDto.region2DepthName,
        businessRegListDto.exclude('region2DepthName'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'region3DepthName',
        businessRegListDto.region3DepthName,
        businessRegListDto.exclude('region3DepthName'),
      )
      .select('AVG(deliverySpaces.deposit)', 'depositSum')
      .addSelect('AVG(deliverySpaces.monthlyRentFee)', 'monthlyRentFeeSum')
      .getRawMany();
    return districts;
  }
}
