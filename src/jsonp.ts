/**
 * @desc 随机一个函数名
 * @param {string} prefix
 * @returns {string}
 */
function getName(prefix: string): string {
  return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}

/**
 * @desc 创建一个 script 标签
 * @param {string} url
 * @param {string} charset
 * @returns {HTMLElement}
 */
function createScript(url: string, charset: string): HTMLElement {
  const script = document.createElement('script');

  script.setAttribute('type', 'text/javascript');
  charset && script.setAttribute('charset', charset);
  script.setAttribute('src', url);
  script.async = true;

  return script;
}

interface IParams {
  url: string;
  charset?: string;
  onsuccess: (res: any) => void;
  onerror?: () => void;
}

/**
 * @desc jsonp 函数
 * @param {IParams} params
 * @returns {void}
 */
export function jsonp({
  url,
  charset = 'UTF-8',
  onsuccess,
  onerror,
}: IParams) {
  const callbackName = getName('tt_player');

  // @ts-ignore
  window[callbackName] = function () {
    if (onsuccess && typeof onsuccess === 'function') {
      onsuccess(arguments[0]);
    }
  }

  const script = createScript(url + '&callback=' + callbackName, charset);

  // @ts-ignore
  // 参考：https://www.jianshu.com/p/16e2da70e206
  script.onload = script.onreadystatechange = function () {
    // @ts-ignore
    // 参考：https://www.runoob.com/jsref/prop-doc-readystate.html
    if (!script.readyState || /loaded|complete/.test(script.readyState)) {
      // @ts-ignore
      script.onload = script.onreadystatechange = null;

      // 移除此 script 的 DOM 对象
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

      // 删除函数或变量
      // @ts-ignore
      window[callbackName] = null;
    }
  }

  script.onerror = function () {
    if (onerror && typeof onerror === 'function') {
      onerror();
    }
  }

  document.getElementsByTagName('head')[0].appendChild(script);
}
