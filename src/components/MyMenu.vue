<template>
  <div
    class="my-menu"
    :style="{ 'background-color': backgroundColor, height: height }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MyMenu extends Vue {
  /**
   * 背景颜色
   */
  @Prop({ default: "transparent" })
  backgroundColor!: string;
  /**
   * 高度
   */
  @Prop({ default: "auto" })
  height!: number | string;
}
</script>

<style scoped>
.my-menu {
  line-height: normal;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>