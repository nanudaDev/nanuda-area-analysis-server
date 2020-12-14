import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { BaeminCategory } from './baemin-category.entity';
import { BaeminCategoryService } from './baemin-category.service';
import { BaeminCategoryListDto } from './dto';

@Controller()
@ApiTags('배민 음식 카테고리 코드')
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
// @ApiBearerAuth()
export class BaeminCategoryController extends BaseController {
  constructor(private readonly baeminCategoryService: BaeminCategoryService) {
    super();
  }

  /**
   * find all
   * @param baeminCategoryListDto
   * @param pagination
   */
  @Get('/baemin-category')
  async findAll(
    @Query() baeminCategoryListDto: BaeminCategoryListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<BaeminCategory>> {
    return await this.baeminCategoryService.findAll(
      baeminCategoryListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param id
   */
  @Get('/baemin-category/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaeminCategory> {
    return await this.baeminCategoryService.findOne(id);
  }

  /**
   * test
   * @param id
   */
  @Get('/baemin-category/feed-mapper/:id([0-9]+)')
  async feed(@Param('id', ParseIntPipe) id: number) {
    return await this.baeminCategoryService.addToMapper(id);
  }
}
