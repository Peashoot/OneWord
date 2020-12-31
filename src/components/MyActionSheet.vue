<template>
  <div class="my-action-sheet">
    <my-tag
      :tag="overlay ? 'my-overlay' : 'div'"
      :show="value"
      :duration="duration"
      :lock-scroll="lockScroll"
      @click="overlay && clickOverlay()"
    >
      <div
        :class="[
          'my-action-sheet-view',
          { 'my-action-sheet-view-round': round },
        ]"
        :style="{
          'transition-duration': duration + 's',
        }"
        ref="view"
      >
        <div v-if="title" class="my-action-sheet-head">
          <div class="my-action-sheet-title" v-text="title"></div>
          <my-icon
            v-if="closeable"
            :name="closeIcon"
            class="my-action-sheet-close"
            @click="close()"
          ></my-icon>
        </div>
        <slot name="description"
          ><div class="my-action-sheet-description" v-text="description"></div
        ></slot>
        <slot
          ><div
            v-for="(item, index) in actions"
            :key="index"
            :style="{
              color: !item.color
                ? item.disabled
                  ? '#c8c9cc'
                  : '#000'
                : item.color,
            }"
            @click="item.disabled || item.loading || select(item, index)"
            :class="[
              'my-action-sheet-action',
              item.class,
              { 'my-action-sheet-loading': item.loading },
            ]"
          >
            <div
              class="my-action-sheet-action-item"
              v-text="item.name"
              v-if="!item.loading"
            ></div>
            <div
              v-if="item.subname && !item.loading"
              class="my-action-sheet-action-item my-action-sheet-action-desc"
              v-text="item.subname"
            ></div>
            <div v-if="item.loading" class="my-action-sheet-action-item">
              <my-icon name="spinner"></my-icon>
            </div>
          </div>
          <div class="my-action-sheet-cancel" v-if="cancelText">
            <div class="my-action-sheet-cancel-gap"></div>
            <div
              class="my-action-sheet-action"
              v-text="cancelText"
              @click="cancel"
            ></div></div
        ></slot>
        <div
          class="my-action-sheet-safe-area"
          v-if="safeAreaInsetBottom"
        ></div></div
    ></my-tag>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Model,
  Emit,
  Ref,
  Watch,
} from "vue-property-decorator";
import MyOverlay from "./MyOverlay.vue";
import MyIcon from "./MyIcon.vue";
import MyTag from "./MyTag.vue";
@Component({
  components: {
    "my-overlay": MyOverlay,
    "my-icon": MyIcon,
    "my-tag": MyTag,
  },
})
export default class MyActionSheet extends Vue {
  /**
   * 是否显示动作面板
   */
  @Model("input", { type: Boolean })
  value!: boolean;
  /**
   * 面板选项列表
   */
  @Prop({ type: Array, default: () => [] })
  actions!: Action[];
  /**
   * 顶部标题
   */
  @Prop()
  title!: string;
  /**
   * 取消按钮文字
   */
  @Prop()
  cancelText!: string;
  /**
   * 选项上方的描述信息
   */
  @Prop()
  description!: string;
  /**
   * 是否显示关闭图标
   */
  @Prop({ type: Boolean, default: true })
  closeable!: boolean;
  /**
   * 关闭图标名称或图片链接
   */
  @Prop({ default: "close" })
  closeIcon!: string;
  /**
   * 动画时长，单位秒
   */
  @Prop({ type: [Number, String], default: 0.3 })
  duration!: number | string;
  /**
   * 是否显示圆角
   */
  @Prop({ type: Boolean, default: true })
  round!: boolean;
  /**
   * 是否显示遮罩层
   */
  @Prop({ type: Boolean, default: true })
  overlay!: boolean;
  /**
   * 是否锁定背景滚动
   */
  @Prop({ type: Boolean, default: true })
  lockScroll!: boolean;
  /**
   * 是否在点击选项后关闭
   */
  @Prop({ type: Boolean })
  closeOnClickAction!: boolean;
  /**
   * 是否在点击遮罩层后关闭
   */
  @Prop({ type: Boolean, default: true })
  closeOnClickOverlay!: boolean;
  /**
   * 是否开启底部安全区适配
   */
  @Prop({ type: Boolean, default: true })
  safeAreaInsetBottom!: boolean;
  /**
   * 可见视图组件
   */
  @Ref()
  view!: HTMLDivElement;
  @Watch("value", { immediate: true })
  onValueChanged(newVal: boolean, oldVal: boolean) {
    if (newVal && !oldVal) {
      this.open();
      setTimeout(() => (this.view.style.transform = "translateY(-100%)"), 1);
      setTimeout(
        () => this.opened(),
        parseFloat(this.duration.toString()) * 1000
      );
    }
    if (!newVal && oldVal) {
      this.view.style.removeProperty("transform");
      setTimeout(
        () => this.closed(),
        parseFloat(this.duration.toString()) * 1000
      );
    }
  }
  /**
   * 通知value变化给父级
   */
  @Emit() // eslint-disable-next-line
  input(val: boolean) {
    // TODO:
  }
  /**
   * 点击选项时触发，禁用或加载状态下不会触发
   */
  @Emit() // eslint-disable-next-line
  select(action: Action, index: number) {
    // TODO:
    if (this.closeOnClickAction) {
      this.close();
    }
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
   * 打开面板时触发
   */
  @Emit()
  open() {
    // TODO:
  }
  /**
   * 关闭面板时触发
   */
  @Emit()
  close() {
    // TODO:
    this.input(false);
  }
  /**
   * 打开面板且动画结束后触发
   */
  @Emit()
  opened() {
    // TODO:
  }
  /**
   * 关闭面板且动画结束后触发
   */
  @Emit()
  closed() {
    // TODO:
  }
  /**
   * 点击遮罩层时触发
   */
  @Emit()
  clickOverlay() {
    // TODO:
    if (this.closeOnClickOverlay) {
      this.close();
    }
  }
}
declare type LoadElement = () => Element;
interface Action {
  /**
   * 标题
   */
  name?: string;
  /**
   * 二级标题
   */
  subname?: string;
  /**
   * 选项文字颜色
   */
  color?: string;
  /**
   * 为对应列添加额外的class
   */
  className?: string | object;
  /**
   * 是否为加载状态
   */
  loading?: boolean;
  /**
   * 是否为禁用状态
   */
  disabled?: boolean;
}
</script>

<style scoped>
.my-action-sheet {
  position: absolute;
  line-height: normal;
  overflow: hidden;
}
.my-overlay {
  overflow: hidden;
}
.my-action-sheet-view {
  position: absolute;
  width: 100%;
  top: 100%;
  background-color: #ffffff;
  transition-property: transform;
  -moz-transition-property: transform; /* Firefox 4 */
  -webkit-transition-property: transform; /* Safari and Chrome */
  -o-transition-property: transform; /* Opera */
}
.my-action-sheet-view-round {
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
}
.my-action-sheet-head {
  position: relative;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-action-sheet-title {
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-action-sheet-close {
  position: absolute;
  right: 1rem;
}
.my-action-sheet-description {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  padding: 0.875rem;
  opacity: 50%;
}
.my-action-sheet-description::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 1rem;
  bottom: 0;
  left: 1rem;
  border-bottom: 0.0625rem solid #ebedf0;
}
.my-action-sheet-action {
  display: flex;
  flex-direction: column;
  padding: 0.875rem;
}
.my-action-sheet-action-desc {
  padding-top: 0.5rem;
  font-size: 0.7rem;
  opacity: 50%;
}
.my-action-sheet-cancel-gap {
  height: 0.5rem;
  background-color: #f7f8fa;
}
.my-action-sheet-safe-area {
  display: relative;
  height: 2rem;
}
</style>