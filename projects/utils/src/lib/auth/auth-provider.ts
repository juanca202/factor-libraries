import { User } from './models/user';
import { Login } from './models/login';
import { Signal } from '@angular/core';

export abstract class AuthProvider {
  public abstract user: Signal<User | null>;
  public abstract init(): Promise<boolean>;
  public abstract login(data?: Login): Promise<boolean>;
  public abstract logout(): Promise<boolean>;
  public abstract isLoggedIn: Signal<boolean>;
}
