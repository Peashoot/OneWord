<template>
  <div
    class="my-tabbar-item"
    :class="{ 'my-tabbar-item-active': active }"
    :style="{ color: color }"
    @click="itemClick"
  >
    <slot name="icon">
      <my-icon
        :name="icon"
        :class-prefix="iconPrefix"
        :dot="dot"
        :badge="badge"
      ></my-icon>
    </slot>
    <div class="my-tabbar-item-name"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Location } from "vue-router";
import MyIcon from "./MyIcon.vue";
import MyTabbar from "./MyTabbar.vue";
@Component({
  components: {
    "my-icon": MyIcon,
  },
})
export default class MyTabbarItem extends Vue {
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
  @Prop({ default: "fa" })
  iconPrefix!: string;
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
  /**
   * 是否激活
   */
  active = false;
  /**
   * 编号
   */
  index = 0;
  /**
   * 当前颜色
   */
  color = "#000";
  /**
   * 启动时加载颜色
   */
  mounted() {
    this.color = this.getItemColor();
  }
  /**
   * 获取当前元素的颜色
   */
  getItemColor() {
    const parent = this.$parent as MyTabbar;
    if (!parent) {
      return "#000";
    }
    const color = this.active ? parent.activeColor : parent.inactiveColor;
    return color;
  }
  /**
   * 激活状态变更时修改字体颜色
   */
  @Watch("active")
  onActiveChanged() {
    this.color = this.getItemColor();
  }
  /**
   * 元素点击
   */
  itemClick() {
    const parent = this.$parent as MyTabbar;
    if (!parent) {
      return;
    }
    if (parent["before-change"] as Function) {
      if ((parent["before-change"] as Function).call(this, this.name)) {
        this.clickEvent(parent);
      }
    } else if (parent["before-change"] as Promise<boolean>) {
      (parent["before-change"] as Promise<boolean>).then((result) => {
        if (result) {
          this.clickEvent(parent);
        }
      });
    } else {
      this.clickEvent(parent);
    }
  }
  /**
   * 项点击事件
   */
  clickEvent(parent: MyTabbar) {
    parent.innerValue = this.name || this.index;
    if (!parent.route) {
      return;
    }
    if (this.url != null) {
      this.$router.push({ path: this.url, replace: this.replace });
    } else if (typeof this.to === "string") {
      this.$router.push({ name: this.to, replace: this.replace });
    } else if (this.to as Location) {
      const loc = this.to as Location;
      loc.replace = this.replace;
      this.$router.push(loc);
    }
  }
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
  font-size: 0.75rem;
  padding: 0;
}
.my-icon {
  margin: 0.25rem 0;
}
</style>