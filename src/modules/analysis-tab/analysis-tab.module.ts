import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/config';
import { AnalysisSummaryIndex } from './analysis-summary-index-test.entity';
import { AnalysisTabController } from './analysis-tab.controller';
import { AnalysisTabService } from './analysis-tab.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnalysisSummaryIndex])],
  controllers: [AnalysisTabController],
  providers: [AnalysisTabService],
})
export class AnalysisTabModule {}
