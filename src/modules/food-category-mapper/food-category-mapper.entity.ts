import { ENVIRONMENT } from 'src/config';
import { BaseCreatedEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaeminCategory } from '../baemin-category/baemin-category.entity';
import { CommericialBizCatCode } from '../commercial-business-category-code/commercial-biz-code.entity';

require('dotenv').config();

let tableName = 'food_category_mapper_test';
if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
  tableName = 'food_category_mapper';
}
@Entity({ name: tableName })
export class FoodCategoryMapper extends BaseCreatedEntity<FoodCategoryMapper> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  baeminCategoryId: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  commercialCategoryId?: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  kbCategoryId?: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  licenseCategoryId?: number;

  @ManyToOne(
    type => BaeminCategory,
    baeminCategory => baeminCategory.foodCategories,
  )
  @JoinColumn({ name: 'baeminCategoryId' })
  baeminCategory?: BaeminCategory;

  @ManyToOne(
    type => CommericialBizCatCode,
    commercialCode => commercialCode.foodCategories,
  )
  @JoinColumn({ name: 'commercialCategoryId' })
  commercialCode?: CommericialBizCatCode;
}
