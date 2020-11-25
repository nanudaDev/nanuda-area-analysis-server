import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { CodeBdong } from '../code-bdong.entity';

export class CodeBdongListDto extends BaseDto<CodeBdongListDto>
  implements Partial<CodeBdong> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  bdongCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  bdongName: string;

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
