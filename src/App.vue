<template>
  <template v-if="appReady">
    <div class="page">
      <div class="d-flex justify-content-center m-5">
        <card class="w-75">
          <markdown-input label="Markdown Input" placeholder="Markdown Input" required />
        </card>
      </div>
    </div>
    <div id="app-overlay" class="app-overlay"></div>
  </template>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, watch } from "vue"
import { getService } from "./services"

const appReady = ref(false)

watch(
  () => getService("core-service"),
  (to) => {
    if (!to) return
    appReady.value = true
  },
  { immediate: true }
)

const Card = defineAsyncComponent(() => import("./components/card/index.vue"))
const MarkdownInput = defineAsyncComponent(() => import("./components/markdown-input/index.vue"))
</script>
