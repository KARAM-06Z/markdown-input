<template>
  <div class="form-control p-0">
    <label v-if="!!label" for=""> {{ label }} <span v-if="required" class="text-warning tip" aria-label="Required field">*</span> </label>
    <div class="markdown-input">
      <div class="markdown-header">
        <markdown-nav-tabs v-model="activeTab" />
        <div v-if="activeTab == MarkdownInputActiveTab.Write" class="d-flex">
          <button class="btn tip" aria-label="Heading"><icon icon="heading" /></button>
          <button class="btn tip" aria-label="Bold"><icon icon="bold" /></button>
          <button class="btn tip" aria-label="Italic"><icon icon="italic" /></button>
          <button class="btn tip" aria-label="Underline"><icon icon="underline" /></button>
          <button class="btn tip" aria-label="Link"><icon icon="link" /></button>
          <hr class="d-inline border-left my-1" />
          <button class="btn tip" aria-label="How to use"><icon icon="circle-info" /></button>
        </div>
      </div>
      <textarea :placeholder rows="4"></textarea>
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
const Icon = defineAsyncComponent(() => import("../icon/index.vue"))
</script>
