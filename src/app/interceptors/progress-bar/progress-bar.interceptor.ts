import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { finalize } from 'rxjs';

export const progressBarInterceptor: HttpInterceptorFn = (req, next) => {
  const progressBarService = inject(ProgressBarService);

  if (['GET', 'HEAD', 'OPTIONS', 'QUERY'].includes(req.method)) {
    progressBarService.showQueryProgressBar();
  } else {
    progressBarService.showIndeterminateProgressBar();
  }

  return next(req).pipe(
    finalize(() => {
      progressBarService.hideProgressBar();
    }),
  );
};
