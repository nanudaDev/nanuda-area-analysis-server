require('dotenv').config();
const env = process.env;
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TypeOrmConfigService } from './config';
import { LoggingInterceptor } from './core';
import { CodeBdongModule, CodeHdongModule } from './modules';

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
      entities: [],
      synchronize: false,
    }),
    CodeBdongModule,
    CodeHdongModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
