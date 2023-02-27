import { Message } from '@nestboot/core';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { API } from '~/constants/api.const';
import { AuthGuard } from '~/guard/auth.guard';
import { MetricsService } from './metrics.service';

@Controller(API.METRICS)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Message('query current agent mertrics info')
  getMetricsInfo() {
    return this.metricsService.getMetricsInfo();
  }
}
