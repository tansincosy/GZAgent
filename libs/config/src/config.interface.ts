export interface ConfigOption {
  filePath?: string;
  fileName?: string;
}

export interface Log {
  inject?: string[];
  name?: string;
  level?: 'debug' | 'info' | 'error';
  path?: string;
}

export interface Database {
  type?: 'mysql' | 'postgresql';
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
}

export interface Axios {
  timeout: number;
  maxRedirects: number;
}

export interface AppConfig {
  name: string;
  version: string;
  port: number;
  log?: Log;
  database?: Database;
  axios?: Axios;
  work_dir?: string;
}

export interface ConfigDecoratorOptions {
  configKey: string;
  defaultKey: string;
}

export interface Client {
  id: string;
  secret: string;
}
