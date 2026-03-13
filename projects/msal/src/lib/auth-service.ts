import { Injectable, inject, signal, computed } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import type { AccountInfo } from '@azure/msal-browser';

import { AuthProvider, type Signup, type User } from '@factor_ec/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthProvider {
  private readonly msal = inject(MsalService);
  private readonly _account = signal<AccountInfo | null>(null);

  override readonly user = computed(() => {
    const acc = this._account();
    return acc ? this.mapAccountToUser(acc) : null;
  });

  override readonly isLoggedIn = computed(() => this._account() !== null);

  constructor() {
    super();
    this._account.set(this.msal.instance.getActiveAccount());
  }

  override login(): Promise<boolean> {
    this.msal.loginRedirect();
    return Promise.resolve(true);
  }

  override logout(): Promise<boolean> {
    this.msal.logoutRedirect();
    return Promise.resolve(true);
  }

  get account(): AccountInfo | null {
    return this.msal.instance.getActiveAccount();
  }

  private mapAccountToUser(acc: AccountInfo): User {
    return {
      username: acc.username,
      email: (acc.idTokenClaims as Record<string, unknown>)?.['email'] as string ?? acc.username,
      roles: (acc.idTokenClaims as Record<string, unknown>)?.['roles'] as string[] ?? [],
      firstName: (acc.idTokenClaims as Record<string, unknown>)?.['given_name'] as string ?? '',
      lastName: (acc.idTokenClaims as Record<string, unknown>)?.['family_name'] as string ?? '',
      picture: (acc.idTokenClaims as Record<string, unknown>)?.['picture'] as string ?? ''
    };
  }
}
