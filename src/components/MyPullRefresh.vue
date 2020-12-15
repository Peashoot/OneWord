<template>
  <div
    class="my-pull-refresh"
    @touchstart="startPull($event)"
    @touchmove="pulling($event)"
    @touchend="loosePull($event)"
  >
    <div
      class="my-pull-refresh-track"
      :style="{ transform: 'translateY(' + distance + 'px)' }"
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
          <div
            class="my-pull-refresh-prompt"
            v-if="successText && successText != '' && status == 'success'"
          >
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
} from "vue-property-decorator";
@Component
export default class MyPullRefresh extends Vue {
  /**
   * 是否处于加载中状态
   */
  @Model("input")
  value!: boolean;

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
  @Prop({ type: Number, default: 300 })
  successDuration!: number;
  /**
   * 动画时长
   */
  @Prop({ type: [Number, String] })
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
   * 开始下拉
   */
  startPull(event: TouchEvent) {
    this.beginY = event.touches[0].clientY;
  }
  /**
   * 下拉中
   */
  pulling(event: TouchEvent) {
    const diffY = event.changedTouches[0].clientY - this.beginY;
    if (diffY <= 0) {
      this.distance = 0;
      return;
    }
    this.distance = this.ease(diffY);
    if (this.headHeight < diffY) {
      // TODO: show loosing text
      this.status = "loosing";
    } else {
      // TODO: show pulling text
      this.status = "pulling";
    }
  }
  /**
   * 停止下拉
   */
  loosePull(event: TouchEvent) {
    const distance = event.changedTouches[0].clientY - this.beginY;
    if (this.headHeight < distance) {
      // TODO: do refresh
      this.status = "loading";
      this.distance = this.headHeight;
      this.input(true);
      this.$nextTick(function () {
        this.refresh();
      });
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
.van-pull-refresh-track {
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