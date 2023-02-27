import { Inject } from '@nestjs/common';
import { CONFIG, CONFIG_META, CONFIG_META_CONFIG } from './config.constant';

export const InjectConfig = () => Inject(CONFIG);

export function Value(
  metadata: string,
  defaultKey?: string,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    Reflect.set(target, propertyKey, null);
    Reflect.defineMetadata(CONFIG_META, true, target, propertyKey);
    Reflect.defineMetadata(
      CONFIG_META_CONFIG,
      {
        configKey: metadata,
        defaultKey,
      },
      target,
      propertyKey,
    );
  };
}
