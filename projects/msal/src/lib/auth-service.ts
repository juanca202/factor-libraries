import { Injectable, inject, signal, computed } from '@angular/core';

import { MsalService } from '@azure/msal-angular';
import { type AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';

import { AuthProvider, type User } from '@factor_ec/utils';

/**
 * {@link AuthProvider} implementation backed by Microsoft Authentication Library (MSAL).
 *
 * @remarks
 * Uses redirect-based login and logout through `MsalService`. Call {@link AuthService.init}
 * once at startup to initialize MSAL, process a pending redirect response and restore the active account.
 *
 * @example
 * ```typescript
 * const auth = inject(AuthService);
 * await auth.init();
 * if (!auth.isLoggedIn()) {
 *   await auth.login();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthProvider {
  private readonly msal = inject(MsalService);
  private readonly _account = signal<AccountInfo | null>(null);

  /**
   * Signal with the current user mapped from the account ID token claims,
   * or `null` when no account is signed in.
   */
  override readonly user = computed<User | null>(() => {
    const acc = this._account();
    return acc ? this.mapAccountToUser(acc) : null;
  });

  /** Signal with the MSAL account resolved by {@link AuthService.init}, or `null` when none. */
  readonly account = computed<AccountInfo | null>(() => {
    return this._account();
  });

  /** Signal that is `true` while an MSAL account is available. */
  override readonly isLoggedIn = computed<boolean>(() => this._account() !== null);

  constructor() {
    super();
  }

  /**
   * Starts the interactive sign-in using a full-page redirect.
   *
   * @returns A promise resolving to `true` once the redirect request has been issued
   */
  override async login(): Promise<boolean> {
    await firstValueFrom(this.msal.loginRedirect());
    return true;
  }

  /**
   * Signs the user out using a full-page redirect.
   *
   * @returns A promise resolving to `true` once the redirect request has been issued
   */
  override async logout(): Promise<boolean> {
    await firstValueFrom(this.msal.logoutRedirect());
    return true;
  }

  /**
   * Initializes MSAL and resolves the current account.
   *
   * @returns A promise resolving to `true` when initialization completes
   *
   * @remarks
   * Handles a pending redirect response (errors are ignored); if it carries an account that
   * account is used, otherwise the first cached account is used. The resolved account is set
   * as the MSAL active account and published through the {@link AuthService.account} signal.
   */
  public async init(): Promise<boolean> {
    await this.msal.instance.initialize();
    const result = await this.msal.instance.handleRedirectPromise().catch(() => null);
    let account: AccountInfo | null = null;
    if (result?.account) {
      account = result.account;
    } else {
      const accounts = this.msal.instance.getAllAccounts();
      if (accounts.length > 0) {
        account = accounts[0];
      }
    }
    if (account) {
      this.msal.instance.setActiveAccount(account);
    }
    this._account.set(account);
    return true;
  }

  /**
   * Active account reported by MSAL, or `null` when none is set.
   *
   * @remarks
   * Unlike the {@link AuthService.account} signal, this reads the MSAL instance on every access.
   */
  get accountInfo(): AccountInfo | null {
    return this.msal.instance.getActiveAccount();
  }

  private mapAccountToUser(acc: AccountInfo): User {
    return {
      username: acc.username,
      email: ((acc.idTokenClaims as Record<string, unknown>)?.['email'] as string) ?? acc.username,
      roles: ((acc.idTokenClaims as Record<string, unknown>)?.['roles'] as string[]) ?? [],
      firstName: ((acc.idTokenClaims as Record<string, unknown>)?.['given_name'] as string) ?? '',
      lastName: ((acc.idTokenClaims as Record<string, unknown>)?.['family_name'] as string) ?? '',
      picture: ((acc.idTokenClaims as Record<string, unknown>)?.['picture'] as string) ?? '',
    };
  }
}
