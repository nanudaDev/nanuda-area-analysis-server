import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity, APPROVAL_STATUS } from 'src/core';
import { Company } from './nanuda-company.entity';
import { DeliverySpace } from './nanuda-delivery-space.entity';

@Entity({ name: 'COMPANY_DISTRICT' })
export class CompanyDistrict extends BaseEntity<CompanyDistrict> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column('int', {
    nullable: false,
    name: 'COMPANY_NO',
  })
  companyNo: number;

  @Column('varchar', {
    nullable: false,
    name: 'NAME_KR',
    length: 45,
  })
  nameKr: string;

  @Column('varchar', {
    nullable: true,
    name: 'NAME_ENG',
    length: 45,
  })
  nameEng?: string;

  @Column('varchar', {
    name: 'ADDRESS',
    length: 500,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'varchar',
    name: 'REGION_1DEPTH_NAME',
  })
  region1DepthName?: string;

  @Column({
    type: 'varchar',
    name: 'REGION_2DEPTH_NAME',
  })
  region2DepthName?: string;

  @Column({
    type: 'varchar',
    name: 'REGION_3DEPTH_NAME',
  })
  region3DepthName?: string;

  // @Column('varchar', {
  //   length: 20,
  //   name: 'SPACE_SCORE',
  //   nullable: true,
  // })
  // spaceScore?: string;

  // @Column('varchar', {
  //   length: 20,
  //   name: 'ANALYSIS_SCORE',
  //   nullable: true,
  // })
  // analysisScore?: string;

  // @Column('varchar', {
  //   length: 20,
  //   name: 'KB_SCORE',
  //   nullable: true,
  // })
  // kbScore?: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    name: 'LAT',
  })
  lat?: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    name: 'LON',
  })
  lon?: string;

  @Column({
    name: 'H_CODE',
    type: 'varchar',
  })
  hCode?: string;

  @Column({
    name: 'B_CODE',
    type: 'varchar',
  })
  bCode?: string;

  @Column('varchar', {
    name: 'COMPANY_DISTRICT_STATUS',
    default: APPROVAL_STATUS.NEED_APPROVAL,
    nullable: false,
  })
  companyDistrictStatus: APPROVAL_STATUS;

  // @Column('json', {
  //   name: 'VICINITY_INFO',
  // })
  // vicinityInfo?: object;

  @ManyToOne(
    type => Company,
    company => company.companyDistricts,
  )
  @JoinColumn({ name: 'COMPANY_NO' })
  company?: Company;

  @OneToMany(
    type => DeliverySpace,
    deliverySpace => deliverySpace.companyDistrict,
  )
  deliverySpaces?: DeliverySpace[];
}
