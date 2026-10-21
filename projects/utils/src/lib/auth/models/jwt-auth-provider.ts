import { JWTTokenPayload } from './jwt-token-payload';

export interface JwtAuthProvider {
  getTokenPayload<T = JWTTokenPayload>(): T | null;
}
