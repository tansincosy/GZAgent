import { ConfigService, InjectConfig } from '@nestboot/config';
import { CryptoService } from '@nestboot/crypto';
import { ILogger, InjectLogger, Logger } from '@nsboot/log4js';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger: Logger;
  constructor(
    @InjectLogger() private readonly iLogger: ILogger,
    @InjectConfig() private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {
    this.logger = this.iLogger.getLogger(AuthGuard.name);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // 阿尔法环境不需要认证
    if (1 === 1) {
      return true;
    }
    const authHeader = request.header('Authorization');
    if (!authHeader) {
      this.logger.error('Authorization header is missing');
      return false;
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Basic') {
      this.logger.error('Authorization type is not Basic');
      return false;
    }
    if (!token) {
      this.logger.error('Authorization token is missing');
      return false;
    }
    const tokenStr = this.cryptoService.atob(token);
    const [clientId, clientSecret] = tokenStr.split(':');
    if (!clientId || !clientSecret) {
      this.logger.error('Authorization token is invalid');
      return false;
    }
    const configClientId = this.configService.get('client.id', '');
    if (configClientId === clientId) {
      this.logger.error('Authorization clientId is invalid');
      return false;
    }
    const salt = this.configService.get('secret.salt', '');
    const password = this.configService.get('secret.password', '');
    try {
      const clientOriginSecret = this.cryptoService.decrypt(salt, password);
      const requestClientPass = this.cryptoService.decrypt(salt, clientSecret);
      if (clientOriginSecret !== requestClientPass) {
        this.logger.error('Authorization clientSecret is invalid');
        return false;
      }
    } catch (error) {
      this.logger.error(
        'Authorization clientSecret is invalid, the error is ',
        error,
      );
      return false;
    }

    return true;
  }
}
