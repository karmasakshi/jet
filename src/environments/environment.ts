import { Environment } from '@jet/interfaces/environment.interface';

export const ENVIRONMENT: Environment = {
  someKey: process.env['SOME_KEY'] ?? '',
};
