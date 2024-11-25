<script setup>
import TxTagExample from './components/TxTagExample.vue';
</script>

# Guide

## What is `txtag`?

This is a small and lightweight library that helps you compile simple text templates. It can be useful for interpolation in dictionaries (e.g. i18n) or dynamic data substitution in text strings.

## Installation

### Via package manager

::: code-group

```shell [npm]
npm install --save-dev @fluejs/txtag
```

```shell [yarn]
yarn add -D @fluejs/txtag
```

:::

## Usage

To compile a template, `txtag` provides the `compile` method, which takes a template with expressions as the first argument and a data object as the second argument.

```ts
import {compile} from '@fluejs/txtag';

compile('Hello, {name}!', { name: 'Joe' });

// result: "Hello, Joe!"
```

Expressions can also be paired and contain content (the nesting of expressions is unlimited).

```ts
import {compile} from '@fluejs/txtag';

compile('Hello, {strong}{name}{/strong}!', {
    name: 'Joe',
    strong: ({ body }) => `<strong>${body}</strong>`,
});

// result: "Hello, <strong>Joe</strong>!"
```

Expressions can also have arguments. Arguments are accessible within the value function. The delimiter for arguments is the `|` symbol.

```ts
import {compile} from '@fluejs/txtag';

compile('Hello, {link}{name}{/link}[https://github.com]!', {
    name: 'Joe',
    link: ({ body, args }) => `<a href="${args?.[0]}">${body}</a>`,
});

// result: "Hello, <a href="https://github.com">Joe</a>!"
```

```ts
import {compile} from '@fluejs/txtag';

compile('Here are three values: {argsExample}[1|2|3]', {
    argsExample: ({ args }) => args?.join(', '),
});

// result: Here are three values: 1, 2, 3
```

## Using with Vue

`txtag/vue` provides the `TxTag` component, which allows expressions to be replaced with an attribute or a slot (the name corresponds to the name of the expression).

> [!NOTE]
> If you are rendering a paired expression, you will most likely need to use the `Component` from the scoped slot, which will recursively render the content.
> 
> `<component :is="Component" />`

:::tabs
== Example
Rendered with `TxTag` Vue component

<TxTagExample />
== Code
```vue
<template>
    <article>
        <TxTag
            :source="source"
            author="No Name">
            <template #header="{ body }">
                <h1>
                    {{ body }} 
                </h1>
            </template>
            <template #p="{ Component }">
                <p>
                    <component :is="Component" />
                </p>
            </template>
            <template #strong="{ Component }">
                <strong>
                    <component :is="Component" />
                </strong>
            </template>
            <template #link="{ Component, args }">
                <a :href="args?.[0]">
                    <component :is="Component" />
                </a>
            </template>
        </TxTag>
    </article>
</template>

<script setup lang="ts">
import { TxTag } from '@fluejs/txtag/vue';

const source = `{header}Article{/header}

{p}Lorem ipsum dolor sit amet, consectetur adipisicing elit. {strong}Aliquam animi fugiat in laboriosam laborum maxime{/strong}, modi mollitia odio porro quos saepe tempore temporibus veritatis voluptatem, voluptatibus. Atque ea in neque?{/p}

{p}Lorem ipsum dolor sit amet, consectetur adipisicing elit. {link}Aliquam animi fugiat in laboriosam laborum maxime{/link}[#], modi mollitia odio porro quos saepe tempore temporibus veritatis voluptatem, voluptatibus. Atque ea in neque?{/p}

{p}Written by {strong}{author}{/strong}{/p}`;
</script>

```
:::




