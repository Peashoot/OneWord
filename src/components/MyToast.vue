<template>
  <div
    :class="[
      'my-toast',
      { 'my-toast-allow-click': !forbidClick },
      { 'my-toast-overlay': overlay },
    ]"
    v-show="value"
    @click="overlay && closeOnClickOverlay && input(false)"
  >
    <div
      :class="['my-toast-view', 'my-toast-view-' + position]"
      @click="closeOnClick && input(false)"
    >
      <my-icon
        v-if="realIcon"
        :name="realIcon"
        :class-prefix="iconPrefix"
      ></my-icon>
      <div
        v-if="type === 'html'"
        class="my-toast-message"
        v-html="message"
      ></div>
      <div v-else class="my-toast-message" v-text="message"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model, Emit } from "vue-property-decorator";
import MyIcon from "./MyIcon.vue";
@Component({
  components: {
    "my-icon": MyIcon,
  },
})
export default class MyToast extends Vue {
  /**
   * 是否显示
   */
  @Model("input", { type: Boolean })
  value!: boolean;
  /**
   * 通知父级状态变更
   */
  @Emit()
  input(val: boolean) {
    // TODO:
  }
  /**
   * 提示类型，可选值为 loading success fail html
   */
  @Prop({ default: "text" })
  type!: string;
  /**
   * 位置，可选值为 top bottom
   */
  @Prop({ default: "middle" })
  position!: string;
  /**
   * 文本内容，支持通过\n换行
   */
  @Prop()
  message!: string;
  /**
   * 自定义图标，支持传入图标名称或图片链接
   */
  @Prop()
  icon!: string;
  get realIcon() {
    if (this.icon) {
      return this.icon;
    }
    if (this.type === "success") {
      return "check";
    }
    if (this.type === "fail") {
      return "exclamation";
    }
    if (this.type === "loading") {
      return "spinner";
    }
    return null;
  }
  /**
   * 图标类名前缀，同 Icon 组件的 class-prefix 属性
   */
  @Prop({ default: "icofont" })
  iconPrefix!: string;
  /**
   * 是否显示背景遮罩层
   */
  @Prop({ type: Boolean })
  overlay!: boolean;
  /**
   * 是否禁止背景点击
   */
  @Prop({ type: Boolean })
  forbidClick!: boolean;
  /**
   * 是否在点击后关闭
   */
  @Prop({ type: Boolean })
  closeOnClick!: boolean;
  /**
   * 是否在点击遮罩层后关闭
   */
  @Prop({ type: Boolean })
  closeOnClickOverlay!: boolean;
  /**
   * 加载图标类型, 可选值为 spinner
   */
  @Prop({ type: String, default: "circular" })
  loadingType!: string;
  /**
   * 展示时长(ms)，值为 0 时，toast 不会消失
   */
  @Prop({ type: Number, default: 2000 })
  duration!: number;
  /**
   * 自定义类名
   */
  @Prop()
  className!: string;
  /**
   * 完全展示后的回调函数
   */
  @Prop({ type: Function })
  onOpened!: Function;
  /**
   * 关闭时的回调函数
   */
  @Prop({ type: Function })
  onClose!: Function;
  /**
   * 动画类名，等价于 transition 的name属性
   */
  @Prop({ default: "my-fade" })
  transition!: string;
}
interface ToastOption {
  /**
   * 提示类型，可选值为 loading success fail html
   */
  type?: string;
  /**
   * 位置，可选值为 top bottom
   */
  position?: string;
  /**
   * 文本内容，支持通过\n换行
   */
  message?: string;
  /**
   * 自定义图标，支持传入图标名称或图片链接
   */
  icon?: string;
  /**
   * 图标类名前缀，同 Icon 组件的 class-prefix 属性
   */
  iconPrefix?: string;
  /**
   * 是否显示背景遮罩层
   */
  overlay?: boolean;
  /**
   * 是否禁止背景点击
   */
  forbidClick?: boolean;
  /**
   * 是否在点击后关闭
   */
  closeOnClick?: boolean;
  /**
   * 是否在点击遮罩层后关闭
   */
  closeOnClickOverlay?: boolean;
  /**
   * 加载图标类型, 可选值为 spinner
   */
  loadingType?: string;
  /**
   * 展示时长(ms)，值为 0 时，toast 不会消失
   */
  duration?: number;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 完全展示后的回调函数
   */
  onOpened?: Function;
  /**
   * 关闭时的回调函数
   */
  onClose?: Function;
  /**-
   * 动画类名，等价于 transition 的name属性
   */
  transition?: string;
}
</script>

<style scoped>
.my-toast {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  line-height: normal;
  color: #fff;
  text-align: center;
  z-index: 1;
}
.my-toast-allow-click {
  pointer-events: none;
}
.my-toast-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}
.my-toast-view {
  position: relative;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0.5rem;
  width: fit-content;
  transform: translateY(-50%);
}
.my-toast-view-top {
  top: 20%;
}
.my-toast-view-middle {
  top: 50%;
}
.my-toast-view-bottom {
  bottom: 20%;
}
.my-toast-message {
  padding: 0.5rem 2rem;
  font-size: 0.8rem;
}
</style>