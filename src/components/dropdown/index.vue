<template>
  <div class="dropdown-trigger" @click="trigger">
    <slot name="trigger"></slot>
  </div>
  <slot name="content"></slot>
</template>

<script lang="ts" setup>
import { toRef, watch } from "vue"
import { getService } from "../../services"
import type { ICoreService } from "../../core/interfaces/i-core-service"

const props = defineProps({ modelValue: Boolean })
const coreService = getService("core-service") as ICoreService,
  modelValue = toRef(props, "modelValue")

const trigger = () => {
  console.log(coreService.getOverlay)
}

watch(() => modelValue.value, trigger)
</script>
