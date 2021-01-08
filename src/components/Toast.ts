import MyToast from "./MyToast.vue";
import Vue from "vue";
/**
 * Toast队列
 */
let queue = new Array<any>();
/**
 * 是否存在多个Toast
 */
let multiple = false;
/**
 * 默认选项
 */
const defaultOptions = {
  icon: "",
  type: "text",
  value: true,
  message: "",
  className: "",
  overlay: false,
  onClose: null,
  onOpened: null,
  duration: 2000,
  iconPrefix: undefined,
  position: "middle",
  transition: "van-fade",
  forbidClick: false,
  loadingType: undefined,
  getContainer: "body",
  overlayStyle: null,
  closeOnClick: false,
  closeOnClickOverlay: false,
}; // default options of specific type

let defaultOptionsMap = new Map<string, ToastOption | undefined>();
/**
 * 当前配置项
 */
let currentOptions = Object.assign({}, defaultOptions);
/**
 * 将配置项的duration修改为undefine
 * @param options 说明文字或配置项
 */
function transformOptions(options: ToastOption) {
  return Object.assign({}, options, {
    duration: undefined,
  });
}
/**
 * 将传入的参数转成配置项
 * @param option 说明文字或配置项
 */
function parseOptions(option: string | ToastOption): ToastOption {
  if (typeof option === "string") {
    return {
      message: option.toString(),
    };
  }
  return option as ToastOption;
}
/**
 * 创建toast
 */
function createInstance(): any {
  queue = queue.filter(
    (item) => !item.$el.parentNode || document.body.contains(item.$el)
  );
  if (!queue.length || multiple) {
    const toast = new MyToast();
    toast.$mount(document.createElement("div"));
    document.body.appendChild(toast.$el);
    queue.push(toast);
  }
  return queue[queue.length - 1];
}
/**
 * 展示Toast
 */
export default function Toast(option: string | ToastOption) {
  if (option == undefined) {
    option = {};
  }
  const toast = createInstance();
  let toastOption = parseOptions(option);
  toastOption = Object.assign(
    {},
    currentOptions,
    defaultOptionsMap.get(toastOption.type || currentOptions.type),
    toastOption
  );
  toastOption.clear = function () {
    toast.value = false;

    if (toastOption.onClose) {
      toastOption.onClose();
      toastOption.onClose = undefined;
    }

    if (multiple) {
      toast.$on('closed', function () {
        clearTimeout(toast.timer);
        queue = queue.filter(function (item) {
          return item !== toast;
        });
        window.document.body.removeChild(toast.$el);
        toast.$destroy();
      });
    }
  };

  Object.assign(toast, transformOptions(toastOption));
  clearTimeout(toast.timer);
  if (toastOption.duration && toastOption.duration > 0) {
    toast.timer = setTimeout(function () {
      toast.clear();
    }, toastOption.duration);
  }
  return toast;
}
/**
 * 显示loading图标
 * @param option 配置项
 */
Toast.loading = (option: string | ToastOption) => {
  return Toast(Object.assign({ type: 'loading' }, parseOptions(option)));
}
/**
 * 显示success图标
 * @param option 配置项
 */
Toast.success = (option: string | ToastOption) => {
  return Toast(Object.assign({ type: 'success' }, parseOptions(option)));
}
/**
 * 显示fail图标
 * @param option 配置项
 */
Toast.fail = (option: string | ToastOption) => {
  return Toast(Object.assign({ type: 'fail' }, parseOptions(option)));
}
/**
 * 清理第一个toast或全部清理
 * @param all 是否清除所有
 */
Toast.clear = (all?: boolean) => {
  if (queue.length) {
    if (all) {
      queue.forEach(function (toast) {
        toast.clear();
      });
      queue = [];
    } else if (!multiple) {
      queue[0].clear();
    } else {
      queue.shift().clear();
    }
  }
}
/**
 * 设置默认配置项
 * @param type 配置项类型 或 默认配置项
 * @param options 配置项信息
 */
Toast.setDefaultOptions = (type: string | ToastOption, options?: ToastOption) => {
  if (typeof type === 'string') {
    defaultOptionsMap.set(type, options);
  } else {
    Object.assign(currentOptions, type);
  }
}
/**
 * 重置默认配置项
 * @param type 配置项类型
 */
Toast.resetDefaultOptions = (type: string) => {
  if (typeof type === 'string') {
    defaultOptionsMap.set(type, undefined);
  } else {
    currentOptions = Object.assign({}, defaultOptions);
    defaultOptionsMap = new Map<string, ToastOption>();
  }
}
/**
 * 修改multiple参数
 * @param value 是否允许创建多个
 */
Toast.allowMultiple = (value?: boolean) => {
  if (value === undefined) {
    value = true;
  }
  multiple = value;
}

Vue.prototype.$toast = Toast;

interface ToastOption {
  /**
   * 清理方法
   */
  clear?: Function;
  /**
   * 提示类型，可选值为 loading success fail html
   */
  type?: string;
  /**
   * 位置，可选值为 top bottom
   */
  position?: string;
  /**
   * 文本内容，支持通过\n换行
   */
  message?: string;
  /**
   * 自定义图标，支持传入图标名称或图片链接
   */
  icon?: string;
  /**
   * 图标类名前缀，同 Icon 组件的 class-prefix 属性
   */
  iconPrefix?: string;
  /**
   * 是否显示背景遮罩层
   */
  overlay?: boolean;
  /**
   * 是否禁止背景点击
   */
  forbidClick?: boolean;
  /**
   * 是否在点击后关闭
   */
  closeOnClick?: boolean;
  /**
   * 是否在点击遮罩层后关闭
   */
  closeOnClickOverlay?: boolean;
  /**
   * 加载图标类型, 可选值为 spinner
   */
  loadingType?: string;
  /**
   * 展示时长(ms)，值为 0 时，toast 不会消失
   */
  duration?: number;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 完全展示后的回调函数
   */
  onOpened?: Function;
  /**
   * 关闭时的回调函数
   */
  onClose?: Function;
  /**-
   * 动画类名，等价于 transition 的name属性
   */
  transition?: string;
}