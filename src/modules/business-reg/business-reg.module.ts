import { Module } from '@nestjs/common';
import { BusinessRegController } from './business-reg.controller';
import { BusinessRegService } from './business-reg.service';

@Module({
  imports: [],
  controllers: [BusinessRegController],
  providers: [BusinessRegService],
})
export class BusinessRegModule {}
