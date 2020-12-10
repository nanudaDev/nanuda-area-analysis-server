import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  /**
   * 음식 매점 수
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/get-summary')
  async analysisSummary(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.analysisSummary(analysisTabListDto);
  }

  /**
   * category 별 비중
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/category-ratio')
  async categoryRatio(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.categoryRatio(analysisTabListDto);
  }

  /**
   * 매출 분석
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/revenue-analysis-gender')
  async revenueAnalysisGender(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.revenueAnalysisGender(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/revenue-analysis-age-group')
  async revenueAnalysisAgeGroup(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.revenueAnalysisAgeGroup(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/revenue-analysis-by-day')
  async revenueAnalysisByDay(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.revenueAnalysisByDay(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/food-category-summary')
  async categoryAnalysisSummary(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.categoryCompetitionSummary(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/survival-years')
  async categoryAnalysisSurvivalYears(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.averageSurvivalYears(
      analysisTabListDto,
    );
  }
}
