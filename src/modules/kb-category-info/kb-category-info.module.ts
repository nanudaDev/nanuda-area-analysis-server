import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KbCategoryInfoController } from './kb-category-info.controller';
import { KbCategoryInfo } from './kb-category-info.entity';
import { KbCategoryInfoService } from './kb-category-info.service';

@Module({
  imports: [TypeOrmModule.forFeature([KbCategoryInfo])],
  controllers: [KbCategoryInfoController],
  providers: [KbCategoryInfoService],
})
export class KbCategoryInfoModule {}
