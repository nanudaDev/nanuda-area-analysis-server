import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { BaeminCategoryCode } from 'src/shared';

export class AnalysisTabListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  bdongCode?: string;

  @ApiPropertyOptional({ enum: BaeminCategoryCode })
  @IsOptional()
  @Expose()
  @IsEnum(BaeminCategoryCode)
  baeminCategoryName?: BaeminCategoryCode;
}
