import { ConfigDecoratorOptions, ConfigOption } from './config.interface';
import {
  Module,
  Global,
  DynamicModule,
  Provider,
  OnModuleInit,
} from '@nestjs/common';
import {
  CONFIG_OPTION,
  CONFIG,
  CONFIG_NAME,
  CONFIG_META,
  CONFIG_META_CONFIG,
} from './config.constant';
import { ConfigFileLoader } from './config-file.loader';
import { ConfigService } from './config.service';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { DiscoveryService, DiscoveryModule } from '@nestjs/core';
import { isFunction, isUndefined } from 'lodash';
import { InjectConfig } from './config.decorator';

@Global()
@Module({})
export class ConfigModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    @InjectConfig() private config: ConfigService,
  ) {}

  onModuleInit() {
    const providers: InstanceWrapper[] = [
      ...this.discoveryService.getProviders(),
      ...this.discoveryService.getControllers(),
    ];
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      if (!instance || typeof instance === 'string') {
        return;
      }
      for (const propertyKey in instance) {
        if (isFunction(propertyKey)) {
          continue;
        }
        const property = String(propertyKey);
        const isConfig = Reflect.getMetadata(CONFIG_META, instance, property);
        if (isUndefined(isConfig)) {
          continue;
        }
        const metadata = Reflect.getMetadata(
          CONFIG_META_CONFIG,
          instance,
          property,
        ) as ConfigDecoratorOptions;
        instance[property] = this.config.get(
          metadata.configKey,
          metadata.defaultKey,
        );
      }
    });
  }
  static forRoot(options: ConfigOption): DynamicModule {
    const configProvider: Provider = {
      provide: CONFIG,
      useClass: ConfigService,
    };
    const configBootOptionProvider: Provider = {
      provide: CONFIG_OPTION,
      useFactory() {
        return Object.assign(
          {
            fileName: CONFIG_NAME,
            filePath: '.',
          },
          options,
        );
      },
    };
    return {
      global: true,
      imports: [DiscoveryModule],
      module: ConfigModule,
      providers: [configBootOptionProvider, configProvider, ConfigFileLoader],
      exports: [configProvider],
    };
  }
}
