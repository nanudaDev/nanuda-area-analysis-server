import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'code_hdong_bdong' })
export class CodeMapperEntity {
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
  hdongCode: string;
}
