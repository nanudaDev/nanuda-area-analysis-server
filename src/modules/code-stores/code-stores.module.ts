import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeStores } from './code-stores.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeStores])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CodeStoresModule {}
