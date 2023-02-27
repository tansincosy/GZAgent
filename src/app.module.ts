import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CONFIG, ConfigModule } from '@nestboot/config';
import { LoggerModule } from '@nsboot/log4js';
import { CryptoModule } from '@nestboot/crypto';
import { MetricsModule } from './modules/metrics/metrics.module';
import { MyHttpModule } from '@nestboot/http';

@Module({
  imports: [
    ConfigModule.forRoot({
      filePath: '.',
    }),
    LoggerModule.forRootAsync({
      inject: [CONFIG],
    }),
    CryptoModule.forRootAsync({
      inject: [CONFIG],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    MyHttpModule.forRootAsync(),
    ScheduleModule.forRoot(),
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
