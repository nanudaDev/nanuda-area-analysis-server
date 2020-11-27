import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';

@Injectable()
export class KrLicenseCodeService extends BaseService {
  constructor() {
    super();
  }
}
