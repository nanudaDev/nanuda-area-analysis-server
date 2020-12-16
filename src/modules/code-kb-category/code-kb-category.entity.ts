import { BaseCreatedEntity } from 'src/core';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'code_kb_category' })
export class CodeKbCategory extends BaseCreatedEntity<CodeKbCategory> {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'medium_category_cd',
  })
  mediumCategoryCd?: string;

  @Column({
    type: 'varchar',
    name: 'medium_category_nm',
  })
  mediumCategoryName?: string;

  @Column({
    type: 'varchar',
    name: 's_small_category_cd',
  })
  smallCategoryCd?: string;

  @Column({
    type: 'varchar',
    name: 's_small_category_nm',
  })
  smallCategoryName?: string;

  @Column({
    type: 'varchar',
    name: 'baeminCategoryName',
  })
  baeminCategoryName?: string;
}
