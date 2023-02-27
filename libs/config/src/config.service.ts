import { Injectable } from '@nestjs/common';
import { get, set } from 'lodash';
import { ConfigFileLoader } from './config-file.loader';

@Injectable()
export class ConfigService {
  private _data: any = {};

  constructor(private configFileLoader: ConfigFileLoader) {
    this._data = this.configFileLoader.load();
  }

  public get data() {
    return this._data;
  }

  public set data(data: any) {
    this._data = data;
  }

  public update(path: string, value: any) {
    set(this._data, path, value);
  }

  public get<T>(path: string, defaults?: T): T {
    return get(this._data, path, defaults);
  }

  public getConfig<T>(): T {
    return this._data;
  }
}
