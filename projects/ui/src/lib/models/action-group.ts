import { Action } from './action';

export interface ActionGroup {
  children?: Action[];
  iconNameField?: string;
  iconCollection?: string;
  labelField?: string;
  type?: string;
}
