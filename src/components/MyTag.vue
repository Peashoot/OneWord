<script lang="ts">
import { CreateElement, VNode } from "vue";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
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
    return h(this.tag, this.$slots.default);
  }
}
</script>