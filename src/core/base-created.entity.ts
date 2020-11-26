/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/ban-types */
import { BaseEntity as TypeormBaseEntity, Column } from 'typeorm';
import { BaseDto } from './base.dto';
import { BaseEntity } from './base.entity';

export class BaseCreatedEntity<T> extends BaseEntity<T> {
  // [x: string]: any;

  @Column({
    type: 'datetime',
    default: 'CURRENT_TIMESTAMP',
  })
  created: Date;
}
