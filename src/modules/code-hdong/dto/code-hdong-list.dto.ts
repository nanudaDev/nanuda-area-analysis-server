import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsEnum } from 'class-validator';
import { ORDER_BY_VALUE, Default } from 'src/common';
import { BaseDto } from 'src/core';
import { CodeHdong } from '../code-hdong.entity';

export class CodeHdongListDto extends BaseDto<CodeHdongListDto>
  implements Partial<CodeHdong> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  guName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sidoName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderById?: ORDER_BY_VALUE;
}
