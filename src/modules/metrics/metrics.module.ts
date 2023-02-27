import { MetricsController } from './mertircs.controller';
import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Module({
  imports: [],
  providers: [MetricsService],
  controllers: [MetricsController],
})
export class MetricsModule {}
