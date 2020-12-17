<template>
  <div class="my-swipe">
    <div
      :class="[
        'my-swipe-container',
        vertical ? 'my-swipe-vertical' : 'my-swipe-horizontal',
      ]"
      :style="{ 'transition-duration': duration + 'ms' }"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd($event)"
      @mousedown="mouseDown($event)"
      @mousemove="mouseMove($event)"
      @mouseup="mouseUp($event)"
      ref="container"
    >
      <slot></slot>
    </div>
    <slot name="indicator"><div class="my-swipe-indicator"></div></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Ref, Watch } from "vue-property-decorator";
import MySwipeItem from "./MySwipeItem.vue";
@Component
export default class MySwipe extends Vue {
  /**
   * 自动轮播间隔，单位为 ms
   */
  @Prop({ type: [Number, String] })
  autoplay!: number | string;
  /**
   * 动画时长，单位为 ms
   */
  @Prop({ type: [Number, String], default: 500 })
  duration!: number | string;
  /**
   * 初始位置索引值
   */
  @Prop({ type: Number })
  initialSwipe!: number;
  /**
   * 滑块宽度，单位为px
   */
  @Prop({ type: [Number, String], default: "auto" })
  width!: number | string;
  /**
   * 滑块高度，单位为px
   */
  @Prop({ type: [Number, String], default: "auto" })
  height!: number | string;
  /**
   * 是否开启循环播放
   */
  @Prop({ type: Boolean, default: true })
  loop!: boolean;
  /**
   * 是否显示指示器
   */
  @Prop({ type: Boolean, default: true })
  showIndicators!: boolean;
  /**
   * 是否为纵向滚动
   */
  @Prop({ type: Boolean })
  vertical!: boolean;
  /**
   * 是否可以通过手势滑动
   */
  @Prop({ type: Boolean, default: true })
  touchable!: boolean;
  /**
   * 是否阻止滑动事件冒泡
   */
  @Prop({ type: Boolean, default: true })
  stopPropagation!: boolean;
  /**
   * 是否延迟渲染未展示的轮播
   */
  @Prop({ type: Boolean })
  lazyRender!: boolean;
  /**
   * 指示器颜色
   */
  @Prop({ default: "#1989fa" })
  indicatorColor!: string;
  /**
   * 每一页轮播结束后触发
   */
  @Emit() // eslint-disable-next-line
  change(index: number) {
    // TODO: after index changed
  }
  /**
   * 容器
   */
  @Ref()
  container!: HTMLElement;
  /**
   * 装载时重绘
   */
  mounted() {
    this.resize();
  }
  /**
   * 切换到上一轮播
   */
  prev() {
    // TODO: 切换到上一轮播
  }
  /**
   * 切换到下一轮播
   */
  next() {
    // TODO: 切换到下一轮播
  }
  /**
   * 切换到指定位置
   */
  swipeTo(index: number) {
    index %= this.$children.length;
    if (index < 0) {
      index += this.$children.length;
    }
    // TODO: 切换到指定位置
    if (index == this.curIndex) {
      return;
    }
    const step = index < this.curIndex ? 1 : -1;
    for (; index != this.curIndex; index += step) {
      // TODO: 什么也不做，只是为了让之间的这些元素能够被渲染
    }
    if (this.loop) {
      this.setElementTransform(
        this.container,
        -index * this.childWidth,
        -index * this.childHeight
      );
    } else {
      this.setElementTransform(
        this.container,
        Math.max(
          -index * this.childWidth,
          -this.$children.length * this.childWidth + this.$el.clientWidth
        ),
        Math.max(
          -index * this.childHeight,
          -this.$children.length * this.childHeight + this.$el.clientHeight
        )
      );
    }
  }
  /**
   * 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
   */
  resize() {
    // TODO: 重绘
  }
  /**
   * 子项个数
   */
  get childCount() {
    return this.container.children.length;
  }
  /**
   * 移动起始X轴
   */
  beginX = -1;
  /**
   * 移动起始Y轴
   */
  beginY = -1;
  /**
   * 超过该宽度时自动切换，否则重置
   */
  rate = 0.3;
  /**
   * 当前索引
   */
  curIndex = 0;
  /**
   * 索引变化时，对相邻元素进行渲染
   */
  @Watch("curIndex", { immediate: true })
  onCurIndexChanged(newVal: number) {
    this.showChild(this.$children[newVal]);
    this.showChild(
      this.$children[
        (newVal + 1 + this.$children.length) % this.$children.length
      ]
    );
    this.showChild(
      this.$children[
        (newVal - 1 + this.$children.length) % this.$children.length
      ]
    );
  }
  /**
   * 渲染子元素
   */
  showChild(child: Vue) {
    if (child && (child as MySwipeItem)) {
      (child as MySwipeItem).show = true;
    }
  }
  /**
   * 子元素宽度
   */
  get childWidth() {
    return (this.container.firstElementChild as HTMLElement)?.offsetWidth;
  }
  /**
   * 子元素高度
   */
  get childHeight() {
    return (this.container.firstElementChild as HTMLElement).offsetHeight;
  }
  /**
   * 获取自动完成滑动的分界值
   */
  get completeDemarcation() {
    return this.rate * (this.vertical ? this.childHeight : this.childWidth);
  }
  /**
   * 最大偏移量
   */
  get maximumOffset() {
    return Math.max(
      0,
      this.vertical
        ? this.$children.length * this.childHeight
        : this.$children.length * this.childWidth
    );
  }
  /**
   * 事件预处理
   */
  eventPrehandle(event: Event) {
    if (this.stopPropagation) {
      event.stopPropagation();
    }
    return this.touchable;
  }
  /**
   * 开始滑动-移动端事件
   */
  touchStart(event: TouchEvent) {
    if (!this.eventPrehandle(event)) {
      return;
    }
    this.beforeSwipe(event.touches[0].clientX, event.touches[0].clientY);
  }
  /**
   * 开始滑动-桌面端事件
   */
  mouseDown(event: MouseEvent) {
    if (!this.eventPrehandle(event)) {
      return;
    }
    this.beforeSwipe(event.clientX, event.clientY);
  }
  /**
   * 开始滑动
   */
  beforeSwipe(beginX: number, beginY: number) {
    this.beginX = beginX;
    this.beginY = beginY;
    this.container.style.transitionProperty = "none";
  }
  /**
   * 滑动-移动端事件
   */
  touchMove(event: TouchEvent) {
    if (!this.eventPrehandle(event)) {
      return;
    }
    const distX = event.changedTouches[0].clientX - this.beginX;
    const distY = event.changedTouches[0].clientY - this.beginY;
    this.swiping(distX, distY);
  }
  /**
   * 滑动-桌面端事件
   */
  mouseMove(event: MouseEvent) {
    if (!this.eventPrehandle(event)) {
      return;
    }
    if (this.beginX < 0 && this.beginY < 0) {
      return;
    }
    const distX = event.clientX - this.beginX;
    const distY = event.clientY - this.beginY;
    this.swiping(distX, distY);
  }
  /**
   * 滑动
   */
  swiping(distX: number, distY: number) {
    const compareDist = this.vertical ? distY : distX;
    this.removeTransform(this.container.firstElementChild);
    this.removeTransform(this.container.lastElementChild);
    if (this.loop) {
      if (this.curIndex == this.childCount - 1 && compareDist < 0) {
        // 当元素是最右边的元素时，还要向右滑动，最左边的元素偏移到最右边
        this.setElementTransform(
          this.container.firstElementChild,
          this.childCount * this.childWidth,
          this.childCount * this.childHeight
        );
      } else if (this.curIndex == 0 && compareDist > 0) {
        // 当元素是最左边的元素时，还要向左滑动，最右边的元素偏移到最左边
        this.setElementTransform(
          this.container.lastElementChild,
          -this.childCount * this.childWidth,
          -this.childCount * this.childHeight
        );
      }
    } else if (
      (this.curIndex == 0 && compareDist >= 0) ||
      (this.curIndex == this.childCount - 1 && compareDist <= 0)
    ) {
      return;
    }
    if (this.loop) {
      this.setElementTransform(
        this.container,
        distX - this.childWidth * this.curIndex,
        distY - this.childHeight * this.curIndex
      );
    } else {
      this.setElementTransform(
        this.container,
        Math.max(
          distX - this.childWidth * this.curIndex,
          -this.childWidth * this.$children.length + this.$el.clientWidth
        ),
        Math.max(
          distY - this.childHeight * this.curIndex,
          -this.childHeight * this.$children.length + this.$el.clientHeight
        )
      );
    }
  }
  /**
   * 滑动后-移动端事件
   */
  touchEnd(event: TouchEvent) {
    if (!this.eventPrehandle(event)) {
      return;
    }
    if (!this.touchable) {
      return;
    }
    const distX = event.changedTouches[0].clientX - this.beginX;
    const distY = event.changedTouches[0].clientY - this.beginY;
    this.afterSwipe(distX, distY);
  }
  /**
   * 滑动后-桌面端事件
   */
  mouseUp(event: MouseEvent) {
    if (!this.eventPrehandle(event)) {
      return;
    }
    if (this.beginX < 0 && this.beginY < 0) {
      return;
    }
    const distX = event.clientX - this.beginX;
    const distY = event.clientY - this.beginY;
    this.afterSwipe(distX, distY);
  }
  /**
   * 滑动后
   */
  afterSwipe(distX: number, distY: number) {
    this.beginX = -1;
    this.beginY = -1;
    this.container.style.transitionProperty = "transform";
    const compareDist = this.vertical ? distY : distX;
    // 如果非循环，最左边和最右边不需要处理
    if (
      !this.loop &&
      ((this.curIndex == 0 && compareDist >= 0) ||
        (this.curIndex == this.childCount - 1 && compareDist <= 0))
    ) {
      return;
    }
    let tempIndex = this.curIndex;
    if (Math.abs(compareDist) > this.completeDemarcation) {
      // TODO: 继续完成滑动
      tempIndex += compareDist > 0 ? -1 : 1;
    }
    if (this.loop) {
      this.setElementTransform(
        this.container,
        -this.childWidth * tempIndex,
        -this.childHeight * tempIndex
      );
      setTimeout(() => {
        this.container.style.transitionProperty = "none";
        // 当最右边的元素补到左边后，滑动完后整体向左滑动childCount- 1个距离
        if (tempIndex == -1) {
          this.setElementTransform(
            this.container,
            -this.childWidth * (this.childCount - 1),
            -this.childHeight * (this.childCount - 1)
          );
          tempIndex = this.childCount - 1;
        } else if (tempIndex == this.childCount) {
          // 当最左边的元素补到右边后，修改整体偏移为0
          this.container.style.removeProperty("transform");
          tempIndex = 0;
        }
        // 清空原本设置的子元素偏移量
        this.removeTransform(this.container.firstElementChild);
        this.removeTransform(this.container.lastElementChild);
        this.curIndex = tempIndex;
      }, parseInt(this.duration.toString()));
    } else {
      this.setElementTransform(
        this.container,
        Math.max(
          -this.childWidth * tempIndex,
          -this.childWidth * this.$children.length + this.$el.clientWidth
        ),
        Math.max(
          -this.childHeight * tempIndex,
          -this.childHeight * this.$children.length + this.$el.clientHeight
        )
      );
      this.curIndex = tempIndex;
    }
  }
  /**
   * 移除样式
   */
  removeTransform(element: Element | null) {
    if (!element || !(element as HTMLElement)) {
      return;
    }
    (element as HTMLElement).style.removeProperty("transform");
  }
  /**
   * 设置元素偏移
   */
  setElementTransform(element: Element | null, x: number, y: number) {
    if (!element || !(element as HTMLElement)) {
      return;
    }
    if ((!this.vertical && x == 0) || (this.vertical && y == 0)) {
      this.removeTransform(element);
    } else {
      (element as HTMLElement).style.transform =
        "translate(" +
        (this.vertical ? 0 : x) +
        "px," +
        (this.vertical ? y : 0) +
        "px)";
    }
  }
}
</script>
<style scoped>
.my-swipe {
  position: relative;
  overflow: hidden;
}
.my-swipe-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
}
.my-swipe-horizontal {
  flex-direction: row;
}
.my-swipe-vertical {
  flex-direction: column;
}
.my-swipe-indicator {
  position: absolute;
}
</style>