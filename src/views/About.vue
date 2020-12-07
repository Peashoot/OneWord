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

    <button @click="swipeToLeft">滑向左边</button
    ><button @click="swipeToRight">滑向右边</button>
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
  }
  /**
   * 随机生成亮色
   */
  lightColorGen(minLight: number) {
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
   * 滑向左边
   */
  swipeToLeft() {
    if (this.swipeItems.length < 2) {
      return;
    }
    const swipeItems = document.getElementsByClassName("my-swipe-item");
    const curItem = swipeItems[this.curIndex] as HTMLElement;
    const rightItem = (this.curIndex + 1 < this.swipeItems.length
      ? swipeItems[this.curIndex + 1]
      : swipeItems[0]) as HTMLElement;

    const swipeContainer = curItem.parentNode as Node;
    // 结束后把当前元素排到最后面
    swipeContainer.appendChild(curItem.cloneNode(true));
    if (swipeContainer.childNodes.length > this.swipeItems.length) {
      swipeContainer.removeChild(swipeItems[0]);
    } else {
      this.curIndex += 1;
    }
  }
  /**
   * 滑向右边
   */
  swipeToRight() {
    if (this.swipeItems.length < 2) {
      return;
    }
    const swipeItems = document.getElementsByClassName("my-swipe-item");
    const curItem = swipeItems[this.curIndex] as HTMLElement;
    const leftItem = (this.curIndex == 0
      ? swipeItems[this.swipeItems.length - 1].cloneNode(true)
      : swipeItems[this.curIndex - 1]) as HTMLElement;
    const swipeContainer = curItem.parentNode as Node;
    // 第一次移动时把最后一个元素复制一遍到最前面
    if (this.curIndex == 0) {
      swipeContainer.insertBefore(leftItem, curItem);
    } else {
      this.curIndex -= 1;
    }
    if (swipeContainer.childNodes.length > this.swipeItems.length) {
      swipeContainer.removeChild(swipeItems[swipeItems.length - 1]);
    }
  }
  /**
   * 移动起始x轴
   */
  startX = 0;
  /**
   * 拖拽中
   */
  isDrag = false;
  /**
   * 滑动
   */
  touchMove(event: TouchEvent) {
    const moveX = event.changedTouches[0].screenX - this.startX;
    console.log("Move: x " + moveX);
  }
  /**
   * 开始滑动
   */
  touchStart(event: TouchEvent) {
    this.startX = event.touches[0].screenX;
  }
  /**
   * 结束滑动
   */
  touchEnd(event: TouchEvent) {
    const moveX = event.changedTouches[0].screenX - this.startX;
    console.log("Move End: x " + moveX);
  }
  /**
   * 鼠标按下
   */
  mouseDown(event: MouseEvent) {
    this.isDrag = true;
    this.startX = event.screenX;
  }
  /**
   * 鼠标移动
   */
  mouseMove(event: MouseEvent) {
    if (!this.isDrag) {
      return;
    }
    const moveX = event.screenX - this.startX;
    console.log("Move: x " + moveX);
  }
  /**
   * 鼠标抬起
   */
  mouseUp(event: any) {
    this.isDrag = false;
    const moveX = event.screenX - this.startX;
    console.log("Move End: x " + moveX);
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
.my-navbar {
  display: flex;
  height: 3rem;
  /* border: 0;
  border-bottom: 1px;
  border-color: black;
  border-style: solid; */
  align-items: center;
  justify-content: center;
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
  top: 1rem;
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
}
.my-logo {
  width: 100%;
}
.my-swipe {
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
</style>