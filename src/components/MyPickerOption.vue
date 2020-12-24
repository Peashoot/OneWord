<template>
  <div class="my-picker-option">
    <div
      class="my-picker-option-view"
      ref="view"
      @touchstart.prevent="touchStart($event)"
      @touchmove.prevent="touchMove($event)"
      @touchend.prevent="touchEnd($event)"
      @mousedown.prevent="mouseDown($event)"
      @mousemove.prevent="mouseMove($event)"
      @mouseup.prevent="mouseUp($event)"
    >
      <div
        v-for="(item, index) in columns"
        :key="index"
        :class="[
          'my-picker-option-item',
          {
            'my-picker-option-selected-item': index == subIndex,
          },
          item.className,
        ]"
        :style="{ height: itemHeightString }"
      >
        <div v-if="allowHtml" v-html="item"></div>
        <div v-else v-text="item"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Ref,
  Model,
  Emit,
  Watch,
} from "vue-property-decorator";
import * as Common from "./common";
@Component
export default class MyPickerOption extends Vue {
  /**
   * 对象数组，配置每一列显示的数据
   */
  @Prop({ type: Array, default: () => [] })
  columns!: Array<string>;
  /**
   * 可见的选项个数
   */
  @Prop()
  visibleItemCount!: number | string;
  /**
   * 快速滑动时惯性滚动的时长，单位 ms
   */
  @Prop()
  swipeDuration!: number | string;
  /**
   * 是否允许选项内容中渲染 HTML
   */
  @Prop()
  allowHtml!: boolean;
  /**
   * 是否为只读状态，只读状态下无法切换选项
   */
  @Prop()
  readonly!: boolean;
  /**
   * 选项对象中，选项文字对应的键名
   */
  @Prop()
  valueKey!: string;
  /**
   * 选项高度，支持 px vw vh rem 单位，默认 px
   */
  @Prop()
  itemHeight!: number | string;
  /**
   * 默认索引
   */
  @Prop({ type: Number, default: 0 })
  defaultIndex!: number;
  /**
   * 是否停止动画
   */
  @Prop({ type: Boolean })
  stopAnimation!: boolean;
  /**
   * 当前索引
   */
  subIndex = this.defaultIndex;
  /**
   * 选项视图
   */
  @Ref()
  view!: HTMLElement;
  /**
   * 绑定的索引值
   */
  @Model("input")
  value!: number;
  /**
   * 更新索引
   */
  @Emit() // eslint-disable-next-line
  input(index: number) {
    // TODO:
  }
  /**
   * 父级索引修改时子组件同步修改
   */
  @Watch("value")
  onValueChanged(newVal: number) {
    this.$nextTick(() => {
      this.select(newVal);
    });
  }
  /**
   * 当索引修改时通知到父级
   */
  @Watch("subIndex")
  onSubIndexChanged(newVal: number) {
    this.input(newVal);
  }
  /**
   * 当父级确认后，停止动画
   */
  @Watch("stopAnimation")
  onStopAnimation(newVal: boolean) {
    if (newVal) {
      this.view.style.transitionDuration = "0";
    }
  }
  /**
   * 启动时偏移值初始index位置
   */
  mounted() {
    this.$nextTick(() => {
      this.setViewTransform(this.calcOffset(this.subIndex));
    });
  }
  /**
   * 获取item高度
   */
  get itemHeightString() {
    return Common.getSizeString(this.itemHeight);
  }
  /**
   * 获取item实际的高度
   */
  get itemRealHeight() {
    return (this.view.firstElementChild as HTMLElement).clientHeight;
  }
  /**
   * 最大偏移量
   */
  get maxOffsetY() {
    return this.calcOffset(0);
  }
  /**
   * 最小偏移量
   */
  get minOffsetY() {
    return this.calcOffset(this.columns.length - 1);
  }

  get visibleItemCountValue() {
    return parseInt(this.visibleItemCount.toString());
  }
  /**
   * 根据index计算偏移量
   */
  calcOffset(index: number) {
    const value = (this.visibleItemCountValue - 1) / 2 - index;
    return value * this.itemRealHeight;
  }
  /**
   * 根据偏移量获取当前的index
   */
  calcIndex(offsetY: number) {
    return Math.max(
      Math.min(
        Math.round(
          (this.visibleItemCountValue - 3) / 2 - offsetY / this.itemRealHeight
        ),
        this.columns.length - 1
      ),
      0
    );
  }
  /**
   * 根据transform计算当前index
   */
  calcIndexBaseTransform() {
    if (!this.view.style.transform) {
      return 0;
    }
    return this.calcIndex(
      parseInt(
        this.view.style.transform.substring(
          "transform(".length,
          this.view.style.transform.indexOf("px")
        )
      )
    );
  }
  /**
   * 设置视图偏移量
   */
  setViewTransform(offsetY: number) {
    offsetY = Math.max(Math.min(offsetY, this.maxOffsetY), this.minOffsetY);
    this.view.style.transform = "translateY(" + offsetY + "px)";
  }
  /**
   * 偏移量
   */
  beginY = -1;
  /**
   * 上一次时间
   */
  lastTime = 0;
  /**
   * 点击时的index
   */
  clickIndex = 0;
  /**
   * 初始偏移量
   */
  oriOffsetY = 0;
  /**
   * 事件预处理
   */
  beforeEventHandle(event: Event) {
    if (event.cancelable) {
      event.preventDefault();
      event.stopPropagation();
    }
    return true;
  }
  /**
   * 开始滑动-移动端
   */
  touchStart(event: TouchEvent) {
    if (!this.beforeEventHandle(event)) {
      return;
    }
    this.beginSwipe(event.touches[0].clientY, event);
  }
  /**
   * 开始滑动-桌面端
   */
  mouseDown(event: MouseEvent) {
    if (!this.beforeEventHandle(event)) {
      return;
    }
    this.beginSwipe(event.clientY, event);
  }
  /**
   * 开始滑动
   */
  beginSwipe(beginY: number, event: Event) {
    this.view.style.transitionProperty = "none";
    this.beginY = beginY;
    this.lastTime = new Date().getTime();
    this.oriOffsetY = this.calcOffset(this.subIndex);
    for (let i = 0; i < this.view.children.length; i++) {
      if (
        this.view.children.item(i) === event.composedPath()[0] ||
        this.view.children.item(i) === event.composedPath()[1]
      ) {
        this.clickIndex = i;
        break;
      }
    }
  }
  /**
   * 滑动中-移动端
   */
  touchMove(event: TouchEvent) {
    if (!this.beforeEventHandle(event) || this.beginY < 0) {
      return;
    }
    this.swiping(event.changedTouches[0].clientY);
  }
  /**
   * 滑动中-桌面端
   */
  mouseMove(event: MouseEvent) {
    if (!this.beforeEventHandle(event) || this.beginY < 0) {
      return;
    }
    this.swiping(event.clientY);
  }
  /**
   * 滑动中
   */
  swiping(clientY: number) {
    const offsetY = this.oriOffsetY + clientY - this.beginY;
    this.setViewTransform(offsetY);
    this.subIndex = this.calcIndex(offsetY);
  }
  /**
   * 滑动结束-移动端
   */
  touchEnd(event: TouchEvent) {
    if (!this.beforeEventHandle(event) || this.beginY < 0) {
      return;
    }
    this.afterSwipe(event.changedTouches[0].clientY);
  }
  /**
   * 滑动结束-桌面端
   */
  mouseUp(event: MouseEvent) {
    if (!this.beforeEventHandle(event) || this.beginY < 0) {
      return;
    }
    this.afterSwipe(event.clientY);
  }
  /**
   * 滑动结束
   */
  afterSwipe(clientY: number) {
    const beginY = this.beginY;
    this.beginY = -1;
    const currentTime = new Date().getTime();
    if (Math.abs(clientY - beginY) < 3 && currentTime - this.lastTime < 200) {
      this.select(this.clickIndex);
      return;
    }
    const speed = (clientY - beginY) / (currentTime - this.lastTime);
    // 后续滑动距离
    const extend =
      clientY - beginY + speed * parseInt(this.swipeDuration.toString());
    // 滑动后index
    const index = this.calcIndex(this.oriOffsetY + extend);
    this.select(index, parseInt(this.swipeDuration.toString()));
  }
  /**
   * 点击后滚动到当前选项
   */
  select(index: number, duration = 300) {
    this.view.style.transitionProperty = "transform";
    this.view.style.transitionDuration = duration + "ms";
    this.setViewTransform(this.calcOffset(index));
    this.subIndex = index;
  }
}
</script>

<style scoped>
.my-picker-option-view {
  position: relative;
  display: flex;
  flex-direction: column;
}
.my-picker-option-item {
  width: 100%;
  opacity: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-picker-option-selected-item {
  border-width: 0.06125rem 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.05);
  opacity: 100%;
}
</style>