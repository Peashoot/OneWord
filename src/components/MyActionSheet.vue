<template>
  <div class="my-action-sheet">
    <div class="my-action-sheet-view">
      <slot name="description"><div class="my-action-sheet-description" v-text="description"></div></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model, Emit } from "vue-property-decorator";
import MyOverlay from "./MyOverlay.vue";
@Component({
  components: {
    "my-overlay": MyOverlay,
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
  @Prop({ type: Array, default: [] })
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
  @Prop({ default: "cross" })
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
   * 是否在显示弹层时才渲染节点
   */
  @Prop({ type: Boolean, default: true })
  lazyRender!: boolean;
  /**
   * 是否在页面回退时自动关闭
   */
  @Prop({ type: Boolean })
  closeOnPopstate!: boolean;
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
   * 指定挂载的节点，用法示例
   */
  @Prop({ type: [String, Function] })
  getContainer!: string | LoadElement;
  /**
   * 通知value变化给父级
   */
  @Emit()
  input(val: boolean) {
    // TODO:
  }
  /**
   * 点击选项时触发，禁用或加载状态下不会触发
   */
  @Emit()
  select(action: Action, index: number) {
    // TODO:
  }
  /**
   * 点击取消按钮时触发
   */
  @Emit()
  cancel() {
    // TODO:
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
  className?: any;
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
  line-height: normal;
  width: 100%;
}
.my-action-sheet-view {
  position: absolute;
  bottom: 0;
}
.my-action-sheet-description {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3rem;
}
</style>