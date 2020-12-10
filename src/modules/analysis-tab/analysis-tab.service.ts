import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { AgeGroupModifier } from 'src/core/';
import { EntityManager } from 'typeorm';
import { AnalysisSummaryIndex } from './analysis-summary-index-test.entity';
import { AnalysisTabListDto } from './dto';

class AnalysisSummary {
  storeCount?: string;
  houseCount?: string;
  resPopulationCount?: string;
  employeeCount?: string;
  movingPopulationCount?: string;
  importantAgeGroup?: string;
  averageSurvivalYears?: string;
}

@Injectable()
export class AnalysisTabService extends BaseService {
  constructor(
    @InjectEntityManager() private readonly wqEntityManager: EntityManager,
  ) {
    super();
  }

  /**
   * check index
   * @param analysisTabListDto
   */
  async checkIndex(analysisTabListDto: AnalysisTabListDto): Promise<boolean> {
    const checkIndex = await this.wqEntityManager
      .getRepository(AnalysisSummaryIndex)
      .findOne({ where: { bdongCode: analysisTabListDto.bdongCode } });
    if (checkIndex) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 상권 요약
   * @param analysisTabListDto
   */
  async analysisSummary(
    analysisTabListDto: AnalysisTabListDto,
  ): Promise<AnalysisSummary> {
    const checkIndex = await this.wqEntityManager
      .getRepository(AnalysisSummaryIndex)
      .findOne({ where: { bdongCode: analysisTabListDto.bdongCode } });
    if (!checkIndex) {
      const storeCount = await this.wqEntityManager
        .query(`select count(*) as storeCount
      from kr_stores_restaurant A
      join commercial_business_category_code B
      on A.smallCode = B.smallCode
      where A.largeCode ='Q'
          and B.baeminCategoryName is not null
          and A.bdongCode = ${analysisTabListDto.bdongCode}`);

      //   총세대수
      const houseCount = await this.wqEntityManager
        .query(`select sum(genTotal) as houseCount
    from kr_seoul_gen
    where hdongCode in (select hdongCode 
                        from code_hdong_bdong 
                        where bdongCode = ${analysisTabListDto.bdongCode})
    ;`);

      // 주거 인구수
      const resPopulationCount = await this.wqEntityManager
        .query(`select round(sum(totalCntAvg)) as resPopulationCount
      from (select hdongCode, avg(TotalCnt) as totalCntAvg
              from kr_seoul_living_local
              where hdongCode in (select hdongCode 
                                  from code_hdong_bdong 
                                  where bdongCode = ${analysisTabListDto.bdongCode}) 
                                        and ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
                                        and date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()
              group by hdongCode) A
      ;`);

      // 직장인 수
      const workerCount = await this.wqEntityManager
        .query(`select sum(employeeCnt) as employeeCount
      from kr_nps t1
      left join code_bdong t2
      on t1.bdongCode = t2.bdongCode
      where t1.bdongCode = ${analysisTabListDto.bdongCode}
      ;`);

      // 유동인구
      const movingPopulationCount = await this.wqEntityManager
        .query(`select round(sum(totalCntAvg)) as movingPopulationCount
      from (select hdongCode, avg(TotalCnt) as totalCntAvg
              from kr_seoul_living_local 
              where hdongCode in (select hdongCode 
                                  from code_hdong_bdong 
                                  where bdongCode = ${analysisTabListDto.bdongCode})
                                        and (time >= 7 and time <= 18)
                                        and date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()
              group by hdongCode) A
      ;`);

      //   주요 연령대
      const importantAgeGroup = await this.wqEntityManager
        .query(`SELECT @var_max_val:= GREATEST(A10, A20, A30, A40, A50, A60) AS max_value,
    CASE @var_max_val WHEN A10 THEN 'A10'
                      WHEN A20 THEN 'A20'
                      WHEN A30 THEN 'A30'
                      WHEN A40 THEN 'A40'
                      WHEN A50 THEN 'A50'
                      WHEN A60 THEN 'A60'
    END AS max_value_column_name,
    round(@var_max_val / (A10+A20+A30+A40+A50+A60),4) AS ratio
FROM
 (select sum(B.A10) as A10, sum(B.A20) as A20, sum(B.A30) as A30, sum(B.A40) as A40, sum(B.A50) as A50, sum(B.A60) as A60
 from (SELECT hdongCode, avg(A10) AS A10, avg(A20) AS A20, avg(A30) AS A30, avg(A40) AS A40, avg(A50) AS A50, avg(A60) AS A60
         FROM
             (SELECT date, weekday, time, hdongCode,
                        M10+M15+F10+F15 AS A10, 
                        M20+M25+F20+F25 AS A20, 
                        M30+M35+F30+F35 AS A30, 
                        M40+M45+F40+F45 AS A40, 
                        M50+M55+F50+F55 AS A50,
                        M60+M65+M70+F60+F65+F70 AS A60
                 FROM kr_seoul_living_local 
                 WHERE hdongCode in (select hdongCode 
                                     from code_hdong_bdong 
                                     where bdongCode = ${analysisTabListDto.bdongCode})
                       AND ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
                       AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
         GROUP BY hdongCode) B
 ) c
;`);

      const averageSurvivalYears = await this.wqEntityManager
        .query(`select round(avg(survivalDays)/365, 2) as averageSurvivalYears
from kr_license_test A
join kr_license_code B
on A.storeCategory = B.storeCategory
where A.detailStateName = '폐업' 
	and B.baeminCategoryName is not null 
    and A.bdongCode = ${analysisTabListDto.bdongCode}
;
`);

      const result = await Promise.all([
        storeCount[0],
        houseCount[0],
        resPopulationCount[0],
        workerCount[0],
        movingPopulationCount[0],
        importantAgeGroup[0],
        averageSurvivalYears[0],
      ]);

      let summary = new AnalysisSummary();
      summary.storeCount = result[0].storeCount;
      summary.houseCount = result[1].houseCount;
      summary.resPopulationCount = result[2].resPopulationCount;
      summary.employeeCount = result[3].employeeCount;
      summary.movingPopulationCount = result[4].movingPopulationCount;
      summary.importantAgeGroup = AgeGroupModifier(
        result[5].max_value_column_name,
      );
      summary.averageSurvivalYears = `${result[6].averageSurvivalYears}년`;
      // await save to analysis summary
      let index = new AnalysisSummaryIndex();
      index.bdongCode = analysisTabListDto.bdongCode;
      index.result = summary;
      index = await this.wqEntityManager
        .getRepository(AnalysisSummaryIndex)
        .save(index);
      return summary;
    } else {
      return checkIndex.result;
    }
  }

  /**
   * category 별 비중
   * @param analysisTabListDto
   */
  async categoryRatio(analysisTabListDto: AnalysisTabListDto) {
    const ratio = await this.wqEntityManager.query(`select g1.*, 
      round(g1.w_total_cnt_avg / (select sum(w_total_cnt_avg) as w_total_cnt_avg_sum
                                  from (select t1.baeminCategoryName, 
                                                 avg(w_total_cnt) as w_total_cnt_avg, 
                                                 avg(w_total_amt) as w_total_amt_avg
                                          from (select B.baeminCategoryName, B.s_small_category_nm, A.*
                                                from kb_delivery_prep A
                                                join code_kb_category B
                                                on A.s_small_category_cd = B.s_small_category_cd
                                                join code_bdong C
                                                on A.admi_cd = C.bdongCode
                                                where B.baeminCategoryName is not null 
                                                      and A.admi_cd = ${analysisTabListDto.bdongCode}) t1
                                          group by t1.baeminCategoryName
                                          order by w_total_amt_avg desc
                                          ) t2),4) as w_total_cnt_avg_ratio,
      round(g1.w_total_amt_avg / (select sum(w_total_amt_avg) as w_total_amt_avg_sum
                                  from (select t1.baeminCategoryName, 
                                                 avg(w_total_cnt) as w_total_cnt_avg, 
                                                 avg(w_total_amt) as w_total_amt_avg
                                          from (select B.baeminCategoryName, B.s_small_category_nm, A.*
                                                from kb_delivery_prep A
                                                join code_kb_category B
                                                on A.s_small_category_cd = B.s_small_category_cd
                                                join code_bdong C
                                                on A.admi_cd = C.bdongCode
                                                where B.baeminCategoryName is not null 
                                                      and A.admi_cd = ${analysisTabListDto.bdongCode}) t1
                                          group by t1.baeminCategoryName
                                          order by w_total_amt_avg desc
                                          ) t2),4) as w_total_amt_avg_ratio
from (select t1.baeminCategoryName, 
             avg(w_total_cnt) as w_total_cnt_avg, 
             avg(w_total_amt) as w_total_amt_avg
      from (select B.baeminCategoryName, B.s_small_category_nm, A.*
            from kb_delivery_prep A
            join code_kb_category B
            on A.s_small_category_cd = B.s_small_category_cd
            join code_bdong C
            on A.admi_cd = C.bdongCode
            where B.baeminCategoryName is not null 
                  and A.admi_cd = ${analysisTabListDto.bdongCode}) t1
      group by t1.baeminCategoryName
      order by w_total_amt_avg desc) g1
;`);

    return ratio;
  }

  /**
   * 매출 분석
   * pie chart
   * @param analysisTabListDto
   */
  async revenueAnalysisGender(analysisTabListDto: AnalysisTabListDto) {
    const genderRatio = await this.wqEntityManager
      .query(`select A.m_cnt_per, A.fm_cnt_per, A.bz_cnt_per, A.m_amt_per, A.fm_amt_per, A.bz_amt_per
      from (select B.baeminCategoryName, B.s_small_category_nm, A.*
              from kb_delivery_prep A
              join code_kb_category B
              on A.s_small_category_cd = B.s_small_category_cd
              join code_bdong C
              on A.admi_cd = C.bdongCode
              where B.baeminCategoryName is not null 
                    and A.admi_cd = ${analysisTabListDto.bdongCode}
                    and B.baeminCategoryName = '${analysisTabListDto.baeminCategoryName}'
                    and A.yymm = (select max(yymm) from kb_delivery_prep)
              order by amt_per_store desc) A
      limit 1;`);

    const allData = [];
    const genderLabel = ['남성', '여성', '알 수 없음'];
    // 주문 건수 위주
    const countData = {
      datasets: [
        {
          data: [
            genderRatio[0].m_cnt_per * 100,
            genderRatio[0].fm_cnt_per * 100,
            genderRatio[0].bz_cnt_per * 100,
          ],
          backgroundColor: [
            'rgb(23,162,184)',
            'rgb(232,93,71)',
            'rgb(100,100,100)',
          ],
        },
      ],
      labels: genderLabel,
    };
    allData.push({ countData: countData });
    // 매출 건수 위주
    const revenueData = {
      datasets: [
        {
          data: [
            genderRatio[0].m_amt_per * 100,
            genderRatio[0].fm_amt_per * 100,
            genderRatio[0].bz_amt_per * 100,
          ],
          backgroundColor: [
            'rgb(23,162,184)',
            'rgb(232,93,71)',
            'rgb(100,100,100)',
          ],
        },
      ],
      labels: genderLabel,
    };
    allData.push({ revenueData: revenueData });
    return allData;
  }

  /**
   * 연령별
   * bar graph
   * @param analysisTabListDto
   */
  async revenueAnalysisAgeGroup(analysisTabListDto: AnalysisTabListDto) {
    const ageGroup = await this.wqEntityManager
      .query(`select A.a10_cnt_per, A.a20_cnt_per, A.a30_cnt_per, A.a40_cnt_per, A.a50_cnt_per, A.a60_cnt_per,
      A.a10_amt_per, A.a20_amt_per, A.a30_amt_per, A.a40_amt_per, A.a50_amt_per, A.a60_amt_per
from (select B.baeminCategoryName, B.s_small_category_nm, A.*
       from kb_delivery_prep A
       join code_kb_category B
       on A.s_small_category_cd = B.s_small_category_cd
       join code_bdong C
       on A.admi_cd = C.bdongCode
       where B.baeminCategoryName is not null 
             and A.admi_cd = ${analysisTabListDto.bdongCode}
             and B.baeminCategoryName = '${analysisTabListDto.baeminCategoryName}'
             and A.yymm = (select max(yymm) from kb_delivery_prep)
       order by amt_per_store desc) A
limit 1
;`);

    if (ageGroup && ageGroup.length > 0) {
      const allData = [];
      const countData = {
        datasets: [
          {
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: [
              ageGroup[0].a10_cnt_per * 100,
              ageGroup[0].a20_cnt_per * 100,
              ageGroup[0].a30_cnt_per * 100,
              ageGroup[0].a40_cnt_per * 100,
              ageGroup[0].a50_cnt_per * 100,
              ageGroup[0].a60_cnt_per * 100,
            ],
            labels: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
          },
        ],
      };
      allData.push({ countData: countData });

      const revenueData = {
        datasets: [
          {
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: [
              ageGroup[0].a10_amt_per * 100,
              ageGroup[0].a20_amt_per * 100,
              ageGroup[0].a30_amt_per * 100,
              ageGroup[0].a40_amt_per * 100,
              ageGroup[0].a50_amt_per * 100,
              ageGroup[0].a60_amt_per * 100,
            ],
            labels: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
          },
        ],
      };
      allData.push({ revenueData: revenueData });

      return allData;
    } else {
      return { result: 'no data available' };
    }
  }

  async revenueAnalysisByDay(analysisTabListDto: AnalysisTabListDto) {
    const byDay = await this.wqEntityManager
      .query(`select A.wd1_cnt_per as sun_cnt_per, A.wd2_cnt_per as mon_cnt_per, A.wd3_cnt_per as tue_cnt_per, A.wd4_cnt_per as wed_cnt_per, 
      A.wd5_cnt_per as thu_cnt_per, A.wd6_cnt_per as fri_cnt_per, A.wd7_cnt_per as sat_cnt_per,
      A.wd1_amt_per as sun_amt_per, A.wd2_amt_per as mon_amt_per, A.wd3_amt_per as tue_amt_per, A.wd4_amt_per as wed_amt_per, 
      A.wd5_amt_per as thu_amt_per, A.wd6_amt_per as fri_amt_per, A.wd7_amt_per as sat_amt_per
from (select B.baeminCategoryName, B.s_small_category_nm, A.*
       from kb_delivery_prep A
       join code_kb_category B
       on A.s_small_category_cd = B.s_small_category_cd
       join code_bdong C
       on A.admi_cd = C.bdongCode
       where B.baeminCategoryName is not null 
             and A.admi_cd = ${analysisTabListDto.bdongCode}
             and B.baeminCategoryName = '${analysisTabListDto.baeminCategoryName}'
             and A.yymm = (select max(yymm) from kb_delivery_prep)
       order by amt_per_store desc) A limit 1;`);
    console.log(byDay);
    if (byDay && byDay.length > 0) {
      const allData = [];
      const countData = {
        datasets: [
          {
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: [
              byDay[0].sun_cnt_per * 100,
              byDay[0].mon_cnt_per * 100,
              byDay[0].tue_cnt_per * 100,
              byDay[0].wed_cnt_per * 100,
              byDay[0].thu_cnt_per * 100,
              byDay[0].fri_cnt_per * 100,
              byDay[0].sat_cnt_per * 100,
            ],
          },
        ],
      };
      allData.push({ countData: countData });

      const revenueData = {
        datasets: [
          {
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: [
              byDay[0].sun_amt_per * 100,
              byDay[0].mon_amt_per * 100,
              byDay[0].tue_amt_per * 100,
              byDay[0].wed_amt_per * 100,
              byDay[0].thu_amt_per * 100,
              byDay[0].fri_amt_per * 100,
              byDay[0].sat_amt_per * 100,
            ],
          },
        ],
      };
      allData.push({ revenueData: revenueData });
      return allData;
    } else {
      return { result: 'no data available' };
    }
  }

  async categoryCompetitionSummary(analysisTabListDto: AnalysisTabListDto) {
    const qb = await this.wqEntityManager.query(`select T1.*, 
      T2.w_total_amt_avg_ratio, 
      (T2.w_total_amt_avg_ratio - T1.storeCntRatio) as gapPer

from (select B.baeminCategoryName, 
              count(*) as storeCnt,
              count(*) / sum(count(*)) over() as storeCntRatio
       from kr_stores_restaurant A
       join commercial_business_category_code B
       on A.smallCode = B.smallCode
       where A.largeCode ='Q' 
            and B.baeminCategoryName is not null 
            and A.bdongCode = ${analysisTabListDto.bdongCode}
       group by B.baeminCategoryName) T1

left join (select g1.*, 
               round(g1.w_total_cnt_avg / (select sum(w_total_cnt_avg) as w_total_cnt_avg_sum
                                           from (select t1.baeminCategoryName, 
                                                          avg(w_total_cnt) as w_total_cnt_avg, 
                                                          avg(w_total_amt) as w_total_amt_avg
                                                   from (select B.baeminCategoryName, B.s_small_category_nm, A.*
                                                         from kb_delivery_prep A
                                                         join code_kb_category B
                                                         on A.s_small_category_cd = B.s_small_category_cd
                                                         join code_bdong C
                                                         on A.admi_cd = C.bdongCode
                                                         where B.baeminCategoryName is not null 
                                                               and A.admi_cd = ${analysisTabListDto.bdongCode}) t1
                                                   group by t1.baeminCategoryName
                                                   order by w_total_amt_avg desc
                                                   ) t2),4) as w_total_cnt_avg_ratio,
               round(g1.w_total_amt_avg / (select sum(w_total_amt_avg) as w_total_amt_avg_sum
                                           from (select t1.baeminCategoryName, 
                                                          avg(w_total_cnt) as w_total_cnt_avg, 
                                                          avg(w_total_amt) as w_total_amt_avg
                                                   from (select B.baeminCategoryName, B.s_small_category_nm, A.*
                                                         from kb_delivery_prep A
                                                         join code_kb_category B
                                                         on A.s_small_category_cd = B.s_small_category_cd
                                                         join code_bdong C
                                                         on A.admi_cd = C.bdongCode
                                                         where B.baeminCategoryName is not null 
                                                               and A.admi_cd = ${analysisTabListDto.bdongCode}) t1
                                                   group by t1.baeminCategoryName
                                                   order by w_total_amt_avg desc
                                                   ) t2),4) as w_total_amt_avg_ratio
       from (select t1.baeminCategoryName, 
                      avg(w_total_cnt) as w_total_cnt_avg, 
                      avg(w_total_amt) as w_total_amt_avg
               from (select B.baeminCategoryName, B.s_small_category_nm, A.*
                     from kb_delivery_prep A
                     join code_kb_category B
                     on A.s_small_category_cd = B.s_small_category_cd
                     join code_bdong C
                     on A.admi_cd = C.bdongCode
                     where B.baeminCategoryName is not null 
                           and A.admi_cd = ${analysisTabListDto.bdongCode}) t1
               group by t1.baeminCategoryName
               order by w_total_amt_avg desc) g1) T2

on T1.baeminCategoryName = T2.baeminCategoryName
where T2.baeminCategoryName is not null;`);

    qb.map(q => {
      q.storeCntRatio = q.storeCntRatio * 100;
      q.w_total_amt_avg_ratio = q.w_total_amt_avg_ratio * 100;
      q.gapPer = q.gapPer * 100;
    });

    return qb;
  }

  async averageSurvivalYears(analysisTabListDto: AnalysisTabListDto) {
    const survivalYears = await this.wqEntityManager
      .query(`select B.baeminCategoryName, round(avg(survivalDays)/365,2) as survivalYearsAvg
    from kr_license_test A
    join kr_license_code B
    on A.storeCategory = B.storeCategory
    where A.detailStateName = '폐업' 
        and B.baeminCategoryName is not null 
        and A.bdongCode = ${analysisTabListDto.bdongCode}
    group by B.baeminCategoryName
    order by survivalYearsAvg desc
    ;`);

    return survivalYears;
  }
}
