import packageJson from '@jet/package.json' with { type: 'json' };

export const APP_VERSION: string = packageJson.version;
