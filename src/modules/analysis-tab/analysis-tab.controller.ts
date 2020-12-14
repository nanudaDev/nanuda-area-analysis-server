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
   * 점심별
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/revenue-analysis-by-lunch')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findByLunch(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.findBestCategoryByLunch(
      analysisTabListDto,
    );
  }

  /**
   * 저녁별
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/revenue-analysis-by-dinner')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findByDinner(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.findBestCategoryByDinner(
      analysisTabListDto,
    );
  }

  /**
   * 야식별
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/revenue-analysis-by-late-night')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findByLateNight(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.findBestCategoryByLateNight(
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

  /**
   * 총 주거 인구수
   * @param analysisTabListDto
   */
  @Get('/analysis-tab/population/resident-count')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findResCount(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.findResidentialPopulationCount(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/population/gender-ratio')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findGenderRatio(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.findGenderRatio(analysisTabListDto);
  }

  @Get('/analysis-tab/population/age-group-ratio')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findAgeRatio(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.findAgeGroupRatio(analysisTabListDto);
  }

  @Get('/analysis-tab/population/residential-ratio')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findResidentialRatio(@Query() analysisTabListDto: AnalysisTabListDto) {
    return await this.analysisTabService.findResidentialRatio(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/population/employee-count')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findTotalEmployeeCount(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.findTotalEmployeeCount(
      analysisTabListDto,
    );
  }

  @Get('/analysis-tab/population/moving-population-count')
  @ApiOperation({ description: '법정동 코드만 보낸다' })
  async findMovingPopulationCount(
    @Query() analysisTabListDto: AnalysisTabListDto,
  ) {
    return await this.analysisTabService.findMovingPopulationCount(
      analysisTabListDto,
    );
  }
}
