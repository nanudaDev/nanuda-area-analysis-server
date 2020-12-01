import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';

@Injectable()
export class KrLicenseBatchService extends BaseService {
  constructor() {
    super();
  }
}
