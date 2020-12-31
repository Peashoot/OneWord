<template>
  <div class="my-switch-container">
    <div
      class="my-switch-bottom"
      @click="click($event)"
      :style="{
        width: width,
        height: height,
        'border-radius': height,
        'background-color': value ? activeColor : inactiveColor,
      }"
    >
      <div
        :class="[
          value ? 'my-switch-top-checked' : 'my-switch-top-unchecked',
          'my-switch-top',
        ]"
        ref="mySwitchTop"
        :style="{ width: height, height: height }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from "vue-property-decorator";
@Component
export default class MySwitch extends Vue {
  /**
   * 开关状态
   */
  @Model("input")
  value!: boolean;

  @Emit() // eslint-disable-next-line
  input(status: boolean) {
    // TODO: update value
  }
  /**
   * 状态切换事件
   */
  @Emit() // eslint-disable-next-line
  click(event: MouseEvent) {
    // TODO: click
    this.input(!this.value);
  }
  /**
   * 高度
   */
  @Prop({ type: String, default: "2.5rem" })
  height!: string;
  /**
   * 宽度
   */
  @Prop({ type: String, default: "5rem" })
  width!: string;
  /**
   * 关闭时的背景色
   */
  @Prop({ type: String, default: "#fff" })
  inactiveColor!: string;
  /**
   * 打开时的背景色
   */
  @Prop({ type: String, default: "#1989fa" })
  activeColor!: string;
}
</script>

<style scoped>
.my-switch-bottom {
  margin: 0 auto;
  position: relative;
  border: 0.0625rem solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.my-switch-top {
  position: absolute;
  border-radius: 100%;
  top: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 0.1875rem 0.0625rem 0 rgba(0, 0, 0, 0.05),
    0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.1),
    0 0.1875rem 0.1875rem 0 rgba(0, 0, 0, 0.05);
}
.my-switch-top-checked {
  animation: my-switch-top-check 0.2s 1;
  animation-fill-mode: forwards;
}
.my-switch-top-unchecked {
  animation: my-switch-top-uncheck 0.2s 1;
  animation-fill-mode: forwards;
}
@keyframes my-switch-top-check {
  from {
    left: 0;
  }
  to {
    left: 100%;
    transform: translateX(-100%);
    -ms-transform: translateX(-100%);
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}
@-webkit-keyframes my-switch-top-check /*Safari and Chrome*/ {
  from {
    left: 0;
  }
  to {
    left: 100%;
    transform: translateX(-100%);
    -ms-transform: translateX(-100%);
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}
@keyframes my-switch-top-uncheck {
  from {
    left: 100%;
    transform: translateX(-100%);
    -ms-transform: translateX(-100%);
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
  to {
    left: 0;
  }
}
@-webkit-keyframes my-switch-top-uncheck /*Safari and Chrome*/ {
  from {
    left: 100%;
    transform: translateX(-100%);
    -ms-transform: translateX(-100%);
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
  to {
    left: 0;
  }
}
</style>