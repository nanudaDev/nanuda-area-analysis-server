import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { BaeminCategory } from '../baemin-category.entity';

export class BaeminCategoryListDto extends BaseDto<BaeminCategoryListDto>
  implements Partial<BaeminCategory> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryNameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryNameKr?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE, isArray: true })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderById?: ORDER_BY_VALUE;
}
