<template>
  <transition name="fade">
    <div
      class="st-dialog"
      title="弹框整体-也是遮罩层"
      v-show="dialogVisible"
      @click.self="dialogClose"
      :style="{ 'z-index': zIndex }"
    >
      <div
        class="dialog-content moving"
        :class="{ dialog_show: dialogVisible }"
        title="白底弹框盒子"
        :style="{
          transform: `translate3d(${postionX}px, ${postionY}px, 0) scale(0)`,
          width: `${width}px`,
        }"
      >
        <header style="padding: 15px 15px 10px; position: relative">
          <h2 style="font-weight: 400; font-size: 18px">{{ title }}</h2>
          <button class="header-close-btn" @click="closeDialog">
            <i class="icon-close">×</i>
          </button>
        </header>
        <div class="dialog-body" style="padding: 10px 15px">
          <slot></slot>
        </div>
        <footer style="padding: 5px 15px 0; text-align: right">
          <div>
            <slot name="footer"></slot>
          </div>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
let zIndex = 1000;
let keyId = 1;
export default {
  name: "StDialog",
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "提示",
    },
    beforeClose: Function,
    width: {
      type: Number,
      default: 420,
    },
  },
  data() {
    return {
      zIndex: zIndex,
      keyId: keyId,
      postionX: "",
      postionY: "",
      dialogVisible: false,
    };
  },
  created() {
    zIndex++;
    keyId++;
  },
  mounted() {
    document.addEventListener("click", this.setContentPosition);
  },
  watch: {
    visiable: {
      handler() {
        this.dialogVisible = this.visiable;
      },
      immediate: true,
    },
  },
  methods: {
    closeDialog() {
      this.dialogClose();
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$emit("update:visiable", this.dialogVisible);
    },
    setContentPosition(e) {
      if (!this.visiable || this.$el.contains(e.target)) return;
      //   console.log(this.value, this.contentShow, this.$el, e.target);
      // const { clientWidth, clientHeight } = this.$el; document.documentElement.clientWidth || document.body.clientWidth
      const { clientWidth, clientHeight } = document.documentElement;
      console.log(this.$el.clientWidth);
      const centerX = clientWidth / 2;
      const centerY = clientHeight / 2;
      const pageY = e.clientY - centerY;
      const pageX = e.clientX - centerX;
      // console.log(pageY);
      //   this.postionX = `${(pageX / clientWidth) * 100}vw`;
      //   this.postionY = `${(pageY / clientHeight) * 100}vh`;
      this.postionX = pageX;
      this.postionY = pageY;
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.dialog-content.dialog_show {
  transform: translate3d(0, 0, 0) scale(1) !important;
}
.dialog-content.moving {
  transition: 0.3s all;
}
.st-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.45);
}
.dialog-content {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  width: 420px;
  border-radius: 4px;
  font-size: 14px;
  text-align: left;
  overflow: hidden;
  padding-bottom: 10px;
}
.header-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0;
  border: none;
  outline: 0;
  background: 0 0;
  font-size: 16px;
  cursor: pointer;
  .icon-close {
    display: inline-block;
    height: 100%;
    font-size: 20px;
    width: 20px;
  }
}
</style>
