interface IParams extends IPromiseAjaxParams {
  success: (res: any) => void;
  failed: (res: any) => void;
}

/**
 * @desc ajax 请求工具
 * @param {IParams} params
 * @returns {void}
 */
export function ajax({
  method = 'get',
  url = '',
  data = {},
  success = (res) => { },
  failed = (res) => { },
}: IParams) {
  // @ts-ignore
  const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  const type = method.toUpperCase();

  if (!url) { return; };

  const dataArr: string[] = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      dataArr.push(`key=${data[key]}`);
    }
  }

  // 清缓存
  dataArr.push(`_=${Math.random()}`);

  if (type == 'GET') {
    url = `${url}?${dataArr.join('&')}`

    xhr.open(type, url);
    xhr.send();
  } else {
    xhr.open(type, url);

    // 此处采用默认的表单模式，后期可以继续增强
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(dataArr.join('&'));
  }

  xhr.onload = function () {
    if (xhr.status == 200 || xhr.status == 304) {
      let res;

      if (success && success instanceof Function) {
        res = xhr.responseText;

        if (typeof res === 'string') {
          try {
            // 默认后段要返回可解析的 json 字符串
            res = JSON.parse(res);

            success.call(xhr, res);
          } catch (error) {
            failed.call(xhr, error);
          }
        } else {
          failed.call(xhr, res);
        }
      } else {
        failed.call(xhr, xhr);
      }
    } else {
      failed.call(xhr, xhr);
    }
  };
}

interface IPromiseAjaxParams {
  method: 'get' | 'post' | 'GET' | 'POST';
  url: string;
  data: Record<string, any>;
}

/**
 * @desc ajax 请求工具，支持 Promise
 * @param {IPromiseAjaxParams} params
 * @returns {void}
 */
export function promiseAjax(params: IPromiseAjaxParams) {
  return new Promise((resolve, reject) => {
    ajax({
      ...params,
      success: (res) => {
        resolve(res);
      },
      failed: (error) => {
        reject(error)
      }
    })
  })
}
