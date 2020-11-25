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
import { CodeBdong } from './code-bdong.entity';
import { CodeBdongService } from './code-bdong.service';
import { CodeBdongListDto } from './dto';

@Controller()
@ApiTags('법정동 코드')
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
// @ApiBearerAuth()
export class CodeBdongController extends BaseController {
  constructor(private readonly codeBdongService: CodeBdongService) {
    super();
  }

  /**
   * find all
   * @param codeBdongListDto
   * @param pagination
   */
  @Get('/code-bdong')
  async findAll(
    @Query() codeBdongListDto: CodeBdongListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeBdong>> {
    return await this.codeBdongService.findAll(codeBdongListDto, pagination);
  }

  /**
   * find one
   * @param id
   */
  @Get('/code-bdong/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CodeBdong> {
    return await this.codeBdongService.findOne(id);
  }
}
