import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeBdongController } from './code-bdong.controller';
import { CodeBdong } from './code-bdong.entity';
import { CodeBdongService } from './code-bdong.service';

@Module({
  imports: [TypeOrmModule.forFeature([CodeBdong])],
  controllers: [CodeBdongController],
  providers: [CodeBdongService],
})
export class CodeBdongModule {}
