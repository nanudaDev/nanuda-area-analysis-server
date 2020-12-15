import { BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { KbCategoryInfo } from '../kb-category-info/kb-category-info.entity';

@Entity({ name: 'kb_delivery_prep' })
export class KbDeliveryPrep extends BaseEntity<KbDeliveryPrep> {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'admi_cd',
  })
  bdongCode: number;

  @Column({
    type: 'text',
    name: 'medium_category_cd',
  })
  mediumCategoryCd: string;

  @Column({
    type: 'text',
    name: 's_small_category_cd',
  })
  sSmallCategoryCd: string;

  @Column({
    type: 'bigint',
    name: 'total_amt',
  })
  totalAmt: number;

  @Column({
    type: 'bigint',
    name: 'store_cnt',
  })
  storeCnt?: number;

  @OneToOne(type => KbCategoryInfo)
  @JoinColumn({
    name: 's_small_category_cd',
    referencedColumnName: 'sSmallCategoryCd',
  })
  kbCategoryInfo?: KbCategoryInfo;
}
