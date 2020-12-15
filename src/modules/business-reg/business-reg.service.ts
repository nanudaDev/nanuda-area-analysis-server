import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { abort } from 'process';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { EntityManager } from 'typeorm';
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
