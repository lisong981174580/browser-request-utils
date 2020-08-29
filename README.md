## browser-request-utils
浏览器通讯类工具，如 jsonp、ajax 封装等

## Installment 

```sh
npm install browser-request-utils --save
```

## Documentation

```ts
interface IPromiseAjaxParams {
  method: 'get' | 'post' | 'GET' | 'POST';
  url: string;
  data: Record<string, any>;
}

interface IParams extends IPromiseAjaxParams {
  success: (res: any) => void;
  failed: (res: any) => void;
}

interface IJsonpParams {
	url: string;
	charset?: string;
  onsuccess: (res: any) => void;
  onerror?: () => void;
}
```

### ajax
 * @desc ajax 请求工具
 * @param {IParams} params
 * @returns {void}

#### Usage
```js
  ajax({
    method = 'get',
    url = 'https://www.npmjs.com/',
    data = {
      mobile: 18165057632,
      page: 2
    },
    success = (res) => {
      console.log(res);
    },
    failed = (error) => {
      console.error(error);
    },
  })
```

### promiseAjax
 * @desc ajax 请求工具，支持 Promise
 * @param {IPromiseAjaxParams} params
 * @returns {void}

#### Usage
```js
  promiseAjax({
    method = 'get',
    url = 'https://www.npmjs.com/',
    data = {
      mobile: 18165057632,
      page: 2
    },
  }).then(res => {
    console.log(res);
  }).catch(error => {
    console.error(error);
  })
```

### jsonp
 * @desc jsonp 函数
 * @param {IJsonpParams} params
 * @returns {void}

#### Usage
```js
  jsonp({
    url: 'https://www.npmjs.com/package/browser-request-utils?',
    charset = 'UTF-8',
    onsuccess: (res) => {
      console.log(res);
    },
    onerror: () => {
      // 出错了
    }

    // 需要服务端根据 callback 名称返回一个代码块，例如
    callbackname({
      res: {
        a: 123,
      }
    })
  })
```