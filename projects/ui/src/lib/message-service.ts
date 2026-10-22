import {
  Component,
  Injectable,
  OutputEmitterRef,
  inject,
  output,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';

import { Observable, ReplaySubject } from 'rxjs';
import { Icon } from './icon/icon';
import { MessageOptions } from './models/message-options';
import { MessageContent } from './models/message-content';
import { StringUtil } from '@factor_ec/utils';
import { CommonModule } from '@angular/common';
import { MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MESSAGE_POSITION } from './constants/message-position';

/**
 * Content of the snack bar used by {@link MessageService} for notifications.
 *
 * @remarks
 * Renders an optional icon and the message as text or HTML. Receives its data through `MAT_SNACK_BAR_DATA`.
 */
@Component({
  standalone: true,
  imports: [MatSnackBarModule, Icon],
  template: `
    @if (data.options.icon) {
    <ft-icon [name]="data.options.icon" class="ft-icon--2" />
    } @switch (data.message?.type) { @case ('html') {
    <div [innerHTML]="data.message?.content"></div>
    } @default {
    {{ data.message?.content }}
    } }
  `,
})
export class MessageContentComponent {
  /** Data injected by the snack bar (`message` and `options`). */
  data = inject(MAT_SNACK_BAR_DATA);
}

/**
 * Dialog used by {@link MessageService} for modal messages.
 *
 * @remarks
 * Renders an optional title, icon, message (text or HTML) and action buttons. When no actions are given,
 * a single "Accept" button is shown, which selects the value `'-1'`. Receives its data through `MAT_DIALOG_DATA`.
 */
@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, Icon],
  template: `
    @if (data.options?.title) {
    <h1 mat-dialog-title class="ft-message__title">
      @if (data.options?.titleIcon) {
      <ft-icon
        [name]="data.options?.titleIcon?.name"
        [collection]="data.options?.titleIcon?.collection"
        [ngClass]="data.options?.titleIcon?.class"
      ></ft-icon>
      }
      <div>{{ data.options?.title }}</div>
    </h1>
    }
    <div
      mat-dialog-content
      class="ft-message__content"
      [ngClass]="data.options?.class"
    >
      @if (data.options?.icon) {
      <ft-icon
        [name]="data.options?.icon?.name"
        [collection]="data.options?.icon?.collection"
        [ngClass]="data.options?.icon?.class"
      ></ft-icon>
      } @switch (data.message?.type) { @case ('html') {
      <div [innerHTML]="data.message?.content"></div>
      } @default {
      {{ data.message?.content }}
      } }
    </div>
    @if (data.options.actionsVisible) {
    <div mat-dialog-actions class="ft-message__actions">
      @if (data.options?.actions?.length > 0) { @for (action of
      data.options?.actions; track action; let i = $index) { @switch
      (action.type) { @case ('raised') {
      <button
        type="button"
        mat-raised-button
        [color]="action.metadata?.color"
        (click)="select(action.value)"
      >
        {{ action.label }}
      </button>
      } @case ('flat') @case ('filled') {
      <button
        type="button"
        mat-flat-button
        [color]="action.metadata?.color"
        (click)="select(action.value)"
      >
        {{ action.label }}
      </button>
      } @case ('stroked') @case ('outlined') {
      <button
        type="button"
        mat-stroked-button
        [color]="action.metadata?.color"
        (click)="select(action.value)"
      >
        {{ action.label }}
      </button>
      } @default {
      <button type="button" mat-button (click)="select(action.value)">
        {{ action.label }}
      </button>
      } } } } @else {
      <button
        type="button"
        mat-flat-button
        color="primary"
        (click)="select('-1')"
        i18n
      >
        Accept
      </button>
      }
    </div>
    }
  `,
})
export class MessageDialogComponent {
  /** Data injected by the dialog (`message` and `options`). */
  data = inject(MAT_DIALOG_DATA);

  /** Emits the value of the action selected by the user, before the dialog is closed. */
  readonly beforeSelect: OutputEmitterRef<string> = output();

  /**
   * Emits the chosen action value through `beforeSelect`.
   *
   * @param value - Value of the selected action
   */
  select(value: string) {
    this.beforeSelect.emit(value);
  }
}

/**
 * Service to show messages to the user as notifications (snack bar) or modal dialogs.
 *
 * @remarks
 * Provided in root. Depends on Angular Material (`MatSnackBar`, `MatDialog`) and `StringUtil` from `@factor_ec/utils`.
 *
 * @example
 * ```typescript
 * messageService.show('Saved successfully');
 *
 * messageService
 *   .show('Delete this item?', {
 *     type: 'modal',
 *     title: 'Confirm',
 *     actions: [
 *       { type: 'outlined', label: 'Cancel', value: 'cancel' },
 *       { type: 'filled', label: 'Delete', value: 'delete' },
 *     ],
 *   })
 *   .subscribe(value => console.log(value));
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private stringUtil = inject(StringUtil);

  /**
   * Shows a message as a notification (default) or as a modal dialog.
   *
   * @param message - Plain text, or a `MessageContent` object with `content` and `type` (`'text'` or `'html'`)
   * @param options - Display options; `type` defaults to `'notification'` and `actionsVisible` to `true`
   * @returns Observable that emits the value of the action selected in a modal. For notifications it never emits
   *
   * @remarks
   * Notifications are shown at the top and auto-dismissed after `options.duration` or, if omitted, after the
   * estimated reading time (capped at 30 seconds). Modals have a default width of `350px` and cannot be dismissed
   * without choosing an action.
   */
  show(
    message: string | MessageContent,
    options?: MessageOptions
  ): Observable<any> {
    const selectionSource: ReplaySubject<string> = new ReplaySubject<string>(
      undefined
    );
    const selection: Observable<string> = selectionSource.asObservable();
    const defaults: MessageOptions = {
      type: 'notification',
      actionsVisible: true,
    };
    options = Object.assign(defaults, options);
    const data = {
      message:
        typeof message === 'string'
          ? { content: message, type: 'text' }
          : message,
      options,
    };
    let dialogRef: MatDialogRef<MessageDialogComponent>;
    switch (options.type) {
      default:
      case 'notification':
        const panelClass = ['ft-message', 'ft-message--notification'];
        if (options.class) {
          panelClass.push(options.class);
        }
        const snackBarRef = this.snackBar.openFromComponent(
          MessageContentComponent,
          {
            data,
            panelClass,
            duration:
              options.duration ??
              Math.min(
                this.stringUtil.calculateReadingTime(
                  typeof message === 'string' ? message : message.content
                ),
                30000
              ),
            verticalPosition: MESSAGE_POSITION.TOP as MatSnackBarVerticalPosition,
          }
        );
        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });
        break;
      case 'modal':
        dialogRef = this.dialog.open(MessageDialogComponent, {
          width: options.width || '350px',
          data,
          panelClass: ['ft-message', 'ft-message--modal'],
          autoFocus: false,
          disableClose: true,
        });
        dialogRef.componentInstance.beforeSelect.subscribe((response: any) => {
          selectionSource.next(response);
          dialogRef.close();
        });
        break;
    }
    return selection;
  }
}
