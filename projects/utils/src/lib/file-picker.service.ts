import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilePickerService {
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
