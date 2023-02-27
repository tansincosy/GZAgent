import { CPU, Memory } from './metrics.interface';
import { execPromise, toObject } from '@nestboot/common';
import { Injectable } from '@nestjs/common';
import { catchError, EMPTY, forkJoin, from, map } from 'rxjs';
import { Value } from '@nestboot/config';
import { Log4j, Logger } from '@nsboot/log4js';
@Injectable()
export class MetricsService {
  @Log4j()
  private log: Logger;

  @Value('server.platform')
  platformUrl: string;

  @Value('client.id')
  clientId: string;

  $cpu() {
    this.log.info('begin get cpu info');
    const result = execPromise('sh bin/cpu.sh');
    return from(result).pipe(
      catchError((error) => {
        this.log.error('exec cpu.sh failed, the error is ', error);
        return EMPTY;
      }),
      map((item: string) => {
        return toObject<CPU>(item);
      }),
    );
  }
  $memory() {
    this.log.info('begin get memory info');
    const result = execPromise('sh bin/memory.sh');
    return from(result).pipe(
      catchError((error) => {
        this.log.error('exec memory.sh failed, the error is ', error);
        return EMPTY;
      }),
      map((item: string) => {
        return toObject<Memory>(item);
      }),
    );
  }
  /**
   * 性能指标
   * @returns
   */
  getMetricsInfo() {
    this.log.info('get agent performance info');
    return forkJoin([this.$cpu(), this.$memory()]).pipe(
      map(([cpu, memory]) => {
        const time = new Date().getTime();
        return {
          cpu,
          memory,
          time,
          clientId: this.clientId,
        };
      }),
    );
  }
}
