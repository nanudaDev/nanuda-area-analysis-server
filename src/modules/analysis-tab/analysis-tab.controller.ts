import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { AnalysisTabService } from './analysis-tab.service';
import { AnalysisTabListDto } from './dto';

@Controller()
@ApiTags('상권분석 엔드포인트 모집')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AnalysisTabController extends BaseController {
  constructor(private readonly analysisTabService: AnalysisTabService) {
    super();
  }

  @Get('/analysis-tab/get-summary-check-index')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async checkIndexForSummary(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.checkIndex(analysisTabListDto);
  }

  /**
   * 음식 매점 수
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/get-summary')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async analysisSummary(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.analysisSummary(analysisTabListDto);
  }

  /**
   * category 별 비중
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/category-ratio')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async categoryRatio(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.categoryRatio(analysisTabListDto);
  }

  /**
   * 매출 분석
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/revenue-analysis-gender')
  @ApiOperation({ description: '법정동 코드랑 배민 카테고리 명 보낸다' })
  async revenueAnalysisGender(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.revenueAnalysisGender(
      analysisTabListDto,
    );
  }

  /**
   * 나이대 별
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/revenue-analysis-age-group')
  @ApiOperation({ description: '법정동 코드랑 배민 카테고리 명 보낸다' })
  async revenueAnalysisAgeGroup(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.revenueAnalysisAgeGroup(
      analysisTabListDto,
    );
  }

  /**
   * 요일별
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/revenue-analysis-by-day')
  @ApiOperation({ description: '법정동 코드랑 배민 카테고리 명 보낸다' })
  async revenueAnalysisByDay(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.revenueAnalysisByDay(
      analysisTabListDto,
    );
  }

  /**
   * 업종분석
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/food-category-summary')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async categoryAnalysisSummary(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.categoryCompetitionSummary(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/survival-years')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async categoryAnalysisSurvivalYears(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.averageSurvivalYears(
      analysisTabListDto,
    );
  }
}
