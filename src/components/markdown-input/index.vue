<template>
  <div class="form-control">
    <label v-if="!!label" for=""> {{ label }} <span v-if="required" class="text-warning tip" aria-label="Required field">*</span> </label>
    <div class="markdown-input">
      <div class="d-flex">
        <markdown-nav-tabs v-model="activeTab" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from "vue"
import { props as markdownProps } from "./def"
import { MarkdownInputActiveTab } from "./meta"

defineProps(markdownProps)
const activeTab = ref(MarkdownInputActiveTab.Write)

const MarkdownNavTabs = defineAsyncComponent(() => import("../markdown-nav/index.vue"))
</script>
