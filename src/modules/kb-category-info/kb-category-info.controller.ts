import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { KbCategoryInfoListDto } from './dto';
import { KbCategoryInfo } from './kb-category-info.entity';
import { KbCategoryInfoService } from './kb-category-info.service';

@Controller()
@ApiTags('KB국민카드 업종분류코드')
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
// @ApiBearerAuth()
export class KbCategoryInfoController extends BaseController {
  constructor(private readonly kbCategoryInfoService: KbCategoryInfoService) {
    super();
  }

  /**
   * find all
   * @param kbCategoryInfoListDto
   * @param pagination
   */
  @Get('/kb-category-info')
  async findAll(
    @Query() kbCategoryInfoListDto: KbCategoryInfoListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<KbCategoryInfo>> {
    return await this.kbCategoryInfoService.findAll(
      kbCategoryInfoListDto,
      pagination,
    );
  }
}
