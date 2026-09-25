import { HttpInterceptorFn } from '@angular/common/http';
import { REQUEST_TIMEOUT_MS } from '@jet/constants/request-timeout-ms.constant';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.timeout == null ? req.clone({ timeout: REQUEST_TIMEOUT_MS }) : req);
};
