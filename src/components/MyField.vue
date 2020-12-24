<template>
  <div class="my-field">
    <slot name="left-icon"
      ><my-icon
        v-if="leftIcon"
        :name="leftIcon"
        :class-prefix="iconPrefix"
      ></my-icon
    ></slot>
    <slot name="label"><label v-text="label"></label></slot>
    <slot
      ><input
        v-model="value"
        :name="name"
        :type="type"
        :pattern="pattern"
        :disabled="disabled"
        :required="required"
        :maxlength="maxlength"
        :readonly="readonly"
        :placeholder="placeholder"
    /></slot>
    <slot name="right-icon"
      ><my-icon
        v-if="rightIcon"
        :name="rightIcon"
        :class-prefix="iconPrefix"
      ></my-icon
    ></slot>
    <slot name="button"></slot>
    <slot name="extra"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit } from "vue-property-decorator";
import { Rule } from "./rule";
import MyIcon from "./MyIcon.vue";
@Component({
  components: {
    "my-icon": MyIcon,
  },
})
export default class MyField extends Vue {
  /**
   * 当前输入的值
   */
  @Model("input", { type: [Number, String] })
  value!: number | string;
  /**
   * 输入框左侧文本
   */
  @Prop()
  label!: string;
  /**
   * 名称，提交表单的标识符
   */
  @Prop()
  name!: string;
  /**
   * 输入框类型, 可选值为 tel digit number textarea password 等
   */
  @Prop({ default: "text" })
  type!: string;
  /**
   * 大小，可选值为 large
   */
  @Prop()
  size!: string;
  /**
   * 输入的最大字符数
   */
  @Prop()
  maxlength!: number | string;
  /**
   * 输入框占位提示文字
   */
  @Prop()
  placeholder!: string;
  /**
   * 是否显示内边框
   */
  @Prop({ type: Boolean, default: true })
  border!: boolean;
  /**
   * 是否禁用输入框
   */
  @Prop({ type: Boolean })
  disabled!: boolean;
  /**
   * 是否只读
   */
  @Prop({ type: Boolean })
  readonly!: boolean;
  /**
   * 是否在 label 后面添加冒号
   */
  @Prop({ type: Boolean })
  colon!: boolean;
  /**
   * 是否显示表单必填星号
   */
  @Prop({ type: Boolean })
  required!: boolean;
  /**
   * 是否使内容垂直居中
   */
  @Prop({ type: Boolean })
  center!: boolean;
  /**
   * 是否启用清除图标，点击清除图标后会清空输入框
   */
  @Prop({ type: Boolean })
  clearable!: boolean;
  /**
   * 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示
   */
  @Prop()
  clearTrigger!: string;
  /**
   * 是否开启点击反馈
   */
  @Prop({ type: Boolean })
  clickable!: boolean;
  /**
   * 是否展示右侧箭头并开启点击反馈
   */
  @Prop({ type: Boolean })
  isLink!: boolean;
  /**
   * 是否自动聚焦，iOS 系统不支持该属性
   */
  @Prop({ type: Boolean })
  autofocus!: boolean;
  /**
   * 是否显示字数统计，需要设置maxlength属性
   */
  @Prop({ type: Boolean })
  showWordLimit!: boolean;
  /**
   * 是否将输入内容标红
   */
  @Prop({ type: Boolean })
  error!: boolean;
  /**
   * 底部错误提示文案，为空时不展示
   */
  @Prop()
  errorMessage!: string;
  /**
   * 输入内容格式化函数
   */
  @Prop({ type: Function })
  formatter!: Function;
  /**
   * 格式化函数触发的时机，可选值为 onBlur
   */
  @Prop()
  formatTrigger!: string;
  /**
   * 箭头方向，可选值为 left up down
   */
  @Prop({ default: "right" })
  arrowDirection!: string;
  /**
   * 左侧文本额外类名
   */
  @Prop()
  labelClass!: string;
  /**
   * 左侧文本宽度，默认单位为px
   */
  @Prop({ type: [Number, String], default: "6.2em" })
  labelWidth!: number | string;
  /**
   * 左侧文本对齐方式，可选值为 center right
   */
  @Prop({ default: "left" })
  labelAlign!: string;
  /**
   * 输入框对齐方式，可选值为 center right
   */
  @Prop({ default: "left" })
  inputAlign!: string;
  /**
   * 错误提示文案对齐方式，可选值为 center right
   */
  @Prop({ default: "left" })
  errorMessageAlign!: string;
  /**
   * 是否自适应内容高度，只对 textarea 有效，可传入对象,如 { maxHeight: 100, minHeight: 50 }，单位为px
   */
  @Prop({ type: [Boolean, Object], default: false })
  autosize!: boolean | object;
  /**
   * 左侧图标名称或图片链接
   */
  @Prop()
  leftIcon!: string;
  /**
   * 右侧图标名称或图片链接
   */
  @Prop()
  rightIcon!: string;
  /**
   * 图标类名前缀，同 Icon 组件的 class-prefix 属性
   */
  @Prop({ default: "fa" })
  iconPrefix!: string;
  /**
   * 表单校验规则
   */
  @Prop({ type: Array })
  rules!: Rule[];
}
</script>

<style scoped>
</style>