import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeHdongController } from './code-hdong.controller';
import { CodeHdong } from './code-hdong.entity';
import { CodeHdongService } from './code-hdong.service';

@Module({
  imports: [TypeOrmModule.forFeature([CodeHdong])],
  controllers: [CodeHdongController],
  providers: [CodeHdongService],
})
export class CodeHdongModule {}
