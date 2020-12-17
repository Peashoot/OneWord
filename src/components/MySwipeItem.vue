<template>
  <div
    class="my-swipe-item"
    :style="{ width: width, height: height }"
    @click="click($event)"
    v-if="show"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import MySwipe from "./MySwipe.vue";
@Component
export default class MySwipeItem extends Vue {
  /**
   * 是否加载
   */
  show!: boolean;
  /**
   * 点击时触发
   */
  @Emit() // eslint-disable-next-line
  click(event: MouseEvent) {
    // TODO: click
  }
  /**
   * 创建时根据父节点判断是否渲染
   */
  created() {
    this.show = true;
    if (this.$parent as MySwipe) {
      const parent = this.$parent as MySwipe;
      if (parent.lazyRender) {
        this.show = false;
      }
    }
  }
  /**
   * 宽度
   */
  get width() {
    let de: number | string = this.$parent.$el.clientWidth;
    if (this.$parent as MySwipe) {
      const parent = this.$parent as MySwipe;
      if (!parent.loop && !parent.vertical) {
        de = parent.width;
      }
    }
    try {
      const deVal = parseInt(de.toString());
      de = deVal + "px";
    } catch (error) {
      // TODO: nothing
    }
    return de;
  }
  /**
   * 高度
   */
  get height() {
    let de: number | string = this.$parent.$el.clientHeight;
    if (this.$parent as MySwipe) {
      const parent = this.$parent as MySwipe;
      if (!parent.loop && parent.vertical) {
        de = parent.height;
      }
    }
    try {
      const deVal = parseInt(de.toString());
      de = deVal + "px";
    } catch (error) {
      // TODO: nothing
    }
    return de;
  }
}
</script>

<style scoped>
.my-swipe-item {
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
}
</style>