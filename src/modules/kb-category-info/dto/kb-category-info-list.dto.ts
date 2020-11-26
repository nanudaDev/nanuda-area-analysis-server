import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { KbCategoryInfo } from '../kb-category-info.entity';

export class KbCategoryInfoListDto extends BaseDto<KbCategoryInfoListDto>
  implements Partial<KbCategoryInfo> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sSmallCategoryCd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sSmallCategoryNm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  smallCategoryCd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  smallCategoryNm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediumCategoryCd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediumCategoryNm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  largeCategoryCd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  largeCategoryNm?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE, isArray: true })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByCreated?: ORDER_BY_VALUE;
}
