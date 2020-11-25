import { BaseEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'code-bdong' })
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
}
