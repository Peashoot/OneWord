<template>
  <div
    class="my-image"
    @click="click"
    :style="{
      width: getSizeString(width),
      height: getSizeString(height),
      'border-radius': round ? '100%' : getSizeString(radius),
    }"
  >
    <img
      ref="img"
      class="my-image-inside"
      v-show="loaded"
      :src="src"
      :alt="alt"
      @loadstart="imgStyle = {}"
      @load="load($event)"
      @error="error"
      :style="imgStyle"
    />
    <div v-show="!loaded && !failed">
      <slot name="loading"
        ><my-icon :name="loadingIcon" :class-prefix="iconPrefix"
      /></slot>
    </div>
    <div v-show="!loaded && failed">
      <slot name="error"
        ><my-icon :name="errorIcon" :class-prefix="iconPrefix"
      /></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref, Watch } from "vue-property-decorator";
import MyIcon from "./MyIcon.vue";
import * as Common from "./common";
@Component({
  components: {
    "my-icon": MyIcon,
  },
})
export default class MyImage extends Vue {
  /**
   * 图片链接
   */
  @Prop()
  src!: string;
  /**
   * 图片填充模式
   */
  @Prop()
  fit!: string;
  /**
   * 替代文本
   */
  @Prop()
  alt!: string;
  /**
   * 宽度，默认单位为px
   */
  @Prop({ type: [Number, String], default: "auto" })
  width!: number | string;
  /**
   * 高度，默认单位为px
   */
  @Prop({ type: [Number, String], default: "auto" })
  height!: number | string;
  /**
   * 圆角大小，默认单位为px
   */
  @Prop({ type: [Number, String], default: 0 })
  radius!: number | string;
  /**
   * 是否显示为圆形
   */
  @Prop({ type: Boolean })
  round!: boolean;
  /**
   * 是否开启图片懒加载，须配合 Lazyload 组件使用
   */
  @Prop({ type: Boolean })
  lazyLoad!: boolean;
  /**
   * 是否展示图片加载失败提示
   */
  @Prop({ type: Boolean, default: true })
  showError!: boolean;
  /**
   * 是否展示图片加载中提示
   */
  @Prop({ type: Boolean, default: true })
  showLoading!: boolean;
  /**
   * 失败时提示的图标名称或图片链接
   */
  @Prop({ default: "picture-o" })
  errorIcon!: string;
  /**
   * 加载时提示的图标名称或图片链接
   */
  @Prop({ default: "spinner" })
  loadingIcon!: string;
  /**
   * 图标类名前缀
   */
  @Prop({ default: "fa" })
  iconPrefix!: string;
  /**
   * img标签
   */
  @Ref()
  img!: HTMLImageElement;
  /**
   * img class
   */
  imgStyle = {};
  /**
   * 图片是否加载
   */
  loaded = false;
  /**
   * 图片是否加载失败
   */
  failed = false;
  /**
   * 点击图片时触发
   */
  @Emit() // eslint-disable-next-line
  click(event: MouseEvent) {
    // TODO:
  }
  /**
   * 	图片加载完毕时触发
   */
  @Emit()
  load() {
    this.loaded = true;
    this.imgHeight = this.img.height;
    this.imgWidth = this.img.width;
    this.getImgStyle(this.fit);
  }
  /**
   * 图片高度
   */
  imgHeight = 0;
  /**
   * 图片宽度
   */
  imgWidth = 0;
  /**
   * 图片加载失败时触发
   */
  @Emit()
  error() {
    this.failed = true;
  }
  /**
   * 当填充模式改变后修改img样式
   */
  @Watch("fit")
  onFitChanged(fit: string) {
    this.getImgStyle(fit);
  }
  /**
   * 图片填充style
   */
  getImgStyle(fit: string) {
    switch (fit) {
      case "contain":
        this.imgStyle =
          this.imgHeight > this.imgWidth
            ? { height: "100%" }
            : { width: "100%" };
        break;
      case "cover":
        this.imgStyle =
          this.imgHeight > this.imgWidth
            ? { width: "100%" }
            : { height: "100%" };
        break;
      case "none":
        this.imgStyle = {};
        break;
      case "scale-down":
        this.imgStyle =
          this.$el.clientHeight < this.imgHeight
            ? this.imgHeight > this.imgWidth
              ? { height: "100%" }
              : { width: "100%" }
            : {};
        break;
      default:
        this.imgStyle = { height: "100%", width: "100%" };
        break;
    }
  }
  /**
   * 获取长度等大小的字符串形式，单位默认为px
   */
  getSizeString = Common.getSizeString;
}
</script>

<style scoped>
.my-image {
  line-height: normal;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>