import { Module } from '@nestjs/common';
import { AnalysisTabController } from './analysis-tab.controller';
import { AnalysisTabService } from './analysis-tab.service';

@Module({
  imports: [],
  controllers: [AnalysisTabController],
  providers: [AnalysisTabService],
})
export class AnalysisTabModule {}
