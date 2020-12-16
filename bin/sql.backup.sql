/*
1. 상권요약 탭

- 입력 파라미터: 법정동코드

1) 음식점수(개)
2) 총세대수(세대)
3) 평균영업기간(년)
4) 주거인구(명)
5) 직장인구(명)
6) 유동인구(명)
7) 주요 연령대
8) 카테고리별 매출 비중 (배달의민족 카테고리 기준)

*/

# 법정동코드 조회
select * from wq.code_bdong where bdongName = '역삼동';
# 파라미터 예시 - 역삼동 법정동코드
SET @bdongCode = 1168010100;


# 1) 음식점수(개)
select count(*) as cnt
from wq.kr_stores A
join wq.commercial_business_category_code B
on A.smallCode = B.smallCode
where A.largeCode ='Q' 
	and B.baeminCategoryName is not null 
    and A.bdongCode = @bdongCode
;


# 2) 총세대수(세대)
select sum(genTotal) as genTotalSum
from wq.kr_seoul_gen
where hdongCode in (select hdongCode 
                    from wq.code_hdong_bdong 
					where bdongCode = @bdongCode)
;


# 3) 평균영업기간(년)
select round(avg(survivalDays)/365, 2) as survivalYearsAvg
from wq.kr_license_test A
join wq.kr_license_code B
on A.storeCategory = B.storeCategory
where A.detailStateName = '폐업' 
	and B.baeminCategoryName is not null 
    and A.bdongCode = @bdongCode
;


# 4) 주거인구(명)
select round(sum(totalCntAvg)) as totalCntAvgSum
from (select hdongCode, avg(TotalCnt) as totalCntAvg
    	from wq.kr_seoul_living_local
		where hdongCode in (select hdongCode 
							from wq.code_hdong_bdong 
							where bdongCode = @bdongCode) 
								  and ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
                                  and date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()
		group by hdongCode) A
;


# 5) 직장인구(명)
select sum(employeeCnt) as employeeCntSum
from wq.kr_nps t1
left join wq.code_bdong t2
on t1.bdongCode = t2.bdongCode
where t1.bdongCode = @bdongCode
;


# 6) 유동인구(명)
select round(sum(totalCntAvg)) as totalCntAvgSum
from (select hdongCode, avg(TotalCnt) as totalCntAvg
		from wq.kr_seoul_living_local 
		where hdongCode in (select hdongCode 
							from wq.code_hdong_bdong 
							where bdongCode = @bdongCode)
								  and (time >= 7 and time <= 18)
								  and date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()
		group by hdongCode) A
;


# 7) 주요 연령대
SELECT @var_max_val:= GREATEST(A10, A20, A30, A40, A50, A60) AS max_value,
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
					FROM wq.kr_seoul_living_local 
					WHERE hdongCode in (select hdongCode 
										from wq.code_hdong_bdong 
										where bdongCode = @bdongCode)
						  AND ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
						  AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
			GROUP BY hdongCode) B
	) c
;


# 8) 카테고리별 매출 비중 (배달의민족 카테고리 기준)
select g1.*, 
		round(g1.w_total_cnt_avg / (select sum(w_total_cnt_avg) as w_total_cnt_avg_sum
									from (select t1.baeminCategoryName, 
												   avg(w_total_cnt) as w_total_cnt_avg, 
												   avg(w_total_amt) as w_total_amt_avg
											from (select B.baeminCategoryName, B.s_small_category_nm, A.*
												  from wq.kb_delivery_prep A
												  join wq.code_kb_category B
												  on A.s_small_category_cd = B.s_small_category_cd
												  join wq.code_bdong C
												  on A.admi_cd = C.bdongCode
												  where B.baeminCategoryName is not null 
														and A.admi_cd = @bdongCode) t1
											group by t1.baeminCategoryName
											order by w_total_amt_avg desc
											) t2),4) as w_total_cnt_avg_ratio,
		round(g1.w_total_amt_avg / (select sum(w_total_amt_avg) as w_total_amt_avg_sum
									from (select t1.baeminCategoryName, 
												   avg(w_total_cnt) as w_total_cnt_avg, 
												   avg(w_total_amt) as w_total_amt_avg
											from (select B.baeminCategoryName, B.s_small_category_nm, A.*
												  from wq.kb_delivery_prep A
												  join wq.code_kb_category B
												  on A.s_small_category_cd = B.s_small_category_cd
												  join wq.code_bdong C
												  on A.admi_cd = C.bdongCode
												  where B.baeminCategoryName is not null 
														and A.admi_cd = @bdongCode) t1
											group by t1.baeminCategoryName
											order by w_total_amt_avg desc
											) t2),4) as w_total_amt_avg_ratio
from (select t1.baeminCategoryName, 
			   avg(w_total_cnt) as w_total_cnt_avg, 
			   avg(w_total_amt) as w_total_amt_avg
		from (select B.baeminCategoryName, B.s_small_category_nm, A.*
			  from wq.kb_delivery_prep A
			  join wq.code_kb_category B
			  on A.s_small_category_cd = B.s_small_category_cd
			  join wq.code_bdong C
			  on A.admi_cd = C.bdongCode
			  where B.baeminCategoryName is not null 
					and A.admi_cd = @bdongCode) t1
		group by t1.baeminCategoryName
		order by w_total_amt_avg desc) g1
;


## 비율 컬럼 제외한 쿼리
select t1.baeminCategoryName, 
       avg(w_total_cnt) as w_total_cnt_avg, 
       avg(w_total_amt) as w_total_amt_avg
from (select B.baeminCategoryName, B.s_small_category_nm, A.*
	  from wq.kb_delivery_prep A
	  join wq.code_kb_category B
	  on A.s_small_category_cd = B.s_small_category_cd
	  join wq.code_bdong C
	  on A.admi_cd = C.bdongCode
	  where B.baeminCategoryName is not null 
		    and A.admi_cd = @bdongCode) t1
group by t1.baeminCategoryName
order by w_total_amt_avg desc
;


/*
2. 매출분석 탭

- 입력 파라미터: 법정동코드, 배민카테고리이름

<매출 분석>
1) 성별 비중
2) 연령별 비중
3) 요일별 비중
4) 평균객단가

<시간대별 업종 매출 순위>

*/

# 파라미터 예시
# 역삼동
SET @bdongCode = 1168010100;
# 배민카테고리 선택
SET @baeminCategoryName = '한식';
SET @baeminCategoryName = '야식';
SET @baeminCategoryName = '아시안/양식';
SET @baeminCategoryName = '돈까스/회/일식';
SET @baeminCategoryName = '카페/디저트';
SET @baeminCategoryName = '분식';
SET @baeminCategoryName = '중국집';
SET @baeminCategoryName = '도시락';
SET @baeminCategoryName = '패스트푸드';
SET @baeminCategoryName = '치킨';
SET @baeminCategoryName = '피자';
SET @baeminCategoryName = '찜/탕';
SET @baeminCategoryName = '족발/보삼';


# <매출 분석>

# 1) 성별 비중 - 매출건수비율(남성, 여성, 기타), 매출금액비율(남성, 여성, 기타)
select A.m_cnt_per, A.fm_cnt_per, A.bz_cnt_per, A.m_amt_per, A.fm_amt_per, A.bz_amt_per
from (select B.baeminCategoryName, B.s_small_category_nm, A.*
		from wq.kb_delivery_prep A
		join wq.code_kb_category B
		on A.s_small_category_cd = B.s_small_category_cd
		join wq.code_bdong C
		on A.admi_cd = C.bdongCode
		where B.baeminCategoryName is not null 
			  and A.admi_cd = @bdongCode
              and B.baeminCategoryName = @baeminCategoryName
              and A.yymm = (select max(yymm) from wq.kb_delivery_prep)
		order by amt_per_store desc) A
limit 1
;



# 2) 연령별 비중 - 매출건수비율(10대, 20대, 30대, 40대, 50대, 60대 이상), 매출금액비율(10대, 20대, 30대, 40대, 50대, 60대 이상)
# (참고) 매출건수만 필요할 시에는 매출금액 컬럼 제외
select A.a10_cnt_per, A.a20_cnt_per, A.a30_cnt_per, A.a40_cnt_per, A.a50_cnt_per, A.a60_cnt_per,
       A.a10_amt_per, A.a20_amt_per, A.a30_amt_per, A.a40_amt_per, A.a50_amt_per, A.a60_amt_per
from (select B.baeminCategoryName, B.s_small_category_nm, A.*
		from wq.kb_delivery_prep A
		join wq.code_kb_category B
		on A.s_small_category_cd = B.s_small_category_cd
		join wq.code_bdong C
		on A.admi_cd = C.bdongCode
		where B.baeminCategoryName is not null 
			  and A.admi_cd = @bdongCode
              and B.baeminCategoryName = @baeminCategoryName
              and A.yymm = (select max(yymm) from wq.kb_delivery_prep)
		order by amt_per_store desc) A
limit 1
;


# 3) 요일별 비중 - 매출건수비율(일월화수목금토), 매출금액비율(일월화수목금토)
# (참고) 매출건수만 필요할 시에는 매출금액 컬럼 제외
# (참고) 평일, 주말 비율은 요일 집계 결과 가공하여 생성 가능
# 파라미터 법정동 코드 및 배민 카테고리명
select A.wd1_cnt_per as sun_cnt_per, A.wd2_cnt_per as mon_cnt_per, A.wd3_cnt_per as tue_cnt_per, A.wd4_cnt_per as wed_cnt_per, 
       A.wd5_cnt_per as thu_cnt_per, A.wd6_cnt_per as fri_cnt_per, A.wd7_cnt_per as sat_cnt_per,
       A.wd1_amt_per as sun_amt_per, A.wd2_amt_per as mon_amt_per, A.wd3_amt_per as tue_amt_per, A.wd4_amt_per as wed_amt_per, 
       A.wd5_amt_per as thu_amt_per, A.wd6_amt_per as fri_amt_per, A.wd7_amt_per as sat_amt_per
from (select B.baeminCategoryName, B.s_small_category_nm, A.*
		from wq.kb_delivery_prep A
		join wq.code_kb_category B
		on A.s_small_category_cd = B.s_small_category_cd
		join wq.code_bdong C
		on A.admi_cd = C.bdongCode
		where B.baeminCategoryName is not null 
			  and A.admi_cd = @bdongCode
              and B.baeminCategoryName = @baeminCategoryName
              and A.yymm = (select max(yymm) from wq.kb_delivery_prep)
		order by amt_per_store desc) A
limit 1
;


# 4) 평균객단가
# (논의 필요) 동/카테고리 기준 월별 객단가 집계 데이터이므로 Dist Plot이 적절하지 않을 수 있음. 대신, 월 별 평균 객단가 변동 추이는 확인 가능.
select A.yymm, round(avg(amt_per_cnt)) as amt_per_cnt_avg
from (select B.baeminCategoryName, B.s_small_category_nm, A.*
		from wq.kb_delivery_prep A
		join wq.code_kb_category B
		on A.s_small_category_cd = B.s_small_category_cd
		join wq.code_bdong C
		on A.admi_cd = C.bdongCode
		where B.baeminCategoryName is not null 
			  and A.admi_cd = @bdongCode
              and B.baeminCategoryName = @baeminCategoryName) A
group by A.yymm
order by A.yymm asc;



# <시간대별 업종 매출 순위> - (작업 중)
# (참고) hour; 6 611 1114 1417 1721 2124

select t1.*, 
       t2.baeminCategoryName as rank_1_bm, 
       t3.baeminCategoryName as rank_2_bm, 
       t4.baeminCategoryName as rank_3_bm

from wq.kb_delivery_store t1

left join wq.code_kb_category t2
on t1.rank_1 = t2.s_small_category_cd

left join wq.code_kb_category t3
on t1.rank_2 = t3.s_small_category_cd

left join wq.code_kb_category t4
on t1.rank_3 = t4.s_small_category_cd

where admi_cd = @bdongCode
      and yymm = (select max(yymm) from wq.kb_delivery_store)
      and hour = 1114
      and gender != '기타'
      and age != '기타'

order by trans_count desc
;




/*
3. 업종분석 탭

1) 업종별 경쟁률 현황상세
2) 평균영업기간
*/

# 1) 업종별 경쟁률 현황상세
# 상가업소 테이블과 KB매출 테이블 Left Join
# 인덱스 테이블 필요
# 파라미터 법정동 코드

select T1.*, 
       T2.w_total_amt_avg_ratio, 
       (T2.w_total_amt_avg_ratio - T1.storeCntRatio) as gapPer

from (select B.baeminCategoryName, 
			   count(*) as storeCnt,
			   count(*) / sum(count(*)) over() as storeCntRatio
		from wq.kr_stores A
		join wq.commercial_business_category_code B
		on A.smallCode = B.smallCode
		where A.largeCode ='Q' 
			 and B.baeminCategoryName is not null 
			 and A.bdongCode = @bdongCode
		group by B.baeminCategoryName) T1

left join (select g1.*, 
				round(g1.w_total_cnt_avg / (select sum(w_total_cnt_avg) as w_total_cnt_avg_sum
											from (select t1.baeminCategoryName, 
														   avg(w_total_cnt) as w_total_cnt_avg, 
														   avg(w_total_amt) as w_total_amt_avg
													from (select B.baeminCategoryName, B.s_small_category_nm, A.*
														  from wq.kb_delivery_prep A
														  join wq.code_kb_category B
														  on A.s_small_category_cd = B.s_small_category_cd
														  join wq.code_bdong C
														  on A.admi_cd = C.bdongCode
														  where B.baeminCategoryName is not null 
																and A.admi_cd = @bdongCode) t1
													group by t1.baeminCategoryName
													order by w_total_amt_avg desc
													) t2),4) as w_total_cnt_avg_ratio,
				round(g1.w_total_amt_avg / (select sum(w_total_amt_avg) as w_total_amt_avg_sum
											from (select t1.baeminCategoryName, 
														   avg(w_total_cnt) as w_total_cnt_avg, 
														   avg(w_total_amt) as w_total_amt_avg
													from (select B.baeminCategoryName, B.s_small_category_nm, A.*
														  from wq.kb_delivery_prep A
														  join wq.code_kb_category B
														  on A.s_small_category_cd = B.s_small_category_cd
														  join wq.code_bdong C
														  on A.admi_cd = C.bdongCode
														  where B.baeminCategoryName is not null 
																and A.admi_cd = @bdongCode) t1
													group by t1.baeminCategoryName
													order by w_total_amt_avg desc
													) t2),4) as w_total_amt_avg_ratio
		from (select t1.baeminCategoryName, 
					   avg(w_total_cnt) as w_total_cnt_avg, 
					   avg(w_total_amt) as w_total_amt_avg
				from (select B.baeminCategoryName, B.s_small_category_nm, A.*
					  from wq.kb_delivery_prep A
					  join wq.code_kb_category B
					  on A.s_small_category_cd = B.s_small_category_cd
					  join wq.code_bdong C
					  on A.admi_cd = C.bdongCode
					  where B.baeminCategoryName is not null 
							and A.admi_cd = @bdongCode) t1
				group by t1.baeminCategoryName
				order by w_total_amt_avg desc) g1) T2

on T1.baeminCategoryName = T2.baeminCategoryName
where T2.baeminCategoryName is not null
;





# 2) 평균영업기간
select B.baeminCategoryName, round(avg(survivalDays)/365,2) as survivalYearsAvg
from wq.kr_license_test A
join wq.kr_license_code B
on A.storeCategory = B.storeCategory
where A.detailStateName = '폐업' 
	and B.baeminCategoryName is not null 
    and A.bdongCode = @bdongCode
group by B.baeminCategoryName
order by survivalYearsAvg desc
;




/*
4. 인구분석

1) 총 주거인구(명), 성별 비율, 연령별 비율
2) 총 가구수(가구), 1인 ~ 6인이상 각각에 대한 가구 수
3) 총 직장인수(명)
4) 총 유동인구(명), 성별 비율, 연령별 비율
*/

# 1) 총 주거인구(명), 성별 비율, 연령별 비율

## 총 주거인구(명)
select round(sum(totalCntAvg)) as totalCntAvgSum
from (select hdongCode, avg(TotalCnt) as totalCntAvg
    	from wq.kr_seoul_living_local
		where hdongCode in (select hdongCode 
							from wq.code_hdong_bdong 
							where bdongCode = @bdongCode) 
								  and ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
                                  and date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()
		group by hdongCode) A
;


## 성별 비율
select round(sum(B.male)) as male, 
       round(sum(B.female)) as female
from (SELECT hdongCode, avg(male) AS male, avg(female) AS female
	  FROM
			(SELECT date, weekday, time, hdongCode,
				    M10+M15+M20+M25+M30+M35+M40+M45+M50+M55+M60+M65+M70 AS male,
				    F10+F15+F20+F25+F30+F35+F40+F45+F50+F55+F60+F65+F70 AS female
			 FROM wq.kr_seoul_living_local 
			 WHERE hdongCode in (select hdongCode 
                                 from wq.code_hdong_bdong 
                                 where bdongCode = @bdongCode)
                                       AND ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
                                       AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
      GROUP BY hdongCode) B
;



## 연령별 비율
select round(sum(B.A10)) as A10, 
       round(sum(B.A20)) as A20, 
       round(sum(B.A30)) as A30, 
       round(sum(B.A40)) as A40, 
       round(sum(B.A50)) as A50, 
       round(sum(B.A60)) as A60
from (SELECT hdongCode, avg(A10) AS A10, avg(A20) AS A20, avg(A30) AS A30, avg(A40) AS A40, avg(A50) AS A50, avg(A60) AS A60
	  FROM
			(SELECT date, weekday, time, hdongCode,
					   M10+M15+F10+F15 AS A10, 
					   M20+M25+F20+F25 AS A20, 
					   M30+M35+F30+F35 AS A30, 
					   M40+M45+F40+F45 AS A40, 
					   M50+M55+F50+F55 AS A50,
					   M60+M65+M70+F60+F65+F70 AS A60
				FROM wq.kr_seoul_living_local 
				WHERE hdongCode in (select hdongCode 
									from wq.code_hdong_bdong 
									where bdongCode = @bdongCode)
					  AND ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
					  AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
		GROUP BY hdongCode) B
;

# 2) 총 가구수(가구), 1인 ~ 6인이상 각각에 대한 가구 수

## 총 가구수(가구)
select sum(genTotal) as genTotalSum
from wq.kr_seoul_gen
where hdongCode in (select hdongCode 
                    from wq.code_hdong_bdong 
					where bdongCode = @bdongCode)
;


## 1인 ~ 6인이상 각각에 대한 가구수
select sum(gen1Cnt) as gen1Cnt,
       sum(gen2Cnt) as gen2Cnt,
       sum(gen3Cnt) as gen3Cnt,
       sum(gen4Cnt) as gen4Cnt,
       sum(gen5Cnt) as gen5Cnt,
       sum(gen6Cnt + gen7Cnt) as gen6Cnt
from wq.kr_seoul_gen
where hdongCode in (select hdongCode 
                    from wq.code_hdong_bdong 
					where bdongCode = @bdongCode)
;


# 3) 총 직장인수(명)
select sum(employeeCnt) as employeeCntSum
from wq.kr_nps t1
left join wq.code_bdong t2
on t1.bdongCode = t2.bdongCode
where t1.bdongCode = @bdongCode
;


# 4) 총 유동인구(명), 성별 비율, 연령별 비율
## 총 유동인구(명)
select round(sum(totalCntAvg)) as totalCntAvgSum
from (select hdongCode, avg(TotalCnt) as totalCntAvg
    	from wq.kr_seoul_living_local
		where hdongCode in (select hdongCode 
							from wq.code_hdong_bdong 
							where bdongCode = @bdongCode) 
								  and (time >= 7 and time <= 18)
                                  and date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()
		group by hdongCode) A
;


## 성별 비율
select round(sum(B.male)) as male, 
       round(sum(B.female)) as female
from (SELECT hdongCode, avg(male) AS male, avg(female) AS female
	  FROM
			(SELECT date, weekday, time, hdongCode,
				    M10+M15+M20+M25+M30+M35+M40+M45+M50+M55+M60+M65+M70 AS male,
				    F10+F15+F20+F25+F30+F35+F40+F45+F50+F55+F60+F65+F70 AS female
			 FROM wq.kr_seoul_living_local 
			 WHERE hdongCode in (select hdongCode 
                                 from wq.code_hdong_bdong 
                                 where bdongCode = @bdongCode)
                                       AND (time >= 7 and time <= 18)
                                       AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
      GROUP BY hdongCode) B
;


## 연령별 비율
select round(sum(B.A10)) as A10, 
       round(sum(B.A20)) as A20, 
       round(sum(B.A30)) as A30, 
       round(sum(B.A40)) as A40, 
       round(sum(B.A50)) as A50, 
       round(sum(B.A60)) as A60
from (SELECT hdongCode, avg(A10) AS A10, avg(A20) AS A20, avg(A30) AS A30, avg(A40) AS A40, avg(A50) AS A50, avg(A60) AS A60
	  FROM
			(SELECT date, weekday, time, hdongCode,
					   M10+M15+F10+F15 AS A10, 
					   M20+M25+F20+F25 AS A20, 
					   M30+M35+F30+F35 AS A30, 
					   M40+M45+F40+F45 AS A40, 
					   M50+M55+F50+F55 AS A50,
					   M60+M65+M70+F60+F65+F70 AS A60
				FROM wq.kr_seoul_living_local 
				WHERE hdongCode in (select hdongCode 
									from wq.code_hdong_bdong 
									where bdongCode = @bdongCode)
					  AND (time >= 7 and time <= 18)
					  AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
		GROUP BY hdongCode) B
;

## 점심
select A.gender, A.age, A.hour, avg(trans_amt) as trans_amt_avg, A.rank_1_bm, A.rank_1_nm
from (select t1.*, 
			   t2.baeminCategoryName as rank_1_bm,
               t2.s_small_category_nm as rank_1_nm,
			   t3.baeminCategoryName as rank_2_bm,
               t3.s_small_category_nm as rank_2_nm,
			   t4.baeminCategoryName as rank_3_bm,
               t4.s_small_category_nm as rank_3_nm
		from wq.kb_delivery_store t1
		left join wq.code_kb_category t2
		on t1.rank_1 = t2.s_small_category_cd
		left join wq.code_kb_category t3
		on t1.rank_2 = t3.s_small_category_cd
		left join wq.code_kb_category t4
		on t1.rank_3 = t4.s_small_category_cd) A
where A.admi_cd = @bdongCode 
     and A.yymm =  (select max(yymm) from wq.kb_delivery_store) 
     and A.age != '기타'
     and A.gender != '기타'
     and A.weekday = 4
     and A.hour = 1114
     and A.rank_1_bm is not null
group by A.gender, A.age, A.hour
order by trans_amt_avg desc
limit 3
;
## 저녁
select A.gender, A.age, A.hour, avg(trans_amt) as trans_amt_avg, A.rank_1_bm, A.rank_1_nm
from (select t1.*, 
			   t2.baeminCategoryName as rank_1_bm,
               t2.s_small_category_nm as rank_1_nm,
			   t3.baeminCategoryName as rank_2_bm,
               t3.s_small_category_nm as rank_2_nm,
			   t4.baeminCategoryName as rank_3_bm,
               t4.s_small_category_nm as rank_3_nm
		from wq.kb_delivery_store t1
		left join wq.code_kb_category t2
		on t1.rank_1 = t2.s_small_category_cd
		left join wq.code_kb_category t3
		on t1.rank_2 = t3.s_small_category_cd
		left join wq.code_kb_category t4
		on t1.rank_3 = t4.s_small_category_cd) A
where A.admi_cd = @bdongCode 
     and A.yymm =  (select max(yymm) from wq.kb_delivery_store) 
     and A.age != '기타'
     and A.gender != '기타'
     and A.weekday = 4
     and A.hour = 1721
     and A.rank_1_bm is not null
group by A.gender, A.age, A.hour
order by trans_amt_avg desc
limit 3
;
## 야식
select A.gender, A.age, A.hour, avg(trans_amt) as trans_amt_avg, A.rank_1_bm, A.rank_1_nm
from (select t1.*, 
			   t2.baeminCategoryName as rank_1_bm,
               t2.s_small_category_nm as rank_1_nm,
			   t3.baeminCategoryName as rank_2_bm,
               t3.s_small_category_nm as rank_2_nm,
			   t4.baeminCategoryName as rank_3_bm,
               t4.s_small_category_nm as rank_3_nm
		from wq.kb_delivery_store t1
		left join wq.code_kb_category t2
		on t1.rank_1 = t2.s_small_category_cd
		left join wq.code_kb_category t3
		on t1.rank_2 = t3.s_small_category_cd
		left join wq.code_kb_category t4
		on t1.rank_3 = t4.s_small_category_cd) A
where A.admi_cd = @bdongCode 
     and A.yymm =  (select max(yymm) from wq.kb_delivery_store) 
     and A.age != '기타'
     and A.gender != '기타'
     and A.weekday = 4
     and A.hour = 2124
     and A.rank_1_bm is not null
group by A.gender, A.age, A.hour
order by trans_amt_avg desc
limit 3
;

## 입지 분석 초기 쿼리

select T1.*, 
       T2.w_total_amt_avg as transAmt,
       T2.w_total_amt_avg_ratio as transAmtRatio,
       T2.w_total_cnt_avg as transCnt,
       T2.w_total_cnt_avg_ratio as transCntRatio,
       @totalCntResid := (select round(sum(totalCntAvg)) as totalCntAvgSum
		from (select hdongCode, avg(TotalCnt) as totalCntAvg
			  from wq.kr_seoul_living_local
			  where hdongCode in (select hdongCode 
								  from wq.code_hdong_bdong 
								  where bdongCode = @bdongCode) 
					and ((time >= 19 and time <= 23) or (time >= 0 and time <= 6))
					and date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()
			   group by hdongCode) A) as totalCntResid,
       # 1) 매출비율 / 업종비율
	   round(T2.w_total_amt_avg_ratio / T1.storeCntRatio, 2) as amtRatio_per_storeRatio,
       # 2) 주거인구수 / 업종수
       round(@totalCntResid / T1.storeCnt) as resid_per_store
from (select A.bdongCode, A.bdongName, B.baeminCategoryName, 
			   count(*) as storeCnt,
			   count(*) / sum(count(*)) over() as storeCntRatio
		from wq.kr_stores_restaurant A
		join wq.commercial_business_category_code B
		on A.smallCode = B.smallCode
		where A.largeCode ='Q' 
			 and B.baeminCategoryName is not null 
			 and A.bdongCode = @bdongCode
		group by B.baeminCategoryName) T1
left join (select g1.*, 
				round(g1.w_total_cnt_avg / (select sum(w_total_cnt_avg) as w_total_cnt_avg_sum
											from (select t1.baeminCategoryName, 
														   avg(w_total_cnt) as w_total_cnt_avg, 
														   avg(w_total_amt) as w_total_amt_avg
													from (select B.baeminCategoryName, B.s_small_category_nm, A.*
														  from wq.kb_delivery_prep A
														  join wq.code_kb_category B
														  on A.s_small_category_cd = B.s_small_category_cd
														  join wq.code_bdong C
														  on A.admi_cd = C.bdongCode
														  where B.baeminCategoryName is not null 
																and A.admi_cd = @bdongCode) t1
													group by t1.baeminCategoryName
													order by w_total_amt_avg desc
													) t2),4) as w_total_cnt_avg_ratio,
				round(g1.w_total_amt_avg / (select sum(w_total_amt_avg) as w_total_amt_avg_sum
											from (select t1.baeminCategoryName, 
														   avg(w_total_cnt) as w_total_cnt_avg, 
														   avg(w_total_amt) as w_total_amt_avg
													from (select B.baeminCategoryName, B.s_small_category_nm, A.*
														  from wq.kb_delivery_prep A
														  join wq.code_kb_category B
														  on A.s_small_category_cd = B.s_small_category_cd
														  join wq.code_bdong C
														  on A.admi_cd = C.bdongCode
														  where B.baeminCategoryName is not null 
																and A.admi_cd = @bdongCode) t1
													group by t1.baeminCategoryName
													order by w_total_amt_avg desc
													) t2),4) as w_total_amt_avg_ratio
		from (select t1.baeminCategoryName, 
					   avg(w_total_cnt) as w_total_cnt_avg, 
					   avg(w_total_amt) as w_total_amt_avg
				from (select B.baeminCategoryName, B.s_small_category_nm, A.*
					  from wq.kb_delivery_prep A
					  join wq.code_kb_category B
					  on A.s_small_category_cd = B.s_small_category_cd
					  join wq.code_bdong C
					  on A.admi_cd = C.bdongCode
					  where B.baeminCategoryName is not null 
							and A.admi_cd = @bdongCode) t1
				group by t1.baeminCategoryName
				order by w_total_amt_avg desc) g1) T2
on T1.baeminCategoryName = T2.baeminCategoryName
where T2.baeminCategoryName is not null
;