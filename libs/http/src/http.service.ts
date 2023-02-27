import { Log4j, Logger } from '@nsboot/log4js';
import { Client, Value } from '@nestboot/config';
import { HttpErrorData } from '@nestboot/core';
import { CryptoService } from '@nestboot/crypto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { randomUUID } from 'crypto';
import { catchError, concatMap, map, of } from 'rxjs';

@Injectable()
export class MyHttpService {
  @Log4j('interface')
  private iLog: Logger;

  @Log4j()
  private rLog: Logger;

  @Value('client')
  private client: Client;

  constructor(
    private readonly httpService: HttpService,
    private readonly cryptoService: CryptoService,
  ) {
    this.axiosInterceptorHandle();
  }

  /**
   * 处理axios interceptor  请求和响应
   */
  axiosInterceptorHandle() {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      const trackId = randomUUID();
      config.headers[`x-track-id`] = `agent:${trackId}`;
      this.iLog.info(
        `begin call url= ${config.url} method= ${config.method} trackId= ${config.headers['x-track-id']}`,
      );
      return config;
    });
    this.httpService.axiosRef.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError<HttpErrorData>) => {
        const { config, code, message } = error || {};
        this.iLog.error('response error is = ', {
          url: config.url,
          method: config.method,
          code,
          message,
        });
        return Promise.reject(error);
      },
    );
  }

  getBasicAuth() {
    if (!this.client.id || !this.client.secret) {
      this.rLog.error(
        'client config is not full,client config is = ',
        this.client,
      );
      throw new Error('client config is not full');
    }

    const baseAuth = this.cryptoService.btoa(
      `${this.client.id}:${this.client.secret}`,
    );
    return of(baseAuth);
  }

  sendMessage<Params, Response>(url: string, data: Params, method = 'get') {
    return this.getBasicAuth().pipe(
      concatMap((token) => {
        return this.httpService
          .request({
            url,
            data,
            method,
            headers: {
              Authorization: `Basic ${token}`,
            },
          })
          .pipe(
            map((item) => item.data as Response),
            catchError(({ config, code, message }) => {
              this.iLog.error({
                url: config.url,
                method: config.method,
                code,
                message,
              });
              return of({});
            }),
          );
      }),
    );
  }
}
