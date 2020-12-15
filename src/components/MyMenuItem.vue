<template>
  <div class="my-menu-item" @click="click($event)">
    <slot name="icon">
      <my-icon
        class="my-menu-item-icon"
        v-if="icon && icon != ''"
        :name="icon"
      />
    </slot>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import MyIcon from "./MyIcon.vue";
@Component({
  components: {
    "my-icon": MyIcon,
  },
})
export default class MyMenuItem extends Vue {
  /**
   * 菜单值
   */
  @Prop()
  value!: string;
  /**
   * 菜单图标
   */
  @Prop()
  icon!: string;
  /**
   * 点击事件
   */
  @Emit() // eslint-disable-next-line
  click(event: MouseEvent) {
    // TODO: click
  }
}
</script>

<style scoped>
.my-menu-item {
  margin: 1.5rem;
  width: 7rem;
  height: 7rem;
  border: 0;
  background-color: cyan;
  box-shadow: 0 0 0.625rem #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.my-menu-item:active {
  opacity: 0.5;
}
.my-menu-item-icon {
  margin-bottom: 0.125rem;
}
</style>