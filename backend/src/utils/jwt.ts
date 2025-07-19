import crypto from "crypto";

export interface JWTPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export class JWTUtils {
  private static readonly ALGORITHM = "HS256";
  private static readonly EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

  static sign(
    payload: Omit<JWTPayload, "iat" | "exp">,
    secret: string
  ): string {
    const header = {
      alg: this.ALGORITHM,
      typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const jwtPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + this.EXPIRES_IN,
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(jwtPayload));

    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = this.createSignature(data, secret);

    return `${data}.${signature}`;
  }

  static verify(token: string, secret: string): JWTPayload | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return null;
      }

      const [encodedHeader, encodedPayload, signature] = parts;

      const data = `${encodedHeader}.${encodedPayload}`;
      const expectedSignature = this.createSignature(data, secret);

      if (
        !crypto.timingSafeEqual(
          Buffer.from(signature, "base64"),
          Buffer.from(expectedSignature, "base64")
        )
      ) {
        return null;
      }

      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  private static createSignature(data: string, secret: string): string {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    return this.base64UrlEncode(hmac.digest().toString('base64'));
  }

  private static base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  private static base64UrlDecode(str: string): string {
    str += "=".repeat((4 - (str.length % 4)) % 4);
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    return Buffer.from(str, "base64").toString();
  }
}
