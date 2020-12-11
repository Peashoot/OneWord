<template>
  <div class="my-tabbar-item">
    <slot name="icon">
      <div class="my-tabbar-item-icon">🤢</div>
    </slot>
    <div class="my-tabbar-item-name"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class MyTabbarItem extends Vue {
  /**
   * 显示的标签名称
   */
  value!: string;
  /**
   * 标签名称，作为匹配的标识符
   */
  @Prop({ type: [Number, String] })
  name!: number | string;
  /**
   * 图标名称或图片链接
   */
  @Prop()
  icon!: string;
  /**
   * 图标类名前缀
   */
  @Prop()
  "icon-prefix"!: string;
  /**
   * 是否显示图标右上角小红点
   */
  @Prop({ type: Boolean })
  dot!: boolean;
  /**
   * 图标右上角徽标的内容
   */
  @Prop({ type: [Number, String] })
  badge!: number | string;
  /**
   * 点击后跳转的链接地址
   */
  @Prop()
  url!: string;
  /**
   * 点击后跳转的目标路由对象，同 vue-router 的 to 属性
   */
  @Prop({ type: [String, Object] })
  to!: string | object;
  /**
   * 是否在跳转时替换当前页面历史
   */
  @Prop({ type: Boolean })
  replace!: boolean;
}
</script>

<style scoped>
.my-tabbar-item {
  display: flex;
  height: 100%;
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>