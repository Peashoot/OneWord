<template>
  <div class="my-image"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class MyImage extends Vue {
  @Prop()
  src!: string;
}
</script>

<style scoped>
</style>