<template>
  <div
    :class="['my-icon']"
    @click="$emit('click', $event.target.value)"
    :style="{
      'font-size': /^\d+$/.test(size.toString()) ? size + 'px' : size,
      color: color,
    }"
  >
    <my-tag
      v-if="!isImage(name)"
      :tag="tag"
      :class="[classPrefix, isImage(name) ? '' : classPrefix + '-' + name]"
    ></my-tag>
    <img class="my-icon-image" v-if="isImage(name)" :src="name" />
    <div class="my-icon-dot my-icon-info" v-if="dot"></div>
    <div class="my-icon-badge my-icon-info" v-if="badge && badge != ''">
      {{ badge }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
import MyTag from "./MyTag.vue";
@Component({
  components: {
    "my-tag": MyTag,
  },
})
export default class MyIcon extends Vue {
  /**
   * 图标名称或图片链接
   */
  @Prop()
  name!: string;
  /**
   * 是否显示图标右上角小红点
   */
  @Prop({ type: Boolean })
  dot!: boolean;
  /**
   * 图标右上角徽标的内容
   */
  @Prop()
  badge!: number | string;
  /**
   * 图标颜色
   */
  @Prop({ default: "inherit" })
  color!: string;
  /**
   * 图标大小，如 20px 2em，默认单位为px
   */
  @Prop({ type: [Number, String], default: "1.3rem" })
  size!: number | string;
  /**
   * 类名前缀，用于使用自定义图标
   */
  @Prop({ default: "fa" })
  "class-prefix"!: string;
  /**
   * HTML 标签
   */
  @Prop({ default: "i" })
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
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.my-icon-tag {
  margin: 0 auto;
}
.my-icon-image {
  width: 100%;
  height: 100%;
}
.my-icon-info {
  position: absolute;
  top: 0;
  right: 0;
  -webkit-transform: translate(50%, -50%);
  transform: translate(50%, -50%);
  -webkit-transform-origin: 100%;
  transform-origin: 100%;
  background-color: red;
}
.my-icon-dot {
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
}
.my-icon-badge {
  font-size: 0.6rem;
  height: 0.8rem;
  min-width: 0.8rem;
  width: fit-content;
  border-radius: 0.4rem;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.my-icon-badge::before {
  content: "\00A0";
}
.my-icon-badge::after {
  content: "\00A0";
}
</style>