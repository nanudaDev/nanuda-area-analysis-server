import { BaseEntity } from 'src/core';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { FoodCategoryMapper } from '../food-category-mapper/food-category-mapper.entity';

@Entity({ name: 'kb_category_info' })
export class KbCategoryInfo extends BaseEntity<KbCategoryInfo> {
  @PrimaryColumn({
    type: 'varchar',
    name: 's_small_category_cd',
  })
  sSmallCategoryCd: string;

  @Column({
    type: 'int',
    unique: true,
    unsigned: true,
    nullable: false,
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'small_category_nm',
  })
  sSmallCategoryNm: string;

  @Column({
    type: 'varchar',
    name: 'small_category_cd',
  })
  smallCategoryCd: string;

  @Column({
    type: 'varchar',
    name: 'small_category_nm',
  })
  smallCategoryNm: string;

  @Column({
    type: 'varchar',
    name: 'medium_category_cd',
  })
  mediumCategoryCd: string;

  @Column({
    type: 'varchar',
    name: 'medium_category_nm',
  })
  mediumCategoryNm: string;

  @Column({
    type: 'varchar',
    name: 'large_category_cd',
  })
  largeCategoryCd: string;

  @Column({
    type: 'varchar',
    name: 'large_category_nm',
  })
  largeCategoryNm: string;

  @Column({
    type: 'datetime',
    name: 'TIME_STAMP',
  })
  created: Date;

  @OneToMany(
    type => FoodCategoryMapper,
    foodCategoryMapper => foodCategoryMapper.kbCategory,
  )
  foodCategories?: FoodCategoryMapper[];
}
