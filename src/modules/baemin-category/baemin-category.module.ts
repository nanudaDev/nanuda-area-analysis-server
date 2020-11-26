import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaeminCategoryController } from './baemin-category.controller';
import { BaeminCategory } from './baemin-category.entity';
import { BaeminCategoryService } from './baemin-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([BaeminCategory])],
  controllers: [BaeminCategoryController],
  providers: [BaeminCategoryService],
})
export class BaeminCategoryModule {}
