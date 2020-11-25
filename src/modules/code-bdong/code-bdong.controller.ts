import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { CodeBdongService } from './code-bdong.service';

@Controller()
@ApiTags('법정동 코드')
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
// @ApiBearerAuth()
export class CodeBdongController extends BaseController {
  constructor(private readonly codeBdongService: CodeBdongService) {
    super();
  }
}
