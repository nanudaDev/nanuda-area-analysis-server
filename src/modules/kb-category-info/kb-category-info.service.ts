import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { KbCategoryInfoListDto } from './dto';
import { KbCategoryInfo } from './kb-category-info.entity';

@Injectable()
export class KbCategoryInfoService extends BaseService {
  constructor(
    @InjectRepository(KbCategoryInfo)
    private readonly kbCategoryInfoRepo: Repository<KbCategoryInfo>,
  ) {
    super();
  }

  /**
   * find all
   * @param kbCategoryInfoListDto
   * @param pagination
   */
  async findAll(
    kbCategoryInfoListDto: KbCategoryInfoListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<KbCategoryInfo>> {
    const qb = this.kbCategoryInfoRepo
      .createQueryBuilder('kbCategoryInfo')
      .WhereAndOrder(kbCategoryInfoListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
