declare interface Env {
  readonly NODE_ENV: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
