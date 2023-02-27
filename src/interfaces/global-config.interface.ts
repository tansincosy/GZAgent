export interface GlobalConfig {
  name: string;
  version: string;
  port: number;
  axios: {
    timeout: number;
    maxRedirects: number;
  };
  data: Record<string, string>;
  log: {
    level: 'debug' | 'info' | 'error';
    path: string;
  };
  client: Client;
  server: Record<string, string>;
}

export interface Client {
  id: string;
  secret: string;
}
