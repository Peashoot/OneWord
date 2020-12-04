<template>
  <div class="about">
    <div class="my-navbar">
      <span class="my-title">标题</span>
    </div>
    <div class="my-place-holder"></div>
    <div class="my-button-content">
      <button
        class="my-menu-item"
        v-for="(item, index) in menuItem"
        :key="index"
      >
        {{ item }}
      </button>
    </div>
    <div class="my-tabbar">
      <span class="my-root">页脚</span>
    </div>
    <div class="my-place-holder-tabbar"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Home extends Vue {
  menuItem = new Array<string>();
  mounted() {
    for (let i = 0; i < 11; i++) {
      this.menuItem.push("按钮" + i);
    }
  }
}
</script>

<style scoped>
div.my-navbar {
  display: flex;
  height: 3rem;
  border: 0;
  border-bottom: 1px;
  border-color: black;
  border-style: solid;
  align-items: center;
  justify-content: center;
}
div.my-place-holder {
  height: 1rem;
}
button.my-menu-item {
  display: inline-flex;
  margin: 1rem 1rem;
  width: 7rem;
  height: 7rem;
  border: 0;
  background-color: cyan;
  align-items: center;
  justify-content: center;
}
button.my-menu-item:active {
  background-color: deeppink;
}
button:last-child{
  align-self: self-start;
}
div.my-tabbar {
  width: 100%;
  display: flex;
  position: fixed;
  height: 3rem;
  bottom: 0;
  border: 0;
  border-top: 1px;
  border-color: black;
  border-style: solid;
  align-items: center;
  justify-content: center;
  background-color: white;
}
div.my-place-holder-tabbar {
  height: 3rem;
}
</style>