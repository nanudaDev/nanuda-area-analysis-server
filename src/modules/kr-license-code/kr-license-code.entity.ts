import { YN } from 'src/common';
import { ENVIRONMENT } from 'src/config';
import { BaseCreatedEntity } from 'src/core';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FoodCategoryMapper } from '../food-category-mapper/food-category-mapper.entity';

require('dotenv').config();

let tableName = 'kr_license_test';
if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
  tableName = 'kr_license_code';
}
@Entity({ name: tableName })
export class KrLicenseCode extends BaseCreatedEntity<KrLicenseCode> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  //   @Column({
  //     type: 'varchar',
  //     nullable: false,
  //   })
  //   storeCategoryCode: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  storeCategory: string;

  @Column({
    type: 'varchar',
  })
  addressJibun?: string;

  @Column({
    type: 'varchar',
  })
  hdongCode?: string;

  @Column({
    type: 'varchar',
  })
  bdongCode?: string;

  //   @Column({
  //     type: 'varchar',
  //   })
  //   baeminCategoryName?: string;

  @Column({
    type: 'varchar',
  })
  x?: string;

  @Column({
    type: 'varchar',
  })
  y?: string;

  @Column({
    type: 'char',
  })
  unchecked?: YN;
}
