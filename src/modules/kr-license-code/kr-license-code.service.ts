import { Get, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import {
  ORDER_BY_VALUE,
  PaginatedRequest,
  PaginatedResponse,
  YN,
} from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { KrLicenseCodeListDto } from './dto';
import { KrLicenseCode } from './kr-license-code.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as Slack from 'slack-node';
import { Request } from 'express';
import * as aligoapi from 'aligoapi';

@Injectable()
export class KrLicenseCodeService extends BaseService {
  constructor(
    @InjectRepository(KrLicenseCode)
    private readonly krLicenseRepo: Repository<KrLicenseCode>,
    @InjectEntityManager() private readonly wqEntityManager: EntityManager,
  ) {
    super();
  }
  slack = new Slack();
  webhookuri = process.env.SYSTEM_TEAM_SLACK_URL;
  /**
   * find all
   * @param krLicenseCodeListDto
   * @param pagination
   */
  async findAll(
    krLicenseCodeListDto: KrLicenseCodeListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<KrLicenseCode>> {
    const qb = this.krLicenseRepo
      .createQueryBuilder('krLicense')
      .WhereAndOrder(krLicenseCodeListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one
   */
  async findOneWithoutCode(): Promise<KrLicenseCode[]> {
    const qb = await this.krLicenseRepo
      .createQueryBuilder('license')
      .where('license.hdongCode IS NULL')
      .andWhere('license.bdongCode IS NULL')
      .andWhere('license.addressJibun like :keyword', { keyword: '서울%' })
      .andWhere('license.unchecked = :unchecked', { unchecked: YN.NO })
      .orderBy('license.id', ORDER_BY_VALUE.ASC)
      .limit(1)
      .getMany();

    return qb;
  }

  /**
   * test
   */

  @Cron('*/1 * * * * *')
  async updateHBCode() {
    const row = await this.findOneWithoutCode();
    if (row.length < 1) {
      return null;
    }
    let entity = row[0];
    console.log(`updating id: ${entity.id}`);
    let latLon = await Axios.get(
      'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
      {
        params: {
          x: entity.x,
          y: entity.y,
          input_coord: 'WTM',
          output_coord: 'WGS84',
        },
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
          mode: 'cors',
        },
      },
    );
    if (latLon.data.documents && latLon.data.documents.length === 0) {
      //   latLon = await Axios.get(
      //     'https://dapi.kakao.com/v2/local/search/keyword.json',
      //     {
      //       params: { query: entity.addressJibun },
      //       headers: {
      //         Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
      //         mode: 'cors',
      //       },
      //     },
      //   );
      //   entity.hdongCode = latLon.data.documents[0].address.h_code;
      //   entity.bdongCode = latLon.data.documents[0].address.b_code;
      entity.unchecked = YN.YES;
      entity = entity.set(entity);
      entity = await this.krLicenseRepo.save(entity);
      return null;
    }
    // region type H
    entity.hdongCode = latLon.data.documents[1].code;
    // region type B
    entity.bdongCode = latLon.data.documents[0].code;
    entity = entity.set(entity);
    return await this.krLicenseRepo.save(entity);
  }

  /**
   * get updated count
   */
  async countUpdatedRows() {
    const qb = await this.krLicenseRepo
      .createQueryBuilder('license')
      .where('license.hdongCode IS NOT NULL')
      .andWhere('license.bdongCode IS NOT NULL')
      .andWhere('license.addressJibun like :keyword', { keyword: '서울%' })
      .andWhere('license.unchecked = :unchecked', { unchecked: YN.NO })
      .getCount();

    await this.sendCountSlack(qb);
    return qb;
  }

  async sendCountSlack(count: number) {
    const qb = await this.krLicenseRepo
      .createQueryBuilder('license')
      .where('license.addressJibun like :keyword', { keyword: '서울%' })
      .getCount();
    const remaining = qb - count;
    const message = {
      text: `배달형 상담신청 안내`,
      username: '인허가 데이터 업데이트 현황',
      attachments: [
        {
          fields: [
            {
              value: `[인혀가 업데이트] 현재 ${count} 데이터가 업데이트 되었습니다. 남은 데이터 수: ${remaining}`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  private __send_slack(message: object) {
    this.slack.setWebhook(this.webhookuri);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }
}
