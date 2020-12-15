import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { AnalysisTabListDto } from 'src/modules/analysis-tab/dto';

export class BusinessRegListDto extends AnalysisTabListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region1DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region2DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region3DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  bCode?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
