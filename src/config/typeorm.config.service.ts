/* eslint-disable @typescript-eslint/no-unused-vars */
import Debug from 'debug';
import { basename } from 'path';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// for webpack:hmr
import { getMetadataArgsStorage } from 'typeorm';
require('dotenv').config();
const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);
const env = process.env;
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'mysql',
      host: env.ANALYSIS_DB_HOST,
      port: Number(env.ANALYSIS_DB_PORT),
      username: env.ANALYSIS_DB_USERNAME,
      password: env.ANALYSIS_DB_PASSWORD,
      database: env.ANALYSIS_DB_DATABASE,
      keepConnectionAlive: false,
      // bigNumberStrings: true,
      // supportBigNumbers: true,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: false,
      connectTimeout: 20000,
    };
  }
}
