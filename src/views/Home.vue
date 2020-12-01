<template>
  <div class="home">
    <div class="scroll-view">
      <van-nav-bar title="一言" left-text="返回" left-arrow>
        <template #right>
          <van-icon name="setting" size="18" @click="toSetting" />
        </template>
      </van-nav-bar>
      <van-pull-refresh v-model="loading" @refresh="refreshWord">
        <img alt="Vue logo" src="//api.mtyqx.cn/tapi/random.php" class="logo" />
        <van-swipe
          class="my-swipe"
          indicator-color="white"
          ref="wordSwipe"
          @change="swipeIndexChanged"
        >
          <van-swipe-item
            v-for="(word, index) in words"
            :key="index"
            :style="{
              'background-color': colors[index],
            }"
          >
            <div
              class="word-container"
              :style="{
                'font-size': calcFontSize(word) + 'px',
              }"
            >
              <p :class="[{ 'copy-item': selectedIndex == index }, wordClass]">
                {{ word }}
              </p>
            </div>
            <van-icon
              class="copy-icon"
              class-prefix="my-icon"
              name="copy"
              @click="copyWords"
            />
          </van-swipe-item>
        </van-swipe>
      </van-pull-refresh>
      <van-button class="btn-next-one" type="primary" @click="refreshWord" round
        >不满意，换一个</van-button
      >
    </div>

    <van-action-sheet v-model="showLay" title="设置"
      ><div class="setting">
        <p>黑暗模式</p>
        <van-switch v-model="darkMode" />
        <p>随机颜色</p>
        <van-switch v-model="randomColor" />
        <p>启用代理</p>
        <van-switch v-model="proxyEnable" />
        <p>代理地址</p>
        <van-picker
          title="选择代理地址"
          v-if="proxyEnable"
          :columns="proxys"
          @change="onChange"
        />
      </div>
    </van-action-sheet>
    <van-tabbar v-model="active" safe-area-inset-bottom placeholder>
      <van-tabbar-item icon="comment-o">随心随遇</van-tabbar-item>
      <van-tabbar-item icon="description">洋墨水</van-tabbar-item>
      <van-tabbar-item icon="friends-o">社会人</van-tabbar-item>
      <van-tabbar-item icon="good-job-o">心灵鸡汤</van-tabbar-item>
      <van-tabbar-item icon="flower-o">彩虹屁</van-tabbar-item>
      <van-tabbar-item icon="like-o">渣男语录</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as clipboard from "clipboard-polyfill";
import {
  Tabbar,
  TabbarItem,
  Button,
  PullRefresh,
  NavBar,
  Icon,
  Swipe,
  SwipeItem,
  Dialog,
  Toast,
  Row,
  Col,
  ActionSheet,
  Picker,
  Switch,
} from "vant";
import "vant/lib/index.less";
import { AxiosResponse } from "axios";

@Component({
  components: {
    "van-nav-bar": NavBar,
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-button": Button,
    "van-pull-refresh": PullRefresh,
    "van-icon": Icon,
    "van-swipe": Swipe,
    "van-swipe-item": SwipeItem,
    "van-dialog": Dialog.Component,
    "van-row": Row,
    "van-col": Col,
    "van-action-sheet": ActionSheet,
    "van-switch": Switch,
    "van-picker": Picker,
  },
})
export default class Home extends Vue {
  /**
   * 已激活的标签页序号
   */
  private active = 0;
  /**
   * 最大轮播项目
   */
  private maxItemCount = 10;
  /**
   * 格言
   */
  private words = ["这个世界上没有完美的人类，所以，人无法自己一个人活著。"];
  /**
   * 轮播项目候选背景颜色
   */
  private candidateColors = [
    "#393ced",
    "#39a9ed",
    "#39edb1",
    "#7bed39",
    "#c6ed39",
    "#edc339",
    "#ed6339",
    "#ed3975",
    "#ed39cf",
    "#ab39ed",
  ];
  /**
   * 轮播项目背景颜色
   */
  private colors = ["#393ced"];
  /**
   * 下拉刷新状态
   */
  private loading = false;
  /**
   * 一言api类型数组
   */
  private scType = ["hitokoto", "en", "social", "soup", "fart", "zha"];
  /**
   * 黑夜模式
   */
  private darkMode = false;
  /**
   * 启用代理
   */
  private proxyEnabled = false;
  /**
   * 当前页
   */
  private selectedIndex = 0;
  /**
   * 已刷新次数
   */
  private refreshCount = 0;
  /**
   * 使用随机颜色
   */
  private randomColor = false;
  /**
   * 文本类型
   */
  private wordClass = "word-content";
  /**
   * 代理
   */
  private proxy = "";
  /**
   * 显示遮罩层
   */
  private showLay = false;
  /**
   * 启用代理
   */
  private proxyEnable = false;
  /**
   * 被选代理池
   */
  private proxys = new Array<string>();
  /**
   * 刷新格言
   */
  refreshWord() {
    const type =
      this.active < this.scType.length
        ? this.scType[this.active]
        : this.scType[0];
    const requrl =
      "https://api.uixsj.cn/hitokoto/get?type=" + type + "&code=json";
    let axiosInstance = this.axios.create();
    if (this.proxy != "" && this.proxyEnable) {
      const proxyHost = this.proxy.substr(0, this.proxy.indexOf(":"));
      const proxyPort = parseInt(
        this.proxy.substr(this.proxy.indexOf(":") + 1)
      );
      axiosInstance = this.axios.create({
        proxy: {
          host: proxyHost,
          port: proxyPort,
        },
      });
    }
    axiosInstance
      .get(requrl)
      .then((response: AxiosResponse<WordResp>) => {
        if (response.status == 200) {
          // 第一次刷新时把默认格言清空
          if (this.refreshCount == 0) {
            this.words = [];
            this.colors = [];
          }
          // 超出一定长度的把最开始的内容舍弃
          if (this.words.length >= this.maxItemCount) {
            this.words.splice(0, this.words.length - this.maxItemCount + 1);
            this.colors.splice(0, this.words.length - this.maxItemCount + 1);
          }
          this.words.push(response.data.content);
          if (this.randomColor) {
            // 随机颜色
            this.colors.push(
              this.candidateColors[
                Math.floor(Math.random() * this.candidateColors.length)
              ]
            );
          } else {
            // 按既定顺序使用颜色
            this.colors.push(
              this.candidateColors[
                this.refreshCount % this.candidateColors.length
              ]
            );
          }
          this.refreshCount++;
          // 切换到最新的页
          const swipe = this.$refs.wordSwipe as Swipe;
          swipe.swipeTo(this.words.length - 1);
        } else {
          Dialog.alert({
            message: "好像出故障了呢QAQ",
            closeOnClickOverlay: true,
          });
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        Dialog.alert({
          message: "不要心急，给我点时间缓缓呗",
          closeOnClickOverlay: true,
        });
      });
  }
  /**
   * 能否被复制
   */
  swipeIndexChanged(index: number) {
    this.selectedIndex = index;
  }
  /**
   * 复制格言
   */
  copyWords() {
    console.log("start copy");
    // 获取需要复制的dom
    const copyElements = document.getElementsByClassName("copy-item");
    if (copyElements.length < 1) {
      return;
    }
    const copyItemElement = copyElements[0] as HTMLElement;
    // 获取dom文本信息
    const items = [
      new clipboard.ClipboardItem({
        "text/plain": this.stringToBlob(
          "text/plain",
          copyItemElement.innerText
        ),
      }),
    ];
    // 写入到剪贴板
    clipboard.write(items).then(
      function () {
        Toast.success("复制成功");
      },
      function () {
        Toast.fail("复制失败，请手动选择复制！");
      }
    );
  }
  /**
   * string转成Blob类型
   */
  stringToBlob(type: string, str: string) {
    return new Blob([str], {
      type: type,
    });
  }
  /**
   * 计算字体大小
   */
  calcFontSize(word: string) {
    const fontSize = Math.floor(Math.sqrt(40000 / word.length));
    return fontSize < 20 ? 20 : fontSize;
  }
  /**
   * 跳转到设置
   */
  toSetting() {
    this.showLay = true;
  }
  /**
   * 启动时先查询一遍格言
   */
  mounted() {
    this.refreshWord();
  }
  /**
   * 利用Timeout异步加载代理池
   */
  loadProxys() {
    setTimeout(this.loadProxyAsync, 100);
  }
  /**
   * 同步加载代理池
   */
  async loadProxyAsync() {
    this.proxys = [];
    const ipPattern = /<td data-title="IP">(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})<\/td>/g;
    const portPattern = /<td data-title="PORT">(\d{1,5})<\/td>/g;
    // 同步查询代理列表
    await this.axios
      .get("/getproxy/free/inha/1")
      .then((response: AxiosResponse<string>) => {
        const alwaysTrue = true;
        while (alwaysTrue) {
          const ipMatch = ipPattern.exec(response.data) ?? [];
          const portMatch = portPattern.exec(response.data) ?? [];
          if (ipPattern.lastIndex > 0 && portPattern.lastIndex > 0) {
            this.proxys.push(ipMatch[1] + ":" + portMatch[1]);
          } else {
            break;
          }
        }
      });
  }
  /**
   * 页面创建时查询代理
   */
  created() {
    this.loadProxys();
  }
  /**
   * 当代理地址改变后，对属性进行复制
   */
  onChange(picker: Picker, values: string) {
    this.proxy = values;
  }
}

class WordResp {
  /**
   * 返回的状态码
   */
  code!: string;
  /**
   * 返回当前一言类型
   */
  type!: string;
  /**
   * 返回一言内容
   */
  content!: string;
}
</script>
<style>
.logo {
  width: 100%;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  height: 250px;
  text-align: center;
}
@font-face {
  font-family: "my-icon";
  src: url("../assets/iconfont.ttf") format("truetype");
}

.my-icon {
  font-family: "my-icon";
}

.my-icon-copy::before {
  content: "\e624";
}

.my-swipe .van-swipe-item .word-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.word-content {
  padding: 10px;
}

.copy-icon {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.btn-next-one {
  top: 15px;
}
</style>