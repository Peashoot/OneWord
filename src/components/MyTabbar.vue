<template>
  <div class="my-tabbar">
    <div :class="{ 'my-tabbar-fixed': fixed }" :style="{ 'z-index': zIndex }">
      <div
        :class="[
          'my-tabbar-container',
          'my-tabbar-height',
          { 'my-tabbar-border': border },
        ]"
      >
        <slot></slot>
      </div>
      <div v-if="safeAreaInsetBottom" class="my-tabbar-safe-area"></div>
    </div>
    <div
      v-if="placeholder && safeAreaInsetBottom"
      class="my-tabbar-safe-area"
    ></div>
    <div v-if="placeholder" class="my-tabbar-height"></div>
  </div>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import MyTabbarItem from "./MyTabbarItem.vue";
@Component
export default class MyTabbar extends Vue {
  /**
   * 当前选中标签的名称或索引值
   */
  @Prop({ default: 0 })
  value!: number | string;
  /**
   * 是否固定在底部
   */
  @Prop({ type: Boolean, default: true })
  fixed!: boolean;
  /**
   * 是否显示外边框
   */
  @Prop({ type: Boolean, default: true })
  border!: boolean;
  /**
   * 元素 z-index
   */
  @Prop({ type: [Number, String], default: 1 })
  zIndex!: number | string;
  /**
   * 选中标签的颜色
   */
  @Prop({ default: "#1989fa" })
  activeColor!: string;
  /**
   * 未选中标签的颜色
   */
  @Prop({ default: "#7d7e80" })
  inactiveColor!: string;
  /**
   * 是否开启路由模式
   */
  @Prop({ type: Boolean })
  route!: boolean;
  /**
   * 固定在底部时，是否在标签位置生成一个等高的占位元素
   */
  @Prop({ type: Boolean })
  placeholder!: boolean;
  /**
   * 是否开启底部安全区适配，设置 fixed 时默认开启
   */
  @Prop({ type: Boolean })
  safeAreaInsetBottom!: boolean;
  /**
   * 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise
   * (name) => boolean | Promise
   */
  @Prop()
  beforeChange!: Function | Promise<boolean>;
  /**
   * 切换标签时触发
   */
  @Emit() // eslint-disable-next-line
  change(active: number | string) {
    // TODO: change
  }
  /**
   * 内部值
   */
  innerValue = this.value;
  /**
   * 装载时选中激活的子组件
   */
  mounted() {
    this.setActiveItem();
  }
  /**
   * Value改变时修改内部变量
   */
  @Watch("value")
  onValueChanged(newVal: string | number) {
    this.innerValue = newVal;
  }
  /**
   * value改变或者子组件发生变化时需重新选中子组件
   */
  @Watch("innerValue")
  @Watch("children")
  setActiveItem() {
    const _this = this;
    this.$children.forEach(function (item, index) {
      const tabbarItem = item as MyTabbarItem;
      if (!tabbarItem) {
        return;
      }
      tabbarItem.index = index;
      tabbarItem.active = (tabbarItem.name || index) === _this.innerValue;
    });
    this.change(this.innerValue);
  }
}
</script>
<style scoped>
.my-tabbar-container {
  line-height: normal;
  position: relative;
  width: 100%;
  bottom: 0;
  display: flex;
  box-sizing: content-box;
  background-color: #fff;
}
.my-tabbar-height {
  height: 3.5rem;
}
.my-tabbar-fixed {
  position: fixed;
  width: 100%;
  bottom: 0;
}
.my-tabbar-border {
  border-width: 0.0625rem 0 0 0;
  border-style: solid;
  border-color: #000;
}
.my-tabbar-safe-area {
  height: 0.5rem;
  background-color: #fff;
}
</style>