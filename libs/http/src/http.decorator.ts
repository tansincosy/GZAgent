import { Inject } from '@nestjs/common';
import { MY_HTTP_PROVIDER } from './http.constant';

export const InjectHttp = () => Inject(MY_HTTP_PROVIDER);
