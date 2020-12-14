import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KrLicenseCodeController } from './kr-license-code.controller';
import { KrLicenseCode } from './kr-license-code.entity';
import { KrLicenseCodeService } from './kr-license-code.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([KrLicenseCode]),
    ScheduleModule.forRoot(),
  ],
  controllers: [KrLicenseCodeController],
  providers: [KrLicenseCodeService],
})
export class KrLicenseCodeModule {}
