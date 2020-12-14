import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/core';

@Entity({ name: 'analysis_summary_index_test' })
export class AnalysisSummaryIndex extends BaseEntity<AnalysisSummaryIndex> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  bdongCode?: string;

  @Column({
    type: 'json',
  })
  result?: any;

  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt?: Date;
}
