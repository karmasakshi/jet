# Jet

Angular starter-kit for building quality web apps fast.

<br />

<p align="center">
  <img
    alt="Logo"
    src="public/icons/jet.svg"
    width="64"
  />
</p>

## Contents

- [Features](#features)
  - [Integrations](#integrations)
  - [Components](#components)
  - [Directives](#directives)
  - [Guards](#guards)
  - [Services](#services)
  - [GitHub Actions](#github-actions)
- [Guides](#guides)
  - [Getting started](#getting-started)
  - [Adding elements](#adding-elements)
    - [Add a component](#add-a-component)
    - [Add a page component](#add-a-page-component)
    - [Add a directive](#add-a-directive)
    - [Add a service](#add-a-service)
  - [Committing changes](#committing-changes)
    - [Update precommit script](#update-precommit-script)
    - [Commit code](#commit-code)
    - [Format code](#format-code)
    - [Lint code](#lint-code)
    - [Update commit scopes](#update-commit-scopes)
  - [Icons](#icons)
    - [Add an icon](#add-an-icon)
    - [Remove an icon](#remove-an-icon)
  - [Style](#style)
    - [Add styles](#add-styles)
    - [Generate a Material theme](#generate-a-material-theme)
    - [Override Material styles](#override-material-styles)
  - [Internationalization](#internationalization)
    - [Add a language](#add-a-language)
    - [Change the default language](#change-the-default-language)
    - [Remove a language](#remove-a-language)
  - [Environments](#environments)
    - [Add an environment](#add-an-environment)
    - [Add an environment variable](#add-an-environment-variable)
  - [Release](#release)
    - [Cut a release](#cut-a-release)
    - [Cut a major release](#cut-a-major-release)
  - [Deploy](#deploy)
    - [Vercel](#vercel)
  - [Supabase](#supabase)
    - [Link a Supabase project](#link-a-supabase-project)
    - [Run Supabase locally](#run-supabase-locally)
    - [Remove Supabase](#remove-supabase)
- [Sponsors](#sponsors)

<br />

[↑ Back to Contents](#contents)

## Features

- **Built on modern Angular**: Signals, new templating syntax, Zoneless, and more.
- **Built using Angular CLI**: No learning curve, and all the conveniences.
- **Enforces strict linting and formatting**: Strict configurations for ESLint, Prettier and TypeScript.
- **Performant**: Modular and tree-shakeable. 80+ on [PageSpeed Insights](https://pagespeed.web.dev/).
- **Secure**: Locked-down CSP and other security headers. 80+ on [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory).
- **Always up-to-date**: Actively maintained and regularly built from the ground-up.

<br />

[↑ Back to Contents](#contents)

### Integrations

- [@angular/components](https://github.com/angular/components) for components and theming support
- [@angular/service-worker](https://angular.dev/ecosystem/service-workers) for PWA support
- [@commitlint/\*](https://github.com/conventional-changelog/commitlint) for semantic versioning
- [@jsverse/transloco](https://github.com/jsverse/transloco) for i18n and key management
- [@ngx-env/builder](https://github.com/chihab/dotenv-run/tree/main/packages/angular) for .env support
- [@supabase/supabase-js](https://github.com/supabase/supabase-js) for Supabase integration
- [ga-gtag](https://github.com/idmadj/ga-gtag) for Google Analytics integration

<br />

[↑ Back to Contents](#contents)

### Components

- `jet-app`: Root component that sets up layout, navigation, and more.
- `jet-footer`: Footer component.
- `jet-home-page`: Eagerly-loaded default page component.
- `jet-message-page`: Page component for showing static messages.
- `jet-page`: Component for managing SEO and toolbar title.
- `jet-profile-page`: Page component for managing profile.
- `jet-reset-password-page`: Page component for resetting password.
- `jet-settings-page`: Page component for updating language, color scheme, and more.
- `jet-sign-in-page`: Page component for signing-in.
- `jet-sign-out-page`: Page component for signing-out.
- `jet-sign-up-page`: Page component for signing-up.
- `jet-update-password-page`: Page component for updating password.

<br />

[↑ Back to Contents](#contents)

### Directives

- AnalyticsDirective

<br />

[↑ Back to Contents](#contents)

### Guards

- isAuthenticatedGuard
- isNotAuthenticatedGuard

<br />

[↑ Back to Contents](#contents)

### Services

- AlertService
- AnalyticsService
- LoggerService
- ProfileService
- ProgressBarService
- ServiceWorkerService
- SettingsService
- StorageService
- SupabaseService
- ToolbarTitleService
- UserService

<br />

[↑ Back to Contents](#contents)

### GitHub Actions

- `release-please`: Automatically cut releases and update changelog.
- `deploy-supabase-functions`: Automatically deploy Supabase Edge Functions and environment variables.

<br />

[↑ Back to Contents](#contents)

## Guides

<br />

[↑ Back to Contents](#contents)

### Getting started

<br />

[↑ Back to Contents](#contents)

### Adding elements

<br />

[↑ Back to Contents](#contents)

#### Add a component

<br />

[↑ Back to Contents](#contents)

#### Add a page component

<br />

[↑ Back to Contents](#contents)

#### Add a directive

<br />

[↑ Back to Contents](#contents)

#### Add a service

<br />

[↑ Back to Contents](#contents)

### Committing changes

<br />

[↑ Back to Contents](#contents)

#### Update precommit script

<br />

[↑ Back to Contents](#contents)

#### Commit code

<br />

[↑ Back to Contents](#contents)

#### Format code

<br />

[↑ Back to Contents](#contents)

#### Lint code

<br />

[↑ Back to Contents](#contents)

#### Update commit scopes

<br />

[↑ Back to Contents](#contents)

### Icons

<br />

[↑ Back to Contents](#contents)

#### Add an icon

<br />

[↑ Back to Contents](#contents)

#### Remove an icon

<br />

[↑ Back to Contents](#contents)

### Style

<br />

[↑ Back to Contents](#contents)

#### Add styles

<br />

[↑ Back to Contents](#contents)

#### Generate a Material theme

<br />

[↑ Back to Contents](#contents)

#### Override Material styles

<br />

[↑ Back to Contents](#contents)

### Internationalization

<br />

[↑ Back to Contents](#contents)

#### Add a language

<br />

[↑ Back to Contents](#contents)

#### Change the default language

<br />

[↑ Back to Contents](#contents)

#### Remove a language

<br />

[↑ Back to Contents](#contents)

### Environments

<br />

[↑ Back to Contents](#contents)

#### Add an environment

<br />

[↑ Back to Contents](#contents)

#### Add an environment variable

<br />

[↑ Back to Contents](#contents)

### Release

<br />

[↑ Back to Contents](#contents)

#### Cut a release

<br />

[↑ Back to Contents](#contents)

#### Cut a major release

<br />

[↑ Back to Contents](#contents)

### Deploy

<br />

[↑ Back to Contents](#contents)

#### Vercel

<br />

[↑ Back to Contents](#contents)

### Supabase

<br />

[↑ Back to Contents](#contents)

#### Link a Supabase project

<br />

[↑ Back to Contents](#contents)

#### Run Supabase locally

<br />

[↑ Back to Contents](#contents)

#### Remove Supabase

<br />

[↑ Back to Contents](#contents)

## Sponsors

Pay what you like, support development of Jet: https://karmasakshi.lemonsqueezy.com/buy/b4db1f83-66be-426d-b286-985b1e6b13ce.

<p align="center">
  <a
    href="https://github.com/singhamit089"
    target="_blank"
  >
    <img
      alt="dipenpradhan"
      src="https://github.com/singhamit089.png"
      style="border-radius: 50%;"
      width="64"
    />
    <br/>
    singhamit089
  </a>
  <a
    href="https://github.com/byjokese"
    target="_blank"
  >
    <img
      alt="byjokese"
      src="https://github.com/byjokese.png"
      style="border-radius: 50%;"
      width="64"
    />
    <br/>
    byjokese
  </a>
  <a
    href="https://github.com/dipenpradhan"
    target="_blank"
  >
    <img
      alt="dipenpradhan"
      src="https://github.com/dipenpradhan.png"
      style="border-radius: 50%;"
      width="64"
    />
    <br/>
    dipenpradhan
  </a>
</p>

<br />

[↑ Back to Contents](#contents)
