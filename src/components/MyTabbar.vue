<template>
  <div class="my-tabbar">
    <div class="my-tabbar-container my-tabbar-height">
      <slot></slot>
    </div>
    <div class="my-tabbar-height"></div>
  </div>
</template>
<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
@Component
export default class MyTabbar extends Vue {
  /**
   * 当前选中标签的名称或索引值
   */
  @Prop({ default: 0 })
  value!: number | string;
  /**
   * 是否固定在底部
   */
  @Prop({ type: Boolean, default: true })
  fixed!: boolean;
  /**
   * 是否显示外边框
   */
  @Prop({ type: Boolean, default: true })
  border!: boolean;
  /**
   * 元素 z-index
   */
  @Prop({ type: [Number, String], default: 1 })
  "z-index"!: number | string;
  /**
   * 选中标签的颜色
   */
  @Prop({ default: "#1989fa" })
  "active-color"!: string;
  /**
   * 未选中标签的颜色
   */
  @Prop({ default: "#7d7e80" })
  "inactive-color"!: string;
  /**
   * 是否开启路由模式
   */
  @Prop({ type: Boolean })
  route!: boolean;
  /**
   * 固定在底部时，是否在标签位置生成一个等高的占位元素
   */
  @Prop({ type: Boolean })
  placeholder!: boolean;
  /**
   * 是否开启底部安全区适配，设置 fixed 时默认开启
   */
  @Prop({ type: Boolean })
  "safe-area-inset-bottom"!: boolean;
  /**
   * 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise
   * (name) => boolean | Promise
   */
  @Prop()
  "before-change"!: Function | Promise<boolean>;
  /**
   * 切换标签时触发
   */
  @Model("change")
  change!: string;
}
</script>
<style scoped>
.my-tabbar-container {
  line-height: normal;
  position: relative;
  width: 100%;
  bottom: 0;
  display: flex;
  box-sizing: content-box;
}
.my-tabbar-height {
  height: 2.3rem;
}
.my-tabbar-fixed {
  position: fixed;
}
.my-tabbar-item {
  height: 100%;
  font-size: 0.75rem;
  padding: 0;
}
.my-tabbar-item span {
  display: block;
}
</style>