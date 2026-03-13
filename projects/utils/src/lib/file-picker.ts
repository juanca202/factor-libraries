import { Injectable } from '@angular/core';

/**
 * Service for opening file picker dialogs and reading file contents.
 *
 * @remarks
 * Provides a programmatic way to open file selection dialogs and read file data as base64.
 */
@Injectable({
  providedIn: 'root',
})
export class FilePicker {
  /**
   * Opens a file picker dialog and returns the selected files with their data as base64.
   *
   * @param options - Optional configuration for the file picker
   * @param options.accept - File types to accept (e.g., 'image/*', '.pdf')
   * @param options.multiple - Whether to allow multiple file selection
   * @returns Promise that resolves to an array of files with data property, or null if cancelled
   *
   * @example
   * ```typescript
   * const files = await filePicker.open({ accept: 'image/*', multiple: true });
   * if (files) {
   *   files.forEach(file => console.log(file.data)); // base64 data
   * }
   * ```
   */
  public async open(options?: {
    accept?: string;
    multiple?: boolean;
  }): Promise<any[] | null> {
    return new Promise((resolve, reject) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.style.display = 'none';
      if (options?.accept) {
        fileInput.accept = options.accept;
      }
      fileInput.multiple = options?.multiple ?? false;
      document.body.appendChild(fileInput);
      let changeHandled = false;
      const cleanUp = () => {
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        if (fileInput.parentNode) {
          document.body.removeChild(fileInput);
        }
      };
      const onFocus = () => {
        setTimeout(() => {
          if (!changeHandled) {
            cleanUp();
            resolve(null);
          }
        }, 1500);
      };
      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          setTimeout(() => {
            if (!changeHandled) {
              cleanUp();
              resolve(null);
            }
          }, 1500);
        }
      };
      fileInput.addEventListener('change', async (event: any) => {
        changeHandled = true;
        const files = Array.from(event.target.files || []) as File[];
        if (!files.length) {
          cleanUp();
          resolve(null);
          return;
        }
        try {
          const result = await Promise.all(
            files.map(file => {
              return new Promise((res, rej) => {
                const reader = new FileReader();
                reader.onload = () => {
                  res(Object.assign(file, { data: reader.result }));
                };
                reader.onerror = (err) => {
                  rej(reader.error);
                };
                reader.readAsDataURL(file);
              });
            })
          );
          cleanUp();
          resolve(result);
        } catch (error) {
          cleanUp();
          reject(error);
        }
      });
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onVisibilityChange);
      fileInput.click();
    });
  }
}
