<template>
  <nav>
    <ul class="nav nav-tabs nav-tabs-group">
      <li class="nav-item" :class="{ active: modelValue === MarkdownInputActiveTab.Write }">
        <a v-fake-link class="nav-link" @click="model = MarkdownInputActiveTab.Write"> Write </a>
      </li>
      <li class="nav-item" :class="{ active: modelValue === MarkdownInputActiveTab.Preview }">
        <a v-fake-link class="nav-link" @click="model = MarkdownInputActiveTab.Preview"> Preview </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { MarkdownInputActiveTab } from "../markdown-input/meta"
import { computed, type PropType } from "vue"

const props = defineProps({ modelValue: { type: Number as PropType<MarkdownInputActiveTab>, default: MarkdownInputActiveTab.Write } })
const emit = defineEmits(["update:modelValue"])

const model = computed({
  get(): MarkdownInputActiveTab {
    return props.modelValue
  },
  set(v: MarkdownInputActiveTab) {
    emit("update:modelValue", v)
  },
})
</script>
