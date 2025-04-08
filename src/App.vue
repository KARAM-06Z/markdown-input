<template>
  <div class="page">
    <div class="d-flex justify-content-center align-items-center h-100">
      <card class="w-75">
        <markdown-input label="Markdown Input" placeholder="Markdown Input" required />
      </card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue"

const Card = defineAsyncComponent(() => import("./components/card/index.vue"))
const MarkdownInput = defineAsyncComponent(() => import("./components/markdown-input/index.vue"))
</script>
