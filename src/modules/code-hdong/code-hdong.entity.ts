import { BaseEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
