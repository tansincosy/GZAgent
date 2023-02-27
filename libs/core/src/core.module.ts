import { CONFIG } from '@nestboot/config';
import { NestLoggerService } from '@nsboot/log4js';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { CoreService } from './core.service';
import { HttpExceptionFilter } from './filters/error.filter';
import { HttpInterceptor } from './interceptors/http.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Module({
  providers: [CoreService],
  exports: [CoreService],
})
export class NestBootFactory {
  static async create(app: INestApplication): Promise<INestApplication> {
    const log4jService = app.get(NestLoggerService);
    app.useLogger(log4jService);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
      new TransformInterceptor(),
      new HttpInterceptor(log4jService),
    );

    app.useGlobalFilters(new HttpExceptionFilter(log4jService));
    const port = app.get(CONFIG).get('port', 3000);
    await app.listen(port);
    log4jService.log('Application is running on:' + port, 'NestBootFactory');
    return app;
  }
}
