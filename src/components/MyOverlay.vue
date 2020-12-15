<template>
  <div
    :class="['my-overlay', className]"
    @click="$emit('click', $event.target.value)"
    v-show="show"
    :style="{
      'z-index': zIndex,
      customStyle,
      'animation-duration': duration + 's',
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class MyOverlay extends Vue {
  /**
   * 是否展示遮罩层
   */
  @Prop({ type: Boolean })
  show!: boolean;
  /**
   * z-index 层级
   */
  @Prop({ type: [Number, String], default: 1 })
  zIndex!: number | string;
  /**
   * 动画时长，单位秒
   */
  @Prop({ type: [Number, String], default: 0.3 })
  duration!: number | string;
  /**
   * 自定义类名
   */
  @Prop()
  className!: string;
  /**
   * 自定义样式
   */
  @Prop()
  customStyle!: string;
  /**
   * 是否锁定背景滚动，锁定时蒙层里的内容也将无法滚动
   */
  @Prop({ type: Boolean, default: true })
  lockScroll!: boolean;
  /**
   * 点击时触发
   */
  @Model("click")
  click!: string;
  /**
   * 监听show，当状态改变时根据lockScroll判断是否遮罩层滚动
   */
  @Watch("show")
  onShowChanged(newVal: boolean) {
    if (!this.lockScroll) {
      return;
    }
    if (newVal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }
}
</script>

<style scoped>
.my-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: auto;
}
</style>
<style>
.no-scroll {
  overflow-y: hidden;
  height: 100vh;
}
</style>