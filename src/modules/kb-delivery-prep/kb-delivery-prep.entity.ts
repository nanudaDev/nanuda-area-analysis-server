import { BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeBdong } from '../code-bdong/code-bdong.entity';
import { CodeKbCategory } from '../code-kb-category/code-kb-category.entity';
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
    type: 'bigint',
    name: 'yymm',
  })
  yymm?: string;

  @Column({
    type: 'bigint',
    name: 'admi_cd',
  })
  admiCd?: number;

  @Column({
    type: 'text',
    name: 's_small_category_cd',
  })
  sSmallCategoryCd: string;

  @Column({
    type: 'bigint',
    name: 'w_total_amt',
  })
  wTotalAmt: number;

  @Column({
    type: 'bigint',
    name: 'total_amt',
  })
  totalAmt: number;

  @Column({
    type: 'bigint',
    name: 'total_cnt',
  })
  totalCnt: number;

  @Column({
    type: 'bigint',
    name: 'store_cnt',
  })
  storeCnt?: number;

  @Column({
    type: 'bigint',
    name: 'p_store_cnt',
  })
  pStoreCnt?: number;

  movingPopulationCount?: number;

  firstPersonResidentialCount?: number;

  @OneToOne(type => CodeKbCategory)
  @JoinColumn({
    name: 's_small_category_cd',
    referencedColumnName: 'smallCategoryCd',
  })
  kbCategoryInfo?: CodeKbCategory;

  @OneToOne(type => CodeBdong)
  @JoinColumn({
    name: 'admi_cd',
    referencedColumnName: 'bdongCode',
  })
  bdongInfo?: CodeBdong;
}
