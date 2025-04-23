<template>
  <div class="form-control p-0">
    <label v-if="!!label" for=""> {{ label }} <span v-if="required" class="text-warning tip" aria-label="Required field">*</span> </label>
    <div class="markdown-input">
      <div class="markdown-header">
        <markdown-nav-tabs v-model="activeTab" />
        <div v-if="activeTab == MarkdownInputActiveTab.Write" class="d-flex">
          <button class="btn tip" aria-label="Heading" @click="mark('header')"><icon icon="heading" /></button>
          <button class="btn tip" aria-label="Bold" @click="mark('bold')"><icon icon="bold" /></button>
          <button class="btn tip" aria-label="Italic" @click="mark('italic')"><icon icon="italic" /></button>
          <button class="btn tip" aria-label="Underline" @click="mark('underline')"><icon icon="underline" /></button>
          <button class="btn tip" aria-label="Link" @click="mark('link')"><icon icon="link" /></button>
          <hr class="d-inline border-left my-1" />
          <dropdown :alignment="DropdownAlignmentEnum.Right" :size="SizeEnum.LG" class="btn tip" aria-label="How to use">
            <template #trigger>
              <icon icon="circle-info" />
            </template>
            <template #content>
              HOW TO USE
              <div class="bg-warning">TEST</div>
            </template>
          </dropdown>
        </div>
      </div>
      <textarea v-if="activeTab == MarkdownInputActiveTab.Write" v-model="model" ref="textareaRef" :placeholder></textarea>
      <div v-else v-html="useMarkdownParse(model)" class="markdown-preview"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TestModel } from "./model"
import { SizeEnum } from "../../core/utils/core"
import { DropdownAlignmentEnum } from "../dropdown/meta"
import { MarkdownInputActiveTab } from "./meta"
import { defineAsyncComponent, ref, type Ref } from "vue"
import { props as markdownProps, getHighlightedTextIdx, updateHighlightedText, useMarkdownParse } from "./def"
import type { TMarkdownMark } from "./meta"

defineProps(markdownProps)
const activeTab = ref(MarkdownInputActiveTab.Write),
  model = ref(TestModel),
  textareaRef = ref() as Ref<HTMLTextAreaElement>

const mark = async (type: TMarkdownMark /**, customLinkData?: any*/) => {
  if (!textareaRef.value) return
  const result = updateHighlightedText(
    model.value,
    type,
    getHighlightedTextIdx(textareaRef.value, type == "ol" || type == "ul" || type == "header") /**, mapCustomLinkData(customLinkData) */
  )
  model.value = result.text

  textareaRef.value.focus()
  // await nextTick()
  // textareaRef.value.setSelectionRange(result.selection.start, result.selection.end)

  // if (!!customLinkData) resetDropdown()
}

const MarkdownNavTabs = defineAsyncComponent(() => import("../markdown-nav/index.vue"))
const Icon = defineAsyncComponent(() => import("../icon/index.vue"))
const Dropdown = defineAsyncComponent(() => import("../dropdown/index.vue"))
</script>
