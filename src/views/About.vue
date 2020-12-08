<template>
  <div class="about">
    <div class="my-navbar">
      <div class="my-navbar-content my-navbar-left-content" @click="toHomePage">
        <span class="my-left-text">返回</span>
      </div>
      <div class="my-navbar-content my-navbar-middle-content">
        <span class="my-title">标题</span>
      </div>
      <div class="my-navbar-content my-navbar-right-content"></div>
    </div>
    <!-- <img src="//api.mtyqx.cn/tapi/random.php" alt="愿得一人心" class="my-logo"> -->
    <!-- <div class="my-button-content">
      <button
        class="my-menu-item"
        v-for="(item, menuIndex) in menuItems"
        :key="menuIndex"
        :style="{
          'background-image': item.backImage,
        }"
      >
        <span v-if="item.icon != null && item.icon != ''">{{ item.icon }}</span
        ><span>{{ item.name }}</span>
      </button>
    </div> -->
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
        <div
          class="my-swipe-item"
          v-for="(item, swipeIndex) in swipeItems"
          :key="swipeIndex"
          :style="{
            'background-color': lightColorGen(50),
          }"
        >
          {{ item }}
        </div>
      </div>
      <div class="my-swipe-indicator">
        <div
          v-for="(item, index) in swipeItems"
          :key="index"
          :class="[
            { 'my-swipe-indicator-marker-selected': curIndex == index },
            'my-swipe-indicator-marker',
          ]"
        ></div>
      </div>
    </div>
    <button class="my-round-button">不满意，换一个</button>
    <div class="my-switch-container">
      <button
        :class="[
          isRandomColor
            ? 'my-switch-bottom-checked'
            : 'my-switch-bottom-unchecked',
          'my-switch-bottom',
        ]"
        @click="isRandomColor = !isRandomColor"
      >
        <button
          :class="[
            isRandomColor ? 'my-switch-top-checked' : 'my-switch-top-unchecked',
            'my-switch-top',
          ]"
          ref="mySwitchTop"
          style="left: -20px"
        ></button>
      </button>
    </div>
    <div class="my-cover" v-show="showColor"></div>
    <div class="my-tabbar my-tabbar-height">
      <button
        class="my-tabbar-item"
        v-for="(item, index) in tabbarItems"
        :key="index"
        :style="{
          width: 100 / tabbarItems.length + '%',
        }"
      >
        <span>{{ item.icon }}</span> <span>{{ item.name }}</span>
      </button>
    </div>
    <div class="my-tabbar-height"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Home extends Vue {
  menuItems = new Array<MenuItem>();
  tabbarItems = new Array<TabbarItem>();
  swipeItems = new Array<string>();
  curIndex = 0;
  isRandomColor = false;
  showColor = true;
  mounted() {
    for (let i = 1; i <= 5; i++) {
      this.menuItems.push({ name: "按钮" + i });
    }
    for (let i = 1; i <= 5; i++) {
      this.swipeItems.push("Swpie" + i);
    }
    this.tabbarItems.push({ icon: "🤣", name: "随心随遇", link: "/sxsy" });
    this.tabbarItems.push({ icon: "😒", name: "洋墨水", link: "/yms" });
    this.tabbarItems.push({ icon: "😍", name: "社会人", link: "/shr" });
    this.tabbarItems.push({ icon: "😁", name: "心灵鸡汤", link: "/xljt" });
    this.tabbarItems.push({ icon: "😉", name: "彩虹屁", link: "/chp" });
    this.tabbarItems.push({ icon: "😜", name: "渣男语录", link: "/znyl" });
    this.isMobile =
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      ) != null;
  }
  /**
   * 随机生成亮色
   */
  lightColorGen(minLight: number): string {
    const mH = 360;
    const mS = 100;
    const mL = 80 - minLight;
    const H = ~~(mH * Math.random());
    const S = ~~(mS * Math.random());
    const L = minLight + ~~(mL * Math.random());
    return `HSL(${H},${S}%,${L}%)`;
  }
  /**
   * 跳转到主页
   */
  toHomePage() {
    window.location.href = "//www.peashoot.xyz";
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
  /**
   * 切换动画
   */
  switchChange() {
    this.isRandomColor = !this.isRandomColor;
    const mySwitchTop = this.$refs.mySwitchTop as HTMLElement;
    const animation =
      (this.isRandomColor ? "my-switch-top-check" : "my-switch-top-uncheck") +
      " 1s 1";
    console.log(animation);
    mySwitchTop.style.animation = animation;
    mySwitchTop.style.animationFillMode = "forwards";
  }
}

interface MenuItem {
  /**
   * 图标
   */
  icon?: string;
  /**
   * 背景图片
   */
  backImage?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 链接
   */
  link?: string;
}

interface TabbarItem {
  /**
   * 图标
   */
  icon?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 链接
   */
  link?: string;
}
</script>

<style scoped>
.about {
  line-height: 0;
}
.my-navbar {
  display: flex;
  height: 3rem;
  /* border: 0;
  border-bottom: 1px;
  border-color: black;
  border-style: solid; */
  align-items: center;
  justify-content: center;
  line-height: normal;
}
.my-left-text::before {
  content: "";
  position: absolute;
  left: 1.3rem;
  display: inline-block;
  height: 0.5rem;
  width: 0.5rem;
  border-width: 0 0 2px 2px;
  border-color: #000;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 6);
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 6);
}
.my-navbar-right-content::after {
  content: "\e63f";
  position: absolute;
  top: 0.9rem;
  right: 1.3rem;
  font-size: 1.2rem;
  font-family: "my-icon-setting";
}
.my-navbar-content {
  width: 33.33%;
}
.my-title {
  font-size: 1.2rem;
}
.my-button-content {
  line-height: normal;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.my-menu-item {
  margin: 1.5rem;
  width: 7rem;
  height: 7rem;
  border: 0;
  background-color: cyan;
  text-align: center;
  box-shadow: 0px 0px 10px #000;
}
.my-menu-item span {
  display: block;
}
.my-menu-item:active {
  opacity: 0.5;
}
.my-tabbar-item {
  height: 100%;
  font-size: 0.75rem;
  padding: 0;
}
.my-tabbar-item span {
  display: block;
}
.my-tabbar-height {
  height: 2.3rem;
}
.my-tabbar {
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0;
  line-height: normal;
}
.my-logo {
  width: 100%;
}
.my-swipe-container {
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
}
.my-swipe-item {
  display: inline-block;
  width: 100%;
  height: 15rem;
  /* 禁止选中文本 */
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  -webkit-touch-callout: none;
  user-select: none;
}
@font-face {
  font-family: "my-icon-setting";
  src: url("../assets/setting.ttf") format("truetype");
}
.my-round-button {
  margin-top: 5px;
  margin-bottom: 20px;
  height: 40px;
  line-height: 1.2;
  color: #fff;
  border-radius: 20px;
  background: #07c160;
  font-size: 1rem;
  cursor: pointer;
}
.my-swipe-indicator {
  position: relative;
  top: -30px;
}
.my-swipe-indicator-marker {
  content: "";
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  opacity: 50%;
  background-color: #fff;
}
.my-swipe-indicator-marker-selected {
  opacity: 1;
}
.my-switch-bottom {
  width: 80px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.my-switch-bottom-unchecked {
  background-color: #fff;
}
.my-switch-bottom-checked {
  background-color: #1989fa;
}
.my-switch-top {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  top: -2px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 3px 1px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1),
    0 3px 3px 0 rgba(0, 0, 0, 0.05);
}
.my-switch-top-checked {
  animation: my-switch-top-check 0.2s 1;
  animation-fill-mode: forwards;
}
.my-switch-top-unchecked {
  animation: my-switch-top-uncheck 0.2s 1;
  animation-fill-mode: forwards;
}
@keyframes my-switch-top-check {
  from {
    left: -20px;
  }
  to {
    left: 20px;
  }
}

@-webkit-keyframes my-switch-top-check /*Safari and Chrome*/ {
  from {
    left: -20px;
  }
  to {
    left: 20px;
  }
}
@keyframes my-switch-top-uncheck {
  from {
    left: 20px;
  }
  to {
    left: -20px;
  }
}

@-webkit-keyframes my-switch-top-uncheck /*Safari and Chrome*/ {
  from {
    left: 20px;
  }
  to {
    left: -20px;
  }
}
.my-cover {
  position: absolute;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 1);
  width: 100%; /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60); /*设置透明度为60%*/
  opacity: 0.6; /*非IE浏览器下设置透明度为60%*/
  z-index: 999;
  overflow: hidden;
}
</style>