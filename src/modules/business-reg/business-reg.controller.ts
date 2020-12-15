import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { BusinessRegService } from './business-reg.service';
import { BusinessRegListDto } from './dto';

@Controller()
@ApiTags('입지 분석 엔드포인트')
export class BusinessRegController extends BaseController {
  constructor(private readonly businessRegService: BusinessRegService) {
    super();
  }

  // @Get('/location-analysis/average-district-price')
  // async findAverage(@Query() businessRegListDto: BusinessRegListDto) {
  //   return await this.businessRegService.findAverageStartUpFee(
  //     businessRegListDto,
  //   );
  // }

  /**
   * 비교하기
   * @param businessRegListDto
   * @param deliverySpaceNo
   */
  @Get('/location-analysis/delivery-space/:id([0-9]+)/compare-to-average')
  async findAverageDeliverySpace(
    @Query() businessRegListDto: BusinessRegListDto,
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
  ) {
    return await this.businessRegService.compareDistrictPriceWithAverage(
      businessRegListDto,
      deliverySpaceNo,
    );
  }
}
