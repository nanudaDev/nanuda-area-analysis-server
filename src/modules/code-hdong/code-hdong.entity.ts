import { BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeBdong } from '../code-bdong/code-bdong.entity';

@Entity({ name: 'code_hdong' })
export class CodeHdong extends BaseEntity<CodeHdong> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  hdongCode: string;

  @Column({
    type: 'varchar',
  })
  sidoName: string;

  @Column({
    type: 'varchar',
  })
  guName: string;

  @Column({
    type: 'varchar',
  })
  hdongName: string;

  @ManyToMany(
    type => CodeBdong,
    bCode => bCode.hCodes,
  )
  @JoinTable({
    name: 'code_hdong_bdong',
    joinColumn: {
      name: 'hdongCode',
      referencedColumnName: 'hdongCode',
    },
    inverseJoinColumn: {
      name: 'bdongCode',
      referencedColumnName: 'bdongCode',
    },
  })
  bCodes?: CodeBdong[];
}
