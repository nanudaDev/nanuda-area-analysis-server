import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { CodeStores } from '../code-stores.entity';

export class CodeStoresListDto extends BaseDto<CodeStoresListDto>
  implements Partial<CodeStores> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  codeNum?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  largeCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  largeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  middleCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  middleName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  smallCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  smallName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderById?: ORDER_BY_VALUE;
}
