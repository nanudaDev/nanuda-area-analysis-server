import { Controller, Get, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { KrLicenseCodeListDto } from './dto';
import { KrLicenseCode } from './kr-license-code.entity';
import { KrLicenseCodeService } from './kr-license-code.service';

@Controller()
@ApiTags('인허가 분류 코드')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class KrLicenseCodeController extends BaseController {
  constructor(private readonly krLicenseService: KrLicenseCodeService) {
    super();
  }

  /**
   * find all
   * @param krLicenseListDto
   * @param pagination
   */
  @Get('/kr-license-code')
  async findAll(
    @Query() krLicenseListDto: KrLicenseCodeListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<KrLicenseCode>> {
    return await this.krLicenseService.findAll(krLicenseListDto, pagination);
  }

  @Get('/kr-license-code-test')
  async findOneTest(): Promise<KrLicenseCode[]> {
    return await this.krLicenseService.findOneWithoutCode();
  }

  @Patch('/test-batch')
  async testBatch() {
    return await this.krLicenseService.updateHBCode();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  @Get('/kr-license-code-update-count')
  async countUpdated(@Req() req: Request) {
    return await this.krLicenseService.countUpdatedRows();
  }
}
