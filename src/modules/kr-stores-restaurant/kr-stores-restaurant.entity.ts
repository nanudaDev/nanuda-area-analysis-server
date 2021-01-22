import { BaseCreatedEntity } from 'src/core';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'kr_stores_restaurant' })
export class KrStoresRestaurant extends BaseCreatedEntity<KrStoresRestaurant> {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'text',
  })
  storeName?: string;

  @Column({
    type: 'text',
  })
  largeCode?: string;

  @Column({
    type: 'text',
  })
  largeName?: string;

  @Column({
    type: 'text',
  })
  middleCode?: string;

  @Column({
    type: 'text',
  })
  middleName?: string;

  @Column({
    type: 'text',
  })
  smallCode?: string;

  @Column({
    type: 'text',
  })
  smallName?: string;

  @Column({
    type: 'text',
  })
  hdongCode?: string;

  @Column({
    type: 'text',
  })
  hdongName?: string;

  @Column({
    type: 'text',
  })
  bdongCode?: string;

  @Column({
    type: 'text',
  })
  bdongName?: string;
}
