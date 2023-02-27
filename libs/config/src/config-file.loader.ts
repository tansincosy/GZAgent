import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { parse } from 'yaml';
import { ConfigOption, AppConfig } from './config.interface';
import { CONFIG_OPTION } from './config.constant';

@Injectable()
export class ConfigFileLoader {
  constructor(
    @Inject(CONFIG_OPTION)
    private readonly configOption: ConfigOption,
  ) {}

  load() {
    const filePath = this.configOption.filePath;
    const fileName = this.configOption.fileName;
    if (!filePath) {
      throw new Error(`file Path not config`);
    }
    const configFileName = join(filePath, fileName);
    if (!existsSync(configFileName)) {
      throw new Error(`file Path not found`);
    }
    let configContent = '';
    try {
      configContent = readFileSync(configFileName, 'utf-8');
    } catch (error) {
      throw new Error(`file Path not found the error is` + error.toString());
    }
    let config: AppConfig;
    try {
      config = parse(configContent);
    } catch (error) {
      throw new Error(`file parse error, the error is` + error.toString());
    }

    return config;
  }
}
