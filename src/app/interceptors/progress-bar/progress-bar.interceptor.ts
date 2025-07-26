import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { finalize } from 'rxjs';

export const progressBarInterceptor: HttpInterceptorFn = (req, next) => {
  const progressBarService = inject(ProgressBarService);

  const method = req.method;

  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    progressBarService.showQueryProgressBar();
  } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    progressBarService.showIndeterminateProgressBar();
  }

  return next(req).pipe(
    finalize(() => {
      progressBarService.hideProgressBar();
    }),
  );
};
