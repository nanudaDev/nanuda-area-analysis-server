import { BaseCreatedEntity } from 'src/core';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FoodCategoryMapper } from '../food-category-mapper/food-category-mapper.entity';

@Entity({ name: 'kr_license_code' })
export class KrLicenseCode extends BaseCreatedEntity<KrLicenseCode> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  storeCategoryCode: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  storeCategory: string;

  @Column({
    type: 'varchar',
  })
  baeminCategoryName?: string;

  @OneToMany(
    type => FoodCategoryMapper,
    foodCategoryMapper => foodCategoryMapper.license,
  )
  foodCategories?: FoodCategoryMapper[];
}
