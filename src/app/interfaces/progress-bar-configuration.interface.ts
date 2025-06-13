import { ProgressBarMode } from '@angular/material/progress-bar';

export interface ProgressBarConfiguration {
  bufferValue: number;
  isVisible: boolean;
  mode: ProgressBarMode;
  value: number;
}
