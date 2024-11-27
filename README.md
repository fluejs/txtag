# @fluejs/txtag

[<img src="https://pkg-size.dev/badge/bundle/1407">](https://pkg-size.dev/@fluejs%2Ftxtag)
[<img src="https://img.shields.io/npm/v/@fluejs/txtag.svg">](https://www.npmjs.com/package/@fluejs/txtag)
<img src="https://img.shields.io/npm/l/@fluejs/noscroll">

Small and lightweight library that helps you compile simple text templates. It can be useful for interpolation in dictionaries (e.g. i18n) or dynamic data substitution in text strings.

[Documentation & demo](https://txtag.fl3nkey.com/)

## Installation

```shell
# npm
npm install --save-dev @fluejs/txtag

# yarn
yarn add -D @fluejs/txtag
```

```ts
import {compile} from '@fluejs/txtag';

compile('Hello, {name}!', { name: 'Joe' });

// result: "Hello, Joe!"
```