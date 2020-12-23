<template>
  <div class="my-picker">
    <slot
      ><div class="my-picker-toolbar">
        <div
          class="my-picker-cancel my-picker-head-item my-pick-toolbar-left"
          @click="cancel"
        >
          <slot name="cancel">{{ cancelButtonText }}</slot>
        </div>
        <div
          class="my-picker-title my-picker-toolbar-item my-picker-toolbar-center"
        >
          <slot name="title">{{ title }}</slot>
        </div>
        <div
          class="my-picker-confirm my-picker-toolbar-item my-pick-toolbar-right"
          @click="confirm"
        >
          <slot name="confirm">{{ confirmButtonText }}</slot>
        </div>
      </div></slot
    >
    <slot name="option">
      <slot name="columns-top"></slot>
      <div class="my-picker-body" :style="{ height: visibleHeight }">
        <my-picker-option
          class="my-picker-option-list"
          v-for="(item, index) in depth"
          :key="index"
          v-model="indexes[index]"
          :columns="getChild(index)"
          :visibleItemCount="visibleItemCount"
          :swipeDuration="swipeDuration"
          :allowHtml="allowHtml"
          :readonly="readonly"
          :valueKey="valueKey"
          :itemHeight="itemHeight"
          :defaultIndex="getDefaultIndex(index)"
          :stopAnimation="stopAnimation"
        >
        </my-picker-option>
      </div>
      <slot name="columns-bottom"></slot>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import MyPickerOption from "./MyPickerOption.vue";
@Component({
  components: {
    "my-picker-option": MyPickerOption,
  },
})
export default class MyPicker extends Vue {
  /**
   * 对象数组，配置每一列显示的数据
   */
  @Prop({ type: Array, default: () => [] })
  columns!: Array<Column>;
  /**
   * 顶部栏标题
   */
  @Prop()
  title!: string;
  /**
   * 确认按钮文字
   */
  @Prop({ default: "确认" })
  confirmButtonText!: string;
  /**
   * 取消按钮文字
   */
  @Prop({ default: "取消" })
  cancelButtonText!: string;
  /**
   * 选项对象中，选项文字对应的键名
   */
  @Prop({ default: "text" })
  valueKey!: string;
  /**
   * 顶部栏位置，可选值为bottom
   */
  @Prop({ default: "top" })
  toolbarPosition!: string;
  /**
   * 是否显示加载状态
   */
  @Prop({ type: Boolean })
  loading!: boolean;
  /**
   * 是否为只读状态，只读状态下无法切换选项
   */
  @Prop({ type: Boolean })
  readonly!: boolean;
  /**
   * 是否显示顶部栏
   */
  @Prop({ type: Boolean })
  showToolbar!: boolean;
  /**
   * 是否允许选项内容中渲染 HTML
   */
  @Prop({ type: Boolean, default: true })
  allowHtml!: boolean;
  /**
   * 单列选择时，默认选中项的索引
   */
  @Prop({ type: [Number, String], default: 0 })
  defaultIndex!: number | string;
  /**
   * 选项高度，支持 px vw vh rem 单位，默认 px
   */
  @Prop({ type: [Number, String], default: 44 })
  itemHeight!: number | string;
  /**
   * 可见的选项个数
   */
  @Prop({ type: [Number, String], default: 6 })
  visibleItemCount!: number | string;
  /**
   * 快速滑动时惯性滚动的时长，单位 ms
   */
  @Prop({ type: [Number, String], default: 1000 })
  swipeDuration!: number | string;
  /**
   * 停止滚动动画
   */
  stopAnimation = false;
  /**
   * 当前索引
   */
  indexes = [0];
  /**
   * 获取可见高度
   */
  get visibleHeight() {
    const unitPattern = /px|vw|vh|rem/;
    try {
      const unit = unitPattern.exec(this.itemHeight.toString())?.[0] ?? "px";
      const itemHeight = parseInt(
        this.itemHeight.toString().replace(unitPattern, "")
      );
      return itemHeight * parseInt(this.visibleItemCount.toString()) + unit;
    } catch {
      return 2.75 * parseInt(this.visibleItemCount.toString()) + "rem";
    }
  }
  /**
   * 获取选项深度
   */
  get depth() {
    return this.getDepth(this.columns);
  }
  /**
   * 递归获取深度
   */
  getDepth(columns: Array<Column>): number {
    try {
      if ((columns[0] as ObjectColumn) && (columns[0] as ObjectColumn).values) {
        return columns.length;
      }
      return (
        Math.max.apply(
          0,
          columns.map((item) =>
            (item as ObjectColumn) &&
            (item as ObjectColumn).children &&
            ((item as ObjectColumn).children ?? []).length > 0
              ? this.getDepth((item as ObjectColumn).children ?? [])
              : 0
          )
        ) + 1
      );
    } catch {
      return 1;
    }
  }
  /**
   * 获取子项
   */
  getChild(index: number) {
    if (this.indexes.length <= index) {
      this.indexes.push(0);
    }
    if (typeof this.columns[0] === "string") {
      return this.columns;
    }
    if (
      (this.columns[0] as ObjectColumn) &&
      (this.columns[0] as ObjectColumn).values
    ) {
      return (this.columns[index] as ObjectColumn).values;
    }
    let columns = this.columns as any[];
    for (let i = 0; i < index; i++) {
      columns = columns[this.indexes[i]].children;
    }
    return columns.map((item) => item[this.valueKey]);
  }
  /**
   * 获取默认索引
   */
  getDefaultIndex(index: number) {
    if (typeof this.columns[0] === "string") {
      return this.defaultIndex;
    }
    if (
      (this.columns[0] as ObjectColumn) &&
      (this.columns[0] as ObjectColumn).values
    ) {
      return (this.columns[index] as ObjectColumn).defaultIndex ?? 0;
    }
    return 0;
  }
  /**
   * 点击完成按钮时触发
   */
  @Emit()
  confirm() {
    // TODO: confirm
    this.stopAnimation = true;
    this.stopAnimation = false;
  }
  /**
   * 点击取消按钮时触发
   */
  @Emit()
  cancel() {
    // TODO: cancel
  }
  /**
   * 选项改变时触发
   */
  @Emit()
  change() {
    // TODO: change
  }
  /**
   * 获取所有列选中的值
   */
  getValues() {
    const values = [];
    for (let i = 0; i < this.depth; i++) {
      values.push(this.getChild(i)?.[this.indexes[i]]);
    }
    return values;
  }
  /**
   * 设置所有列选中的值
   */
  setValues(values: string[]) {
    for (let i = 0; i < this.depth && i < values.length; i++) {
      this.indexes[i] =
        this.getChild(i)?.findIndex((item) => item === values[i]) ??
        this.indexes[i];
    }
  }
  /**
   * 获取所有列选中值对应的索引
   */
  getIndexes() {
    return this.indexes.slice();
  }
  /**
   * 设置所有列选中值对应的索引
   */
  setIndexes(indexes: number[]) {
    for (let i = 0; i < this.depth && i < indexes.length; i++) {
      this.indexes[i] = indexes[i];
    }
  }
  /**
   * 获取对应列选中的值
   */
  getColumnValue(columnIndex: number) {
    return columnIndex >= this.indexes.length
      ? ""
      : this.getChild(columnIndex)?.[this.indexes[columnIndex]];
  }
  /**
   * 设置对应列选中的值
   */
  setColumnValue(columnIndex: number, value: Column) {
    if (columnIndex < this.columns.length) {
      const child = this.getChild(columnIndex) ?? [];
      for (let i = 0; i < child.length; i++) {
        if (child[i].toString() === value.toString()) {
          this.indexes[columnIndex] = i;
        }
      }
    }
  }
  /**
   * 获取对应列选中项的索引
   */
  getColumnIndex(columnIndex: number) {
    return columnIndex >= this.indexes.length ? -1 : this.indexes[columnIndex];
  }
  /**
   * 设置对应列选中项的索引
   */
  setColumnIndex(columnIndex: number, optionIndex: number) {
    if (columnIndex < this.indexes.length) {
      this.indexes[columnIndex] = optionIndex;
    }
  }
  /**
   * 获取对应列中所有选项
   */
  getColumnValues(columnIndex: number) {
    return columnIndex >= this.indexes.length ? [] : this.getChild(columnIndex);
  }
  /**
   * 设置对应列中所有选项
   */
  setColumnValues(columnIndex: number, values: Column[]) {
    // TODO:
  }
}
export declare type Column = ObjectColumn | string;
export interface ObjectColumn {
  /**
   * 列中对应的备选值
   */
  values?: string[];
  /**
   * 初始选中项的索引，默认为 0
   */
  defaultIndex?: number;
  /**
   * 为对应列添加额外的类名
   */
  className?: any;
  /**
   * 级联选项
   */
  children?: Array<Column>;
}
</script>

<style scoped>
.my-picker {
  width: 100%;
  line-height: normal;
}
.my-picker-toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
}
.my-picker-toolbar-item {
  display: inline-block;
}
.my-pick-toolbar-left {
  width: 20%;
}
.my-pick-toolbar-right {
  width: 20%;
}
.my-picker-toolbar-center {
  flex: 1;
  font-size: 1.2rem;
}
.my-picker-body {
  display: flex;
}
.my-picker-option-list {
  height: 100%;
  flex: 1;
  overflow: hidden;
  display: inline-block;
}
</style>