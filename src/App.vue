<template>
  <div v-if="appReady" class="app-page">
    <div class="d-flex justify-content-center m-5">
      <card class="w-75">
        <markdown-input label="Markdown Input" placeholder="Markdown Input" required />
      </card>
    </div>
  </div>
  <div id="app-overlay" class="app-overlay">
    <div class="app-backdrop" @click="coreService.hideDropdown"></div>
    <div id="dropdown"></div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, watch, type Ref } from "vue"
import { getService } from "./services"
import type { ICoreService } from "./core/interfaces/i-core-service"

const appReady = ref(false)
const coreService = ref() as Ref<ICoreService>

watch(
  () => getService("core-service"),
  (to) => {
    if (!to) return
    coreService.value = to as ICoreService
    appReady.value = true
  },
  { immediate: true }
)

const Card = defineAsyncComponent(() => import("./components/card/index.vue"))
const MarkdownInput = defineAsyncComponent(() => import("./components/markdown-input/index.vue"))
</script>
