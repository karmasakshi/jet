import packageJson from '../../../package.json' with { type: 'json' };

export const APP_VERSION: string = packageJson.version;
