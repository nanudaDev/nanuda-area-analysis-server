import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { CodeHdong } from './code-hdong.entity';

@Injectable()
export class CodeHdongService extends BaseService {
  constructor(
    @InjectRepository(CodeHdong)
    private readonly codeHdongRepo: Repository<CodeHdong>,
  ) {
    super();
  }
}
