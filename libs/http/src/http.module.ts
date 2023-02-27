import { CONFIG, ConfigService } from '@nestboot/config';
import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { MY_HTTP_PROVIDER } from './http.constant';
import { MyHttpService } from './http.service';

@Module({})
export class MyHttpModule {
  static forRootAsync() {
    const httpServiceProvider: Provider = {
      provide: MY_HTTP_PROVIDER,
      useClass: MyHttpService,
    };
    return {
      global: true,
      module: MyHttpModule,
      imports: [
        HttpModule.registerAsync({
          useFactory(config: ConfigService) {
            const axiosConfig =
              (config.get('axios') as Record<string, any>) || {};
            return {
              ...axiosConfig,
              maxRedirects: 5,
              timeout: 30,
            };
          },
          inject: [CONFIG],
        }),
      ],
      providers: [httpServiceProvider],
      exports: [httpServiceProvider],
    };
  }
}
