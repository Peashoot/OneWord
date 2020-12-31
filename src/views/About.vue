<template>
  <div class="about">
    <my-navbar
      title="Field"
      @left-click="toHomePage"
      left-arrow
      placeholder
      :border="false"
      fixed
      safe-area-inset-top
    >
      <!-- <template #right>
        <span class="my-setting-icon"></span>
      </template> -->
    </my-navbar>
    <my-action-sheet
      v-model="showActionSheet"
      title="标题"
      description="这是一段描述信息"
      :actions="[
        { name: '选项一', color: 'red' },
        { name: '选项二', disabled: true },
        { name: '选项三', subname: '描述信息' },
        { name: '选项四', loading: true },
      ]"
      cancelText="取消"
      :safeAreaInsetBottom="false"
      @select="print('abc')"
    >
    </my-action-sheet>
    <button class="my-test-button" @click="showActionSheet = true">显示</button>
    <!-- <my-image
      src="//api.mtyqx.cn/tapi/random.php"
      alt="愿得一人心"
      class="my-logo"
      width="320"
      height="320"
      fit="scale-down"
      lazy-load
      round
    /> -->

    <!-- <my-pull-refresh
      v-model="tmpLoading"
      @refresh="refreshSleep(2000)"
      :successText="'abcdesf'"
    >
      <my-menu>
        <my-menu-item
          v-for="(item, menuIndex) in menuItems"
          :key="menuIndex"
          :icon="item.icon"
          v-text="item.name"
          ></my-menu-item
        >
      </my-menu>
      <my-swipe :initialSwipe="12" :width="300" :height="220" :vertical="true" :lazyRender="true" ref="myswipe">
        <my-swipe-item
          v-for="(item, swipeIndex) in swipeItems"
          :key="swipeIndex"
          :style="{
            'background-color': lightColorGen(50),
          }"
          v-text="'swipe'+swipeIndex"
          ></my-swipe-item
        >
      </my-swipe>
      <button @click="myswipe.prev()" class="my-test-button">上一个</button>
      <button @click="myswipe.next()" class="my-test-button">下一个</button>
      <input v-model="page" type="number" class="my-test-button" />
      <button @click="myswipe.swipeTo(page)" class="my-test-button">
        跳转
      </button> 
      
      <button class="my-round-button" @click="showColor = !showColor">
        不满意，换一个
      </button>
      <div>
        <my-icon
          name="camera"
          badge="9"
          dot
          size="2rem"
          @click="print('emit too')"
        ></my-icon>
      </div>
      <my-switch
        v-model="isRandomColor"
        @click="isRandomColor = !isRandomColor"
      ></my-switch>
      <div style="height: 50px"></div
    ></my-pull-refresh>
    <my-picker
      ref="mypicker"
      :title="'标题'"
      @change="print('change')"
      :columns="[
        {
          text: '浙江',
          children: [
            {
              text: '杭州',
              children: [{ text: '西湖区' }, { text: '余杭区' }],
            },
            {
              text: '温州',
              children: [{ text: '鹿城区' }, { text: '瓯海区' }],
            },
          ],
        },
        {
          text: '福建',
          children: [
            {
              text: '福州',
              children: [{ text: '鼓楼区' }, { text: '台江区' }],
            },
            {
              text: '厦门',
              children: [{ text: '思明区' }, { text: '海沧区' }],
            },
          ],
        },
      ]"
    ></my-picker> -->
    <!-- <my-tabbar fixed placeholder safe-area-inset-bottom @change="change">
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
          <span
            v-if="item.icon != null && item.icon != ''"
            v-text="item.icon"
          ></span
          ><span v-text="item.name"></span>
        </button>
      </div>
    </my-overlay> -->
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
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
  MyPullRefresh,
  MySwipeItem,
  MyPicker,
  MyImage,
  MyField,
  MyActionSheet,
} from "../components";
import { Field } from "vant";
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
    "my-pull-refresh": MyPullRefresh,
    "my-swipe-item": MySwipeItem,
    "my-picker": MyPicker,
    "my-image": MyImage,
    "my-field": MyField,
    "my-action-sheet": MyActionSheet,
  },
})
export default class Home extends Vue {
  menuItems = new Array<MenuItem>();
  tabbarItems = new Array<TabbarItem>();
  swipeItems = new Array<string>();
  curIndex = 0;
  isRandomColor = true;
  showActionSheet = false;
  showColor = false;
  switchWidth = 40;
  @Ref()
  myswipe!: MySwipe;
  @Ref()
  mypicker!: MyPicker;
  page = 0;
  isMobile = false;
  mounted() {
    for (let i = 1; i <= 11; i++) {
      this.menuItems.push({ name: "按钮" + i, icon: "vcard" });
    }
    for (let i = 1; i <= 10; i++) {
      this.swipeItems.push("Swipe" + i);
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

  async refreshSleep(time: number) {
    this.tmpLoading = true;
    await new Promise((resolve) => setTimeout(resolve, time));
    this.tmpLoading = false;
  }
  tmpLoading = false;
  change() {
    // TODO: change
  } // eslint-disable-next-line
  print(obj: any) {
    console.log(obj);
  }
  fieldFormatter(input: string) {
    return input?.replace(/\d/gi, "");
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
  background-color: #f7f8fa;
  min-height: 100vh;
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
.my-logo {
  width: 100%;
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
.my-test-button {
  line-height: normal;
}
.van-doc-demo-block__title {
  margin: 0;
  padding: 32px 16px 16px;
  color: rgba(69, 90, 100, 0.6);
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  text-align: left;
}
.van-cell::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 16px;
  bottom: 0;
  left: 16px;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.van-doc-demo-section {
  box-sizing: border-box;
  min-height: 30px;
  padding-bottom: 20px;
}
</style>