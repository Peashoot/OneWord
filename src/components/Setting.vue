<template>
  <div class="setting">
    <van-nav-bar
      title="设置"
      left-text="返回"
      left-arrow
      @click-left="backToHome"
    />
    <p>黑暗模式</p>
    <van-switch v-model="darkMode" />
    <p>随机颜色</p>
    <van-switch v-model="randomColor" />
    <p>启用代理</p>
    <van-switch v-model="proxyEnable" />
    <p>代理地址</p>
    <van-picker
      title="标题"
      v-if="proxyEnable"
      :columns="proxys"
      @change="onChange"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { NavBar, IndexBar, Switch, Picker, Toast } from "vant";
import { AxiosResponse } from "axios";

@Component({
  components: {
    "van-nav-bar": NavBar,
    "van-index-bar": IndexBar,
    "van-switch": Switch,
    "van-picker": Picker,
  },
})
export default class Setting extends Vue {
  /**
   * 黑暗模式
   */
  private darkMode = false;
  /**
   * 启用代理
   */
  private proxyEnable = false;
  /**
   * 代理ip
   */
  private proxyIP = "";
  /**
   * 代理端口
   */
  private proxyPort = 80;
  /**
   * 随机颜色
   */
  private randomColor = false;
  /**
   * 被选代理池
   */
  private proxys = new Array<string>();
  /**
   * 返回主页
   */
  backToHome() {
    this.$router.push("/");
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
    try {
      const parts = values.split(":");
      this.proxyIP = parts[0];
      this.proxyPort = parseInt(parts[1]);
    } catch (error) {
      Toast.fail("Oh，设置代理出错啦");
    }
  }
}
</script>