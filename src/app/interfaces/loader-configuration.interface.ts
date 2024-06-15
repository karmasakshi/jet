import { ProgressBarMode } from '@angular/material/progress-bar';

export interface LoaderConfiguration {
  bufferValue: number;
  isVisible: boolean;
  mode: ProgressBarMode;
  value: number;
}
