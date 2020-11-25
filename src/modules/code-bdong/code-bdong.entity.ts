import { BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeHdong } from '../code-hdong/code-hdong.entity';

@Entity({ name: 'code_bdong' })
export class CodeBdong extends BaseEntity<CodeBdong> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  bdongCode: string;

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
  bdongName: string;

  @ManyToMany(
    type => CodeHdong,
    hCode => hCode.bCodes,
  )
  @JoinTable({
    name: 'code_hdong_bdong',
    joinColumn: {
      name: 'bdongCode',
      referencedColumnName: 'bdongCode',
    },
    inverseJoinColumn: {
      name: 'hdongCode',
      referencedColumnName: 'hdongCode',
    },
  })
  hCodes?: CodeHdong[];
}
