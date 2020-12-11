<template>
  <div class="my-swipe-container">
    <div
      class="my-swipe"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd($event)"
      @mousedown="mouseDown($event)"
      @mouseup="mouseUp($event)"
      @mousemove="mouseMove($event)"
    >
    <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class MySwipe extends Vue {
  @Prop()
  displayKey!: string;
  /**
   * 纵向滑动
   */
  @Prop()
  vertical!: boolean;
  /**
   * 当前索引
   */
  curIndex = 0;
  swipeItems = new Array<string>();
  mounted() {
    this.$nextTick(() => {
      console.log(this);
    });
  }
  /**
   * 开始滑动时
   */
  beginSwipe() {
    if (this.swipeItems.length < 2) {
      return;
    }
    const swipeItems = document.getElementsByClassName("my-swipe-item");
    const curItem = swipeItems[0] as HTMLElement;
    const leftItem = swipeItems[this.swipeItems.length - 1].cloneNode(
      true
    ) as HTMLElement;
    const swipeContainer = curItem.parentNode as Node;
    // 第一次移动时把最后一个元素复制一遍到最前面
    swipeContainer.insertBefore(leftItem, curItem);
    (swipeContainer as HTMLElement).style.transform =
      "translateX(" + -window.innerWidth + "px)";
  }
  /**
   * 超过该宽度时自动切换，否则重置
   */
  rate = 0.3;
  /**
   * 结束滑动
   */
  endSwipe(xdiff: number) {
    if (this.swipeItems.length < 2) {
      return;
    }
    if (xdiff == 0) {
      this.resetSwipe();
      return;
    }
    this.isAutoMove = true;
    if (this.rate * window.innerWidth < Math.abs(xdiff)) {
      const moveX =
        (window.innerWidth - Math.abs(xdiff)) * (xdiff > 0 ? 1 : -1);
      this.autoMove(moveX, this.afterSwipe);
    } else {
      const moveX = 0 - xdiff;
      this.autoMove(moveX, this.resetSwipe);
    }
  }
  /**
   * 滑动后复位
   */
  resetSwipe() {
    const swipeItems = document.getElementsByClassName("my-swipe-item");
    const leftItem = swipeItems[0] as HTMLElement;
    const swipeContainer = leftItem.parentNode as Node;
    swipeContainer.removeChild(leftItem);
    (swipeContainer as HTMLElement).style.transform = "translateX(0)";
  }
  /**
   * 滑动后处理
   */
  afterSwipe(xdiff: number) {
    const swipeItems = document.getElementsByClassName("my-swipe-item");
    const curItem = swipeItems[1] as HTMLElement;
    const leftItem = swipeItems[0] as HTMLElement;
    const swipeContainer = curItem.parentNode as Node;
    if (xdiff < 0) {
      // 去掉新增的左结点
      swipeContainer.removeChild(leftItem);
      // 把当前节点放到最后面
      swipeContainer.appendChild(curItem.cloneNode(true));
      swipeContainer.removeChild(curItem);
      this.curIndex = (this.curIndex + 1) % this.swipeItems.length;
    } else {
      swipeContainer.removeChild(swipeItems[swipeItems.length - 1]);
      this.curIndex =
        (this.curIndex + this.swipeItems.length - 1) % this.swipeItems.length;
    }
    (swipeContainer as HTMLElement).style.transform = "translateX(0)";
  }
  /**
   * 滑动
   */
  swipe(moveX: number) {
    this.setSwipeContainerTransform(moveX - window.innerWidth);
  }
  /**
   * 自滑速度
   */
  speed = 20;
  /**
   * 定时器id
   */
  idInterval = 0;
  /**
   * 自动滑动
   */
  autoMove(moveX: number, afterSwipeHandle: Function) {
    this.idInterval = setInterval(
      this.autoMoveHandle,
      20,
      this.getSwipeContainerTransform() + moveX,
      afterSwipeHandle
    );
  }
  /**
   * 获取滑动容器的偏移量
   */
  getSwipeContainerTransform(): number {
    const swipeContainer = document.getElementsByClassName(
      "my-swipe"
    )[0] as HTMLElement;
    return parseInt(
      swipeContainer.style.transform.substr(
        "translateX(".length,
        swipeContainer.style.transform.indexOf("px") - "translateX(".length
      )
    );
  }
  /**
   * 设置滑动容器的偏移量
   */
  setSwipeContainerTransform(offset: number) {
    const swipeContainer = document.getElementsByClassName(
      "my-swipe"
    )[0] as HTMLElement;
    swipeContainer.style.transform = "translateX(" + offset + "px)";
  }
  /**
   * 自动滑动定时任务
   */
  autoMoveHandle(target: number, afterSwipeHandle: Function) {
    let curOffset = this.getSwipeContainerTransform();
    let offset = 0;
    if (curOffset < target) {
      offset = Math.min(this.speed, target - curOffset);
    } else {
      offset = Math.max(-this.speed, target - curOffset);
    }
    curOffset += offset;
    this.setSwipeContainerTransform(curOffset);
    if (curOffset == target) {
      clearInterval(this.idInterval);
      afterSwipeHandle(offset);
      this.isAutoMove = false;
    }
  }
  /**
   * 判断是否是移动端
   */
  isMobile = false;
  /**
   * 移动起始x轴
   */
  startX = 0;
  /**
   * 拖拽中
   */
  isDrag = false;
  /**
   * 是否在自动移动
   */
  isAutoMove = false;
  /**
   * 开始滑动
   */
  touchStart(event: TouchEvent) {
    this.startX = event.touches[0].screenX;
    this.beginSwipe();
  }
  /**
   * 滑动
   */
  touchMove(event: TouchEvent) {
    if (this.isAutoMove) {
      return;
    }
    const moveX = event.changedTouches[0].screenX - this.startX;
    this.swipe(moveX);
  }
  /**
   * 结束滑动
   */
  touchEnd(event: TouchEvent) {
    if (this.isAutoMove) {
      return;
    }
    const moveX = event.changedTouches[0].screenX - this.startX;
    this.endSwipe(moveX);
  }
  /**
   * 鼠标按下
   */
  mouseDown(event: MouseEvent) {
    if (this.isMobile) {
      return;
    }
    this.isDrag = true;
    this.startX = event.screenX;
    this.beginSwipe();
  }
  /**
   * 鼠标移动
   */
  mouseMove(event: MouseEvent) {
    if (!this.isDrag || this.isAutoMove || this.isMobile) {
      return;
    }
    const moveX = event.screenX - this.startX;
    this.swipe(moveX);
  }
  /**
   * 鼠标抬起
   */
  mouseUp(event: MouseEvent) {
    if (this.isAutoMove || this.isMobile) {
      return;
    }
    this.isDrag = false;
    const moveX = event.screenX - this.startX;
    this.endSwipe(moveX);
  }
}
</script>