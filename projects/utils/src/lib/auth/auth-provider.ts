import { User } from './models/user';
import { Login } from './models/login';
import { Signal } from '@angular/core';

/**
 * Abstract contract for authentication providers.
 *
 * @remarks
 * Defines the reactive session state (`user`, `isLoggedIn`) and the lifecycle
 * operations (`init`, `login`, `logout`) that concrete providers must implement,
 * so consumers such as guards and interceptors can depend on this abstraction
 * instead of a specific identity backend.
 *
 * @example
 * ```typescript
 * const auth = inject(AuthProvider);
 * if (!auth.isLoggedIn()) {
 *   await auth.login({ username: 'john', password: 'secret' });
 * }
 * ```
 */
export abstract class AuthProvider {
  /** Signal with the current authenticated user, or `null` when there is no session. */
  public abstract user: Signal<User | null>;

  /**
   * Initializes the provider (e.g. restores a previous session).
   *
   * @returns A promise resolving to `true` when initialization completes
   */
  public abstract init(): Promise<boolean>;

  /**
   * Starts the sign-in flow.
   *
   * @param data - Optional credentials; providers that delegate to an external identity provider may ignore it
   * @returns A promise resolving to `true` when the flow succeeds, `false` otherwise
   */
  public abstract login(data?: Login): Promise<boolean>;

  /**
   * Ends the current session.
   *
   * @returns A promise resolving to `true` when the flow completes
   */
  public abstract logout(): Promise<boolean>;

  /** Signal indicating whether there is an active authenticated session. */
  public abstract isLoggedIn: Signal<boolean>;
}
