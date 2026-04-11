import { Injectable, inject, signal, computed } from '@angular/core';

import { MsalService } from '@azure/msal-angular';
import { type AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';

import { AuthProvider, type User } from '@factor_ec/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthProvider {
  private readonly msal = inject(MsalService);
  private readonly _account = signal<AccountInfo | null>(null);

  override readonly user = computed<User | null>(() => {
    const acc = this._account();
    return acc ? this.mapAccountToUser(acc) : null;
  });

  readonly account = computed<AccountInfo | null>(() => {
    return this._account();
  });

  override readonly isLoggedIn = computed<boolean>(() => this._account() !== null);

  constructor() {
    super();
  }

  override async login(): Promise<boolean> {
    await firstValueFrom(this.msal.loginRedirect());
    return true;
  }

  override async logout(): Promise<boolean> {
    await firstValueFrom(this.msal.logoutRedirect());
    return true;
  }

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
