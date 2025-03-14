<template>
  <div class="page">
    <div class="d-flex justify-content-center align-items-center h-100">
      <card class="w-75">
        <span>Markdown Input</span>
      </card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const Card = defineAsyncComponent(() => import("./components/card/index.vue"));
</script>
