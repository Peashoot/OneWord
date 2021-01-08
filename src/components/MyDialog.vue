<template>
  <transition name="transition">
    <div class="my-dialog" :show="value">
      <div
        v-if="overlay"
        :class="['my-dialog-overlay', overlayClass]"
        :style="overlayStyle"
        @click="closeOnClickOverlay && close()"
      ></div>
      <div class="my-dialog-view" :style="{ width: getSizeString(width) }">
        <slot name="title"
          ><div v-if="title" class="my-dialog-title" v-text="title"></div
        ></slot>
        <slot>
          <div
            v-if="allowHtml"
            class="my-dialog-message"
            v-html="message"
          ></div>
          <div v-else class="my-dialog-message" v-text="message"></div
        ></slot>
        <div class="my-dialog-button-content">
          <div
            v-if="showCancelButton"
            class="my-dialog-button my-dialog-cancel"
            :style="{ color: cancelButtonColor }"
            v-text="cancelButtonText"
            @click="cancel()"
          ></div>
          <div
            v-if="showConfirmButton"
            class="my-dialog-button"
            :style="{ color: confirmButtonColor }"
            v-text="confirmButtonText"
            @click="confirm()"
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Model,
  Emit,
  Watch,
} from "vue-property-decorator";
import * as common from "./common";
@Component
export default class MyDialog extends Vue {
  /**
   * 是否显示弹窗
   */
  @Model("input", { type: Boolean })
  value!: boolean;
  /**
   * 通知父级修改
   */
  @Emit() // eslint-disable-next-line
  input(val: boolean) {
    // TODO:
  }
  /**
   * 监听show，当状态改变时根据lockScroll判断是否遮罩层滚动
   */
  @Watch("value")
  onValueChanged(newVal: boolean) {
    if (!this.lockScroll) {
      return;
    }
    if (newVal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }
  /**
   * 标题
   */
  @Prop()
  title!: string;
  /**
   * 弹窗宽度，默认单位为 px
   */
  @Prop({ type: [Number, String], default: "18rem" })
  width!: number | string;
  /**
   * 文本内容，支持通过 \n 换行
   */
  @Prop()
  message!: string;
  /**
   * 内容对齐方式，可选值为 left right
   */
  @Prop({ default: "center" })
  messageAlign!: string;
  /**
   * 自定义类名
   */
  @Prop()
  className!: string;
  /**
   * 是否展示确认按钮
   */
  @Prop({ type: Boolean, default: true })
  showConfirmButton!: boolean;
  /**
   * 是否展示取消按钮
   */
  @Prop({ type: Boolean, default: false })
  showCancelButton!: boolean;
  /**
   * 确认按钮文案
   */
  @Prop({ default: "确认" })
  confirmButtonText!: string;
  /**
   * 确认按钮颜色
   */
  @Prop({ default: "#ee0a24" })
  confirmButtonColor!: string;
  /**
   * 取消按钮文案
   */
  @Prop({ default: "取消" })
  cancelButtonText!: string;
  /**
   * 取消按钮颜色
   */
  @Prop({ default: "black" })
  cancelButtonColor!: string;
  /**
   * 是否展示遮罩层
   */
  @Prop({ type: Boolean, default: true })
  overlay!: boolean;
  /**
   * 自定义遮罩层类名
   */
  @Prop()
  overlayClass!: string;
  /**
   * 自定义遮罩层样式
   */
  @Prop()
  overlayStyle!: object;
  /**
   * 是否在页面回退时自动关闭
   */
  @Prop({ type: Boolean, default: true })
  closeOnPopstate!: boolean;
  /**
   * 是否在点击遮罩层后关闭弹窗
   */
  @Prop({ type: Boolean })
  closeOnClickOverlay!: boolean;
  /**
   * 是否锁定背景滚动
   */
  @Prop({ type: Boolean, default: true })
  lockScroll!: boolean;
  /**
   * 是否允许message内容中渲染HTML
   */
  @Prop({ type: Boolean, default: true })
  allowHtml!: boolean;
  /**
   * 关闭前的回调函数
   */
  @Prop({ type: Function })
  beforeClose!: () => boolean;
  /**
   * 动画类名，等价于 transition 的 name 属性
   */
  @Prop()
  transition!: string;
  /**
   * 点击确认按钮时触发
   */
  @Emit()
  confirm() {
    // TODO:
    this.close();
  }
  /**
   * 点击取消按钮时触发
   */
  @Emit()
  cancel() {
    // TODO:
    this.close();
  }
  /**
   * 打开弹窗时触发
   */
  @Emit()
  open() {
    // TODO:
  }
  /**
   * 关闭弹窗时触发
   */
  @Emit()
  close() {
    // TODO:
    if (!this.beforeClose.call(this)) {
      return;
    }
    this.input(false);
  }
  /**
   * 打开弹窗并且动画结束后触发
   */
  @Emit()
  opened() {
    // TODO:
  }
  /**
   * 关闭弹窗且动画结束后触发
   */
  @Emit()
  closed() {
    // TODO:
  }
  getSizeString = common.getSizeString;
}
</script>

<style>
.my-dialog {
  line-height: normal;
}
.my-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: auto;
  z-index: 1;
}
.my-dialog-view {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: #ffffff;
  border-radius: 1rem;
}
.my-dialog-title {
  padding-top: 1.625rem;
  font-weight: 500;
  line-height: 1.5rem;
  text-align: center;
}
.my-dialog-message {
  line-height: 1.25rem;
  padding: 1.625rem 1.5rem;
  white-space: pre-wrap;
  text-align: center;
  max-height: 60vh;
  font-size: 0.875rem;
  overflow-y: auto;
}
.my-dialog-button-content {
  display: flex;
}
.my-dialog-button-content::before {
  position: absolute;
  content: " ";
  box-sizing: border-box;
  width: 100%;
  height: 1px;
  left: 0;
  border-top: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.my-dialog-button {
  position: relative;
  width: 100%;
  height: 3rem;
  margin: 0;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-dialog-cancel::after {
  position: absolute;
  content: " ";
  box-sizing: border-box;
  height: 100%;
  width: 1px;
  right: 0;
  top: 0;
  border-right: 1px solid #ebedf0;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}
</style>