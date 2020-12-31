<template>
  <div
    class="my-field"
    :style="{ 'font-size': size === 'large' ? '1rem' : '0.8rem' }"
  >
    <slot name="left-icon"
      ><my-icon
        v-if="leftIcon"
        :name="leftIcon"
        :class-prefix="iconPrefix"
        style="margin-right: 0.5rem"
      ></my-icon
    ></slot>
    <slot name="label"
      ><label
        v-text="label"
        :class="[
          'my-field-label',
          labelClass,
          { 'my-field-disabled': disabled },
          { 'my-field-required': required },
          { 'my-field-label-colon': colon },
        ]"
        :style="{ width: getSizeString(labelWidth), 'text-align': labelAlign }"
      ></label
    ></slot>
    <slot
      ><div class="my-field-input-area">
        <my-tag
          :tag="type == 'textarea' ? 'textarea' : 'input'"
          v-model="inner"
          :name="name"
          :type="type"
          :disabled="disabled"
          :maxlength="maxlength"
          :readonly="readonly"
          :placeholder="placeholder"
          :class="[
            'my-field-input',
            { 'my-field-disabled': disabled },
            { 'my-field-input-error': error },
          ]"
          :style="{
            'text-align': inputAlign,
          }"
          @input="inputChange($event)"
          @blur="inputBlur"
        />
        <div
          class="my-field-error-message"
          v-if="errorMessage"
          v-text="errorMessage"
        ></div>
        <div
          class="my-field-word-statistics"
          v-if="showWordLimit && maxlength"
          v-text="wordStatistic + '/' + maxlength"
        ></div></div
    ></slot>
    <slot name="right-icon"
      ><my-icon
        v-if="rightIcon"
        :name="rightIcon"
        :class-prefix="iconPrefix"
        style="margin-right: -0.5rem; padding: 0 0.5rem"
      ></my-icon
    ></slot>
    <slot name="button"></slot>
    <slot name="extra"></slot>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Model,
  Emit,
  Watch,
} from "vue-property-decorator";
import { Rule } from "./rule";
import MyIcon from "./MyIcon.vue";
import MyTag from "./MyTag.vue";
import * as Common from "./common";
@Component({
  components: {
    "my-icon": MyIcon,
    "my-tag": MyTag,
  },
})
export default class MyField extends Vue {
  /**
   * 当前输入的值
   */
  @Model("input", { type: [Number, String] })
  value!: number | string;
  /**
   * 内部value
   */
  inner: number | string = "";
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
  @Prop({ default: "onChange" })
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
  @Prop({ type: [Number, String], default: "5.4rem" })
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
  @Prop({ default: "icofont" })
  iconPrefix!: string;
  /**
   * 表单校验规则
   */
  @Prop({ type: Array })
  rules!: Rule[];
  /**
   * 通知父级value变化
   */
  @Emit() // eslint-disable-next-line
  input(value: number | string) {
    // TODO:
  }
  /**
   * 字数统计
   */
  wordStatistic = 0;
  /**
   * 父级传入value时，修改内部value
   */
  @Watch("value", { immediate: true })
  onValueChanged(newVal: number | string) {
    this.inner = newVal;
  }
  /**
   * 内部value改变时通知父级
   */
  @Watch("inner")
  onInnerChanged(newVal: number | string) {
    this.wordStatistic = newVal?.toString()?.length ?? 0;
    if (newVal != this.value) {
      this.input(newVal);
    }
  }
  /**
   * 获取长度等大小的字符串形式，单位默认为px
   */
  getSizeString = Common.getSizeString;
  /**
   * input内容变更时触发formatter
   */
  inputChange(event: Event) {
    if (this.type == "textarea") {
      this.inputKeyUp(event);
    }
    if (
      (this.formatTrigger && this.formatTrigger.toLowerCase() == "onblur") ||
      !this.formatter
    ) {
      return;
    }
    this.inner = this.formatter.call(this, this.inner);
  }
  /**
   * input失去焦点时触发formatter
   */
  inputBlur() {
    if (!this.formatter) {
      return;
    }
    if (this.formatTrigger && this.formatTrigger.toLowerCase() == "onblur") {
      this.inner = this.formatter.call(this, this.inner);
    }
  }
  /**
   * 当按键按下后，textarea自适应高度
   */
  inputKeyUp(event: Event) {
    if (typeof this.autosize === "boolean") {
      if (this.autosize) {
        const inputElement = event.target as HTMLElement;
        inputElement.style.height = "inherit";
        inputElement.style.height = `${inputElement.scrollHeight}px`;
      }
    } else {
      // TODO:
    }
  }
}
</script>

<style scoped>
.my-field {
  line-height: normal;
  width: 100%;
  display: flex;
  padding: 0.6125rem 1rem;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
  color: #646566;
  flex: 1;
  -webkit-box-flex: 1;
}
.my-field-label {
  display: flex;
  flex: none;
  -webkit-box-flex: 0;
  margin-right: 0.75rem;
}
.my-field-required::before {
  content: "*";
  color: #ee0a24;
  position: absolute;
  left: 0.5rem;
}
.my-field-disabled {
  color: #c8c9cc;
}
.my-field-input-area {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
}
.my-field-input {
  border: 0;
  box-sizing: border-box;
  width: 100%;
  resize: none;
  overflow: hidden;
}
.my-field-input[disabled] {
  background-color: inherit;
}
.my-field-input::placeholder {
  color: #c8c9cc;
}
.my-field-input-error {
  color: #ee0a24;
}
.my-field-input-error::placeholder {
  color: #ee0a24;
}
.my-field-error-message {
  color: #ee0a24;
  font-size: 0.75rem;
  text-align: left;
  padding: 0.06125rem 0.125rem;
}
.my-field-word-statistics {
  width: 100%;
  text-align: right;
}
.my-field-label-colon::after {
  content: ":";
  display: flex;
  align-items: center;
}
</style>