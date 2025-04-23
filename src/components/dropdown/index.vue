<template>
  <component ref="trigger" :is="tag" v-bind="$attrs" @click.stop="model = !model">
    <slot name="trigger"></slot>
  </component>
  <Teleport v-if="coreService.dropdownShown" to="#dropdown">
    <div>
      <slot name="content"></slot>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, ref, toRef, watch, type PropType, type Ref } from "vue"
import { getService } from "../../services"
import { DropdownAlignmentEnum } from "./meta"
import { SizeEnum, type TOptionalProp } from "../../core/utils/core"
import type { ICoreService } from "../../core/interfaces/i-core-service"

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  tag: { type: String, default: "button" },
  alignment: String as PropType<DropdownAlignmentEnum>,
  size: String as PropType<SizeEnum>,
})
const coreService = getService("core-service") as ICoreService,
  modelValue = toRef(props, "modelValue"),
  localModel = ref() as Ref<TOptionalProp<boolean>>,
  hasModelValue = modelValue.value !== undefined,
  trigger = ref()

const model = computed({
  get(): boolean {
    return hasModelValue ? !!modelValue.value : !!localModel.value
  },
  set(v: boolean) {
    hasModelValue ? emit("update:modelValue", v) : (localModel.value = v)
  },
})

watch(
  () => model.value,
  (to) => to && coreService.showDropdown(trigger.value, props.alignment, props.size)
)

watch(
  () => coreService.dropdownShown,
  (to) => !to && (model.value = false)
)
</script>
