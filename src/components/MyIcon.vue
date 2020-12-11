<template>
  <div
    :class="[
      'my-icon',
      'my-icon-badge',
      { 'my-icon-dot': dot },
      classPrefix,
      isImage(name) ? '' : classPrefix + '-' + name,
    ]"
    @click="$emit('click', $event.target.value)"
    :style="{ 'font-size': size, color: color }"
  >
    <img v-if="isImage(name)" :src="name" />
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
@Component
export default class MyIcon extends Vue {
  /**
   * 图标名称或图片链接
   */
  @Prop()
  name!: string;
  /**
   * 是否显示图标右上角小红点
   */
  @Prop()
  dot!: boolean;
  /**
   * 图标右上角徽标的内容
   */
  @Prop()
  badge!: number | string;
  /**
   * 图标颜色
   */
  @Prop()
  color!: string;
  /**
   * 图标大小，如 20px 2em，默认单位为px
   */
  @Prop()
  size!: number | string;
  /**
   * 类名前缀，用于使用自定义图标
   */
  @Prop({ default: "fa" })
  "class-prefix"!: string;
  /**
   * HTML 标签
   */
  @Prop()
  tag!: string;
  /**
   * 点击图标时触发
   */
  @Model("click")
  click!: string;
  /**
   * 是否是图片路径
   */
  isImage(name: string) {
    return name && name.indexOf("/") > 0;
  }
}
/**
 * 内部图标
 */
interface InnerIcon {
  /**
   * 文本内容
   */
  content: string;
  /**
   * 图标名称
   */
  name: string;
  /**
   * 图标类别
   */
  prefix: string;
}
</script>

<style>
@import "../assets/css/font-awesome.min.css";
.my-icon {
  line-height: normal;
}
.my-icon-dot::after {
  content: "";
  position: absolute;
  width: 0.4rem;
  height: 0.4rem;
  display: inline-block;
  border-radius: 50%;
  background-color: red;
}

.my-icon-badge::after {
  content: "\00A0 99+\00A0";
  font-size: 0.7rem;
  height: 0.8rem;
  min-width: 0.8rem;
  width: fit-content;
  display: inline-block;
  border-radius: 0.4rem;
  background-color: red;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>