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
import { CodeHdong } from './code-hdong.entity';
import { CodeHdongService } from './code-hdong.service';
import { CodeHdongListDto } from './dto';

@Controller()
@ApiTags('행정동 코드')
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
// @ApiBearerAuth()
export class CodeHdongController extends BaseController {
  constructor(private readonly codeHdongService: CodeHdongService) {
    super();
  }

  /**
   * find all code hdong
   * @param codeHdongListDto
   * @param pagination
   */
  @Get('/code-hdong')
  async findAll(
    @Query() codeHdongListDto: CodeHdongListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeHdong>> {
    return await this.codeHdongService.findAll(codeHdongListDto, pagination);
  }

  /**
   * find one
   * @param id
   */
  @Get('/code-hdong/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CodeHdong> {
    return await this.codeHdongService.findOne(id);
  }
}
