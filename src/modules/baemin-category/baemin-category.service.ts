import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { BaeminCategory } from './baemin-category.entity';

@Injectable()
export class BaeminCategoryService extends BaseService {
  constructor(
    @InjectRepository(BaeminCategory)
    private readonly baeminCategoryRepo: Repository<BaeminCategory>,
    @InjectEntityManager() private readonly wqEntityManager: EntityManager,
  ) {
    super();
  }
}
