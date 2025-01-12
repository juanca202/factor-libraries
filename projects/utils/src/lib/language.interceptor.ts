import { HttpInterceptorFn } from '@angular/common/http';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const langReq = req.clone({
    setHeaders: {
      'Accept-Language': $localize.locale || 'en'
    }
  });
  return next(langReq);
};
