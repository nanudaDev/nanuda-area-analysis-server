import { BaseEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'code_stores' })
export class CodeStores extends BaseEntity<CodeStores> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'text',
  })
  codeNum: string;

  @Column({
    type: 'text',
  })
  largeCode: string;

  @Column({
    type: 'text',
  })
  largeName: string;

  @Column({
    type: 'text',
  })
  middleCode: string;

  @Column({
    type: 'text',
  })
  middleName: string;

  @Column({
    type: 'text',
  })
  smallCode: string;

  @Column({
    type: 'text',
  })
  smallName: string;
}
