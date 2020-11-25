import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { CodeHdongService } from './code-hdong.service';

@Controller()
@ApiTags('행정동 코드')
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
// @ApiBearerAuth()
export class CodeHdongController extends BaseController {
  constructor(private readonly codeHdongService: CodeHdongService) {
    super();
  }
}
