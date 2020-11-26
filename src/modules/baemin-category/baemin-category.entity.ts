import { BaseCreatedEntity } from 'src/core';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FoodCategoryMapper } from '../food-category-mapper/food-category-mapper.entity';

@Entity({ name: 'baemin_category' })
export class BaeminCategory extends BaseCreatedEntity<BaeminCategory> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  categoryNameKr: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  categoryCode: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  categoryNameEng?: string;

  @OneToMany(
    type => FoodCategoryMapper,
    foodCategoryMapper => foodCategoryMapper.baeminCategory,
  )
  foodCategories?: FoodCategoryMapper[];
}
