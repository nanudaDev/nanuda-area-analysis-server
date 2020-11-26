import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CodeStores } from '../code-stores/code-stores.entity';
import { CommericialBizCatCode } from '../commercial-business-category-code/commercial-biz-code.entity';
import { FoodCategoryMapper } from '../food-category-mapper/food-category-mapper.entity';
import { KbCategoryInfo } from '../kb-category-info/kb-category-info.entity';
import { BaeminCategory } from './baemin-category.entity';
import { BaeminCategoryListDto } from './dto';

@Injectable()
export class BaeminCategoryService extends BaseService {
  constructor(
    @InjectRepository(BaeminCategory)
    private readonly baeminCategoryRepo: Repository<BaeminCategory>,
    @InjectEntityManager() private readonly wqEntityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all
   * @param baeminCategoryListDto
   * @param pagination
   */
  async findAll(
    baeminCategoryListDto: BaeminCategoryListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<BaeminCategory>> {
    const qb = this.baeminCategoryRepo
      .createQueryBuilder('baeminCategory')
      .AndWhereLike(
        'baeminCategory',
        'categoryNameKr',
        baeminCategoryListDto.categoryNameKr,
        baeminCategoryListDto.exclude('categoryNameKr'),
      )
      .AndWhereLike(
        'baeminCategory',
        'categoryNameEng',
        baeminCategoryListDto.categoryNameEng,
        baeminCategoryListDto.exclude('categoryNameEng'),
      )
      .AndWhereEqual(
        'baeminCategory',
        'categoryCode',
        baeminCategoryListDto.categoryCode,
        baeminCategoryListDto.exclude('categoryCode'),
      )
      .WhereAndOrder(baeminCategoryListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one
   * @param id
   */
  async findOne(id: number): Promise<BaeminCategory> {
    const qb = await this.baeminCategoryRepo
      .createQueryBuilder('baeminCategory')
      .CustomLeftJoinAndSelect(['foodCategories'])
      .leftJoinAndSelect('foodCategories.commercialCode', 'commercialCode')
      .leftJoinAndSelect('foodCategories.kbCategory', 'kbCategory')
      .leftJoinAndSelect('foodCategories.license', 'license')
      .where('baeminCategory.id = :id', { id: id })
      .getOne();

    return qb;
  }

  /**
   * testing
   * @param id
   */
  async addToMapper(id: number) {
    const baeminCode = await this.baeminCategoryRepo.findOne(id);
    //   code stores
    const codeStores = await this.wqEntityManager
      .getRepository(CommericialBizCatCode)
      .createQueryBuilder('codeStores')
      .AndWhereLike('codeStores', 'middleName', baeminCode.categoryNameKr)
      .getMany();
    codeStores.map(async codeStore => {
      let newMapper = new FoodCategoryMapper();
      newMapper.baeminCategoryId = baeminCode.id;
      newMapper.commercialCategoryId = codeStore.id;
      newMapper = await this.wqEntityManager.save(newMapper);
    });

    const kbCategories = await this.wqEntityManager
      .getRepository(KbCategoryInfo)
      .createQueryBuilder('kb')
      .AndWhereLike('kb', 'mediumCategoryNm', baeminCode.categoryNameKr)
      .getMany();
    kbCategories.map(async kb => {
      let newMapper = new FoodCategoryMapper();
      newMapper.baeminCategoryId = baeminCode.id;
      newMapper.kbCategoryId = kb.id;
      newMapper = await this.wqEntityManager.save(newMapper);
    });
  }
}
