import { BaseCreatedEntity } from 'src/core';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FoodCategoryMapper } from '../food-category-mapper/food-category-mapper.entity';

@Entity({ name: 'commercial_business_category_code' })
export class CommericialBizCatCode extends BaseCreatedEntity<
  CommericialBizCatCode
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  middleCode: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  middleName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  smallCode: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  smallName: string;

  @OneToMany(
    type => FoodCategoryMapper,
    foodCategoryMapper => foodCategoryMapper.commercialCode,
  )
  foodCategories?: FoodCategoryMapper[];
}
