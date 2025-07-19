import crypto from 'crypto';

export class CryptoUtils {
  private static SALT_LENGTH = 32;
  private static KEY_LENGTH = 64;
  private static N = 16384; // CPU/memory cost factor (2^14)
  private static R = 8;     // Block size factor
  private static P = 1;     // Parallelization factor

  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(this.SALT_LENGTH);
    const hash = crypto.scryptSync(password, salt, this.KEY_LENGTH, {
      N: this.N,
      r: this.R,
      p: this.P
    });
    
    return salt.toString('hex') + ':' + hash.toString('hex');
  }

  static verifyPassword(password: string, hash: string): boolean {
    const [saltHex, hashHex] = hash.split(':');
    
    if (!saltHex || !hashHex) {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const expectedHash = crypto.scryptSync(password, salt, this.KEY_LENGTH, {
      N: this.N,
      r: this.R,
      p: this.P
    });
    
    return crypto.timingSafeEqual(
      Buffer.from(hashHex, 'hex'),
      expectedHash
    );
  }
} 