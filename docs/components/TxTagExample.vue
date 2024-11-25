<template>
    <article class="block">
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
import { TxTag } from '../../src/vue';

const source = `{header}Article{/header}

{p}Lorem ipsum dolor sit amet, consectetur adipisicing elit. {strong}Aliquam animi fugiat in laboriosam laborum maxime{/strong}, modi mollitia odio porro quos saepe tempore temporibus veritatis voluptatem, voluptatibus. Atque ea in neque?{/p}

{p}Lorem ipsum dolor sit amet, consectetur adipisicing elit. {link}Aliquam animi fugiat in laboriosam laborum maxime{/link}[#], modi mollitia odio porro quos saepe tempore temporibus veritatis voluptatem, voluptatibus. Atque ea in neque?{/p}

{p}Written by {strong}{author}{/strong}{/p}`;
</script>
