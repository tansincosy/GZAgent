import { Inject, Injectable } from '@nestjs/common';
import { ALGORITHM, CRYPTO_CONFIG_OPTION } from './crypto.constant';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  pbkdf2,
  randomBytes,
} from 'crypto';
import { CryptoConfig } from './crypto.interface';
const iv = randomBytes(16);

@Injectable()
export class CryptoService {
  constructor(
    @Inject(CRYPTO_CONFIG_OPTION) private readonly cryptoConfig: CryptoConfig,
  ) {}

  encrypt(key, text) {
    // Creating Cipheriv with its parameter
    const cipher = createCipheriv(ALGORITHM, Buffer.from(key), iv);

    // Updating text
    let encrypted = cipher.update(text);

    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Returning iv and encrypted data
    const ivStr: string = iv.toString('hex');
    const encryptedData: string = encrypted.toString('hex');
    return `${encryptedData}:${ivStr}`;
  }

  decrypt(key, encryptedDataParam) {
    if (!encryptedDataParam) {
      return '';
    }
    const [encryptedData, textIv] = encryptedDataParam.split(':');
    const bufferIV = Buffer.from(textIv, 'hex');
    const encryptedText = Buffer.from(encryptedData, 'hex');
    // Creating Decipher
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(key), bufferIV);

    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  btoa(botaStr): string {
    return Buffer.from(botaStr).toString('base64');
  }

  atob(b64Encoded): string {
    return Buffer.from(b64Encoded, 'base64').toString();
  }

  md5(defaultStr = '', salt = ''): string {
    const saltStr = `${defaultStr}:${salt}`;
    const md5 = createHash('md5');
    return md5.update(saltStr).digest('hex');
  }

  encryptedPbkdf2(userPassword: string): Promise<string> {
    //盐值随机
    let primaryDriverKey = '';
    const salt =
      this.cryptoConfig.pbk || '79cc1eac-0b52-4658-9919-2ca97cc92547';
    console.log('salt', salt);
    return new Promise((resolve, reject) => {
      pbkdf2(userPassword, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          primaryDriverKey = '';
          reject(primaryDriverKey);
        } else {
          primaryDriverKey = derivedKey.toString('hex');
          resolve(primaryDriverKey);
        }
      });
    });
  }

  async comparePdkdf(pdk2Str: string, orginStr: string): Promise<boolean> {
    const originPbk = await this.encryptedPbkdf2(orginStr);
    return originPbk === pdk2Str;
  }
}
