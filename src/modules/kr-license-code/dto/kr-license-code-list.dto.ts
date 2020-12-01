import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { KrLicenseCode } from '../kr-license-code.entity';

export class KrLicenseCodeListDto extends BaseDto<KrLicenseCodeListDto>
  implements Partial<KrLicenseCode> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  storeCategory?: string;

  //   @ApiPropertyOptional()
  //   @IsOptional()
  //   @Expose()
  //   storeCategoryCode?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderById?: ORDER_BY_VALUE;
}
