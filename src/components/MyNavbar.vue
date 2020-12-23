<template>
  <div
    class="my-navbar"
    :style="{
      'z-index': zIndex,
    }"
  >
    <div :class="{ 'my-navbar-fixed': fixed }">
      <div class="my-navbar-save-area" v-if="safeAreaInsetTop"></div>
      <div
        :class="[
          'my-navbar-container',
          'my-navbar-height',
          { 'my-navbar-down-border': border },
        ]"
      >
        <div
          class="my-navbar-content my-navbar-left-content"
          @click="leftClick($event)"
        >
          <slot name="left"
            ><span
              :class="{ 'my-navbar-left-text': leftArrow }"
              v-text="leftText"
            ></span
          ></slot>
        </div>
        <div class="my-navbar-content my-navbar-middle-content">
          <slot name="title"
            ><span class="my-navbar-title" v-text="title"></span
          ></slot>
        </div>
        <div
          class="my-navbar-content my-navbar-right-content"
          @click="rightClick($event)"
        >
          <slot name="right"
            ><span class="my-navbar-right-text" v-text="rightText"></span
          ></slot>
        </div>
      </div>
    </div>
    <div class="my-navbar-save-area" v-if="safeAreaInsetTop"></div>
    <div
      :class="[
        'my-navbar-placeholder',
        'my-navbar-height',
        { 'my-navbar-down-border': border },
      ]"
      v-if="fixed && placeholder"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
@Component
export default class MyNavbar extends Vue {
  /**
   * 标题
   */
  @Prop({ type: String, default: "" })
  title!: string;
  /**
   * 左侧文案
   */
  @Prop({ type: String, default: "" })
  leftText!: string;
  /**
   * 右侧文案
   */
  @Prop({ type: String, default: "" })
  rightText!: string;
  /**
   * 是否显示左侧箭头
   */
  @Prop({ type: Boolean })
  leftArrow!: boolean;
  /**
   * 是否显示下边框
   */
  @Prop({ type: Boolean, default: true })
  border!: boolean;
  /**
   * 是否固定在顶部
   */
  @Prop({ type: Boolean })
  fixed!: boolean;
  /**
   * 固定在顶部时，是否在标签位置生成一个等高的占位元素
   */
  @Prop({ type: Boolean })
  placeholder!: boolean;
  /**
   * 导航栏 z-index
   */
  @Prop({ default: 1 })
  zIndex!: number | string;
  /**
   * 是否开启顶部安全区适配
   */
  @Prop({ type: Boolean })
  safeAreaInsetTop!: boolean;
  /**
   * 点击左侧按钮时触发
   */
  @Emit() // eslint-disable-next-line
  leftClick(event: MouseEvent) {
    // TODO: click
  }
  /**
   * 点击右侧按钮时触发
   */
  @Emit() // eslint-disable-next-line
  rightClick(event: MouseEvent) {
    // TODO: click
  }
}
</script>

<style scoped>
.my-navbar {
  position: relative;
}
.my-navbar-height {
  height: 3rem;
}
.my-navbar-fixed {
  position: fixed;
  width: 100%;
  top: 0;
}
.my-navbar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: normal;
  background-color: #fff;
  width: 100%;
}
.my-navbar-down-border {
  border-width: 0 0 0.0625rem 0;
  border-color: #000;
  border-style: solid;
}
.my-navbar-save-area {
  position: fixed;
  width: 100%;
  height: 0.5rem;
}
.my-navbar-left-text::before {
  content: "";
  display: inline-block;
  margin-right: 0.5rem;
  height: 0.5rem;
  width: 0.5rem;
  border-width: 0 0 0.125rem 0.125rem;
  border-color: #000;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
}
.my-navbar-content {
  flex: 1;
}
.my-navbar-title {
  font-size: 1.2rem;
}
</style>