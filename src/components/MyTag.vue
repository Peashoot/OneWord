<script lang="ts">
import { CreateElement, VNode, VueConstructor } from "vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import MyOverlay from "./MyOverlay.vue";
@Component({
  components: {
    "my-overlay": MyOverlay,
  },
})
export default class MyTag extends Vue {
  /**
   * 标签
   */
  @Prop({ type: String, required: true })
  tag!: string;
  /**
   * 渲染函数
   */
  render(h: CreateElement): VNode {
    return h(
      this.tag,
      { props: this.$attrs, on: this.$listeners },
      this.$slots.default
    );
  }
}
</script>