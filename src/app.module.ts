import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
require('dotenv').config();
const env = process.env;

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
