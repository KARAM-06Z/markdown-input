<template>
  <label v-if="!!label" for=""> {{ label }} <span v-if="required" class="text-warning">*</span> </label>
  <div class="d-flex">
    <markdown-nav-tabs v-model="activeTab" />
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
