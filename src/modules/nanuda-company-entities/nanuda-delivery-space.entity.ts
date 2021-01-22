import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { BaseEntity, SPACE, SPACE_PIC_STATUS } from 'src/core';
import { YN } from 'src/common';
import { CompanyDistrict } from './nanuda-company-district.entity';

@Entity({ name: 'B2B_DELIVERY_SPACE' })
export class DeliverySpace extends BaseEntity<DeliverySpace> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'TYPE_NAME',
    nullable: false,
  })
  typeName: string;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
  })
  adminNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
  })
  companyUserNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_NO',
  })
  companyDistrictNo?: number;

  @Column('varchar', {
    length: 100,
    name: 'BUILDING_NAME',
  })
  buildingName?: string;

  @Column({
    name: 'SIZE',
    type: 'int',
  })
  size?: number;

  @Column({
    type: 'int',
    name: 'QUANTITY',
    default: 1,
  })
  quantity: number;

  @Column('int', {
    name: 'DEPOSIT',
  })
  deposit?: number;

  @Column({
    type: 'int',
    name: 'VIEW_COUNT',
    default: 0,
  })
  viewCount?: number;

  @Column('int', {
    name: 'MONTHLY_UTILITY_FEE',
  })
  monthlyUtilityFee?: number;

  @Column('int', {
    name: 'MONTHLY_RENT_FEE',
  })
  monthlyRentFee?: number;

  @Column({
    type: 'text',
    name: 'DESC',
  })
  desc?: string;

  @Column('char', {
    length: 1,
    name: 'SHOW_YN',
    nullable: false,
    default: YN.NO,
  })
  showYn?: YN;

  @Column({
    type: 'char',
    name: 'IS_OPENED_YN',
    // 오픈 후 짬 타서 기본 값 변경
    default: YN.YES,
  })
  isOpenedYn?: YN;

  @Column('char', {
    length: 1,
    name: 'DEL_YN',
    nullable: false,
    default: YN.NO,
  })
  delYn?: YN;

  @Column({
    type: 'varchar',
    name: 'PIC_STATUS',
    default: SPACE_PIC_STATUS.EMPTY,
    nullable: false,
  })
  picStatus: SPACE_PIC_STATUS;

  // no database
  @Column({
    type: 'int',
    name: 'REMAINING_COUNT',
  })
  remainingCount?: number;

  // no database
  likedCount?: number;

  likedYn?: boolean;

  favoriteSpaceNo?: number;

  consultCount?: number;

  @ManyToOne(
    type => CompanyDistrict,
    companyDistrict => companyDistrict.deliverySpaces,
  )
  @JoinColumn({ name: 'COMPANY_DISTRICT_NO' })
  companyDistrict?: CompanyDistrict;
}
