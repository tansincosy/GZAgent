import { Value } from '@nestboot/config';
import { ILogger, InjectLogger, Logger } from '@nsboot/log4js';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  @Value('name')
  private appName: string;
  @Value('version')
  private version: string;

  private logger: Logger;

  constructor(@InjectLogger() private readonly iLogger: ILogger) {
    this.logger = this.iLogger.getLogger(AppService.name);
  }

  getAgentInfo() {
    return {
      name: this.appName,
      version: this.version,
    };
  }
}
