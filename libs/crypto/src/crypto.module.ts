import { CONFIG, ConfigService } from '@nestboot/config';
import { Module } from '@nestjs/common';
import {
  CRYPTO_CONFIG_OPTION,
  CRYPTO_CONFIG_OPTION_KEY,
} from './crypto.constant';
import { CryptoConfig } from './crypto.interface';
import { CryptoService } from './crypto.service';

@Module({})
export class CryptoModule {
  static forRootAsync(options: CryptoConfig) {
    const inject = options.inject || [];
    const optionsProvider = {
      provide: CRYPTO_CONFIG_OPTION,
      useFactory: (...params: any[]) => {
        const registerOptions = options;
        const configService: ConfigService = params[inject.indexOf(CONFIG)];
        if (configService) {
          options = configService.get<CryptoConfig>(CRYPTO_CONFIG_OPTION_KEY);
        }
        return Object.assign(registerOptions, options);
      },
      inject,
    };

    return {
      global: true,
      module: CryptoModule,
      providers: [CryptoService, optionsProvider],
      exports: [CryptoService],
    };
  }
}
