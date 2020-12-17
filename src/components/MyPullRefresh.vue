<template>
  <div
    class="my-pull-refresh"
    @touchstart="touchStart($event)"
    @touchmove="touchMove($event)"
    @touchend="touchEnd($event)"
    @mousedown="mouseDown($event)"
    @mousemove="mouseMove($event)"
    @mouseup="mouseUp($event)"
  >
    <div
      class="my-pull-refresh-container"
      ref="container"
      :style="{
        'transition-property': 'transform',
        'transition-duration': animationDuration + 'ms',
        transform: 'translateY(' + distance + 'px)',
      }"
    >
      <slot name="normal">
        <div
          class="my-pull-refresh-head"
          :style="{
            height: headHeight + 'px',
            'line-height': headHeight + 'px',
          }"
        >
          <div class="my-pull-refresh-prompt" v-if="status == 'pulling'">
            <slot name="pulling">{{ pullingText }}</slot>
          </div>
          <div class="my-pull-refresh-prompt" v-if="status == 'loosing'">
            <slot name="loosing">{{ loosingText }}</slot>
          </div>
          <div class="my-pull-refresh-prompt" v-if="status == 'loading'">
            <slot name="loading">{{ loadingText }}</slot>
          </div>
          <div class="my-pull-refresh-prompt" v-if="status == 'success'">
            <slot name="success">{{ successText }}</slot>
          </div>
        </div></slot
      >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Model,
  Watch,
  Emit,
  Ref,
} from "vue-property-decorator";
@Component
export default class MyPullRefresh extends Vue {
  /**
   * 是否处于加载中状态
   */
  @Model("input")
  value!: boolean;
  /**
   * 更新value
   */
  @Emit() // eslint-disable-next-line
  input(value: boolean) {
    // TODO: update value
  }
  /**
   * 下拉过程提示文案
   */
  @Prop({ default: "下拉即可刷新..." })
  pullingText!: string;
  /**
   * 释放过程提示文案
   */
  @Prop({ default: "释放即可刷新..." })
  loosingText!: string;
  /**
   * 加载过程提示文案
   */
  @Prop({ default: "加载中..." })
  loadingText!: string;
  /**
   * 刷新成功提示文案
   */
  @Prop()
  successText!: string;
  /**
   * 刷新成功提示展示时长(ms)
   */
  @Prop({ type: Number, default: 500 })
  successDuration!: number;
  /**
   * 动画时长
   */
  @Prop({ type: [Number, String], default: 200 })
  animationDuration!: number | string;
  /**
   * 顶部内容高度
   */
  @Prop({ type: [Number, String], default: 50 })
  headHeight!: number;
  /**
   * 是否禁用下拉刷新
   */
  @Prop({ type: Boolean })
  disabled!: boolean;
  /**
   * 下拉刷新时触发
   */
  @Emit() // eslint-disable-next-line
  refresh() {
    // TODO: refresh
  }
  /**
   * 下拉容器
   */
  @Ref()
  container!: HTMLElement;
  /**
   * 开始下拉的y坐标
   */
  beginY = 0;
  /**
   * 当前状态
   */
  status = "normal";
  /**
   * 偏移距离
   */
  distance = 0;
  /**
   * 开始下拉-桌面端事件
   */
  mouseDown(event: MouseEvent) {
    this.startPull(event.clientY);
  }
  /**
   * 开始下拉-移动端事件
   */
  touchStart(event: TouchEvent) {
    this.startPull(event.touches[0].clientY);
  }
  /**
   * 开始下拉
   */
  startPull(clientY: number) {
    this.beginY = clientY;
    this.container.style.transitionProperty = "none";
  }
  /**
   * 下拉中-桌面端事件
   */
  mouseMove(event: MouseEvent) {
    if (this.beginY <= 0) {
      return;
    }
    const distance = event.clientY - this.beginY;
    this.pulling(distance);
  }
  /**
   * 下拉中-移动端事件
   */
  touchMove(event: TouchEvent) {
    const distance = event.changedTouches[0].clientY - this.beginY;
    this.pulling(distance);
  }
  /**
   * 下拉中
   */
  pulling(distance: number) {
    if (distance <= 0) {
      this.distance = 0;
      return;
    }
    this.distance = this.ease(distance);
    if (this.headHeight < distance) {
      this.status = "loosing";
    } else {
      this.status = "pulling";
    }
  }
  /**
   * 停止下发-桌面端事件
   */
  mouseUp(event: MouseEvent) {
    if (this.beginY <= 0) {
      return;
    }
    const distance = event.clientY - this.beginY;
    this.beginY = 0;
    this.loosePull(distance);
  }
  /**
   * 停止下拉-移动端事件
   */
  touchEnd(event: TouchEvent) {
    const distance = event.changedTouches[0].clientY - this.beginY;
    this.loosePull(distance);
  }
  /**
   * 停止下拉
   */
  loosePull(distance: number) {
    this.container.style.transitionProperty = "transform";
    if (this.headHeight < distance) {
      this.status = "loading";
      this.distance = this.headHeight;
      this.input(true);
      this.$nextTick(function () {
        this.refresh();
      });
    } else {
      this.status = "";
      this.distance = 0;
    }
  }
  /**
   * 当value变了时，复原
   */
  @Watch("value")
  onValueChanged(newVal: boolean, oldVal: boolean) {
    if (newVal || !oldVal) {
      return;
    }
    if (this.successText && this.successText != "") {
      this.status = "success";
      setTimeout(() => {
        this.status = "";
        this.distance = 0;
      }, this.successDuration);
    } else {
      this.status = "";
      this.distance = 0;
    }
  }
  /**
   * 减缓下拉距离
   */
  ease(distance: number) {
    const headHeight = +this.headHeight;
    if (distance > headHeight) {
      if (distance < headHeight * 2) {
        distance = headHeight + (distance - headHeight) / 2;
      } else {
        distance = headHeight * 1.5 + (distance - headHeight * 2) / 4;
      }
    }
    return Math.round(distance);
  }
}
</script>

<style scoped>
.my-pull-refresh {
  overflow: hidden;
  user-select: none;
}
.van-pull-refresh-container {
  position: relative;
  height: 100%;
  transition-property: transform;
}
.my-pull-refresh-head {
  position: absolute;
  left: 0;
  transform: translateY(-100%);
  width: 100%;
}
.my-pull-refresh-prompt {
  width: 100%;
  display: flex;
  align-self: center;
  justify-content: center;
}
</style>