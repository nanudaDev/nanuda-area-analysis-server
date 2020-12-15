require('dotenv').config();
const env = process.env;
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TypeOrmConfigService } from './config';
import { LoggingInterceptor } from './core';
import {
  AnalysisTabModule,
  BaeminCategoryModule,
  BusinessRegModule,
  CodeBdongModule,
  CodeHdongModule,
  KbCategoryInfoModule,
  KrLicenseCodeModule,
} from './modules';
import { CompanyDistrict } from './modules/nanuda-company-entities/nanuda-company-district.entity';
import { Company } from './modules/nanuda-company-entities/nanuda-company.entity';
import { DeliverySpace } from './modules/nanuda-company-entities/nanuda-delivery-space.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forRoot({
      name: 'nanuda',
      type: 'mysql' as 'mysql',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      // won't need to keep alive
      //   keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: [Company, CompanyDistrict, DeliverySpace],
      synchronize: false,
    }),
    AnalysisTabModule,
    BaeminCategoryModule,
    BusinessRegModule,
    CodeBdongModule,
    CodeHdongModule,
    KbCategoryInfoModule,
    KrLicenseCodeModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
