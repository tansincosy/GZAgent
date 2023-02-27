import { Message } from '@nestboot/core';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guard/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @UseGuards(AuthGuard)
  @Message('query agent heath success')
  getHealth() {
    return this.appService.getAgentInfo();
  }
}
