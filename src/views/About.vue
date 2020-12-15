<template>
  <div class="about">
    <my-navbar
      left-text="返回"
      title="标题"
      @left-click="toHomePage"
      left-arrow
      placeholder
      fixed
      border
      safe-area-inset-top
    >
      <template #right>
        <span class="my-setting-icon"></span>
      </template>
    </my-navbar>
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

    <my-menu>
      <my-menu-item
        v-for="(item, menuIndex) in menuItems"
        :key="menuIndex"
        :icon="item.icon"
        >{{ item.name }}</my-menu-item
      >
    </my-menu>

    <!-- <div class="my-swipe-container">
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
    </div> -->

    <button class="my-round-button" @click="showColor = !showColor">
      不满意，换一个
    </button>
    <div>
      <my-icon name="camera" badge="9" dot size="2rem"></my-icon>
    </div>
    <my-switch
      :status="isRandomColor"
      @click="isRandomColor = !isRandomColor"
    ></my-switch>
    <div style="height: 50px"></div>
    <my-tabbar fixed placeholder safe-area-inset-bottom @change="change">
      <my-tabbar-item icon="user-circle">测试1</my-tabbar-item>
      <my-tabbar-item icon="user-circle-o" dot>测试2</my-tabbar-item>
      <my-tabbar-item icon="user-o" badge="2">测试3</my-tabbar-item>
      <my-tabbar-item icon="vcard">测试4</my-tabbar-item>
    </my-tabbar>
    <my-overlay :show="showColor" @click="showColor = !showColor">
      <div class="my-button-content">
        <button
          class="my-menu-item"
          v-for="(item, menuIndex) in menuItems"
          :key="menuIndex"
          :style="{
            'background-image': item.backImage,
          }"
        >
          <span v-if="item.icon != null && item.icon != ''">{{
            item.icon
          }}</span
          ><span>{{ item.name }}</span>
        </button>
      </div>
    </my-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  MySwitch,
  MySwipe,
  MyNavbar,
  MyTabbar,
  MyTabbarItem,
  MyIcon,
  MyOverlay,
  MyMenu,
  MyMenuItem,
} from "../components";
@Component({
  components: {
    "my-switch": MySwitch,
    "my-swipe": MySwipe,
    "my-navbar": MyNavbar,
    "my-tabbar": MyTabbar,
    "my-tabbar-item": MyTabbarItem,
    "my-icon": MyIcon,
    "my-overlay": MyOverlay,
    "my-menu": MyMenu,
    "my-menu-item": MyMenuItem,
  },
})
export default class Home extends Vue {
  menuItems = new Array<MenuItem>();
  tabbarItems = new Array<TabbarItem>();
  swipeItems = new Array<string>();
  curIndex = 0;
  isRandomColor = false;
  showColor = false;
  swithWidth = 40;
  mounted() {
    for (let i = 1; i <= 11; i++) {
      this.menuItems.push({ name: "按钮" + i, icon: "vcard" });
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
  change() {
    console.log("abc");
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
.my-setting-icon::after {
  content: "\e63f";
  margin-left: 2rem;
  font-size: 1.2rem;
  font-family: "my-icon-setting";
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