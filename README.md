# umi-plugin-keep-alive

[![NPM version](https://img.shields.io/npm/v/umi-plugin-keep-alive.svg?style=flat)](https://npmjs.org/package/umi-plugin-keep-alive)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-keep-alive.svg?style=flat)](https://npmjs.org/package/umi-plugin-keep-alive)

此 `<KeepAlive>` 功能基于 [react-activation](https://github.com/CJY0208/react-activation/blob/master/README_CN.md)

[English](./README_EN.md) | 中文说明

## 在线示例

https://codesandbox.io/s/umi-keep-alive-tabs-demo-knfxy

## 使用方法

1. 安装

    ```bash
    npm install umi-plugin-keep-alive --save
    # or
    yarn add umi-plugin-keep-alive
    ```

2. 从 `umi` 中导出 `KeepAlive`，包裹在需要被缓存的组件上

    ```javascript
    import { useState } from 'react'
    import { KeepAlive } from 'umi'

    function Counter() {
      const [count, setCount] = useState(0)

      return (
        <div>
          <p>count: {count}</p>
          <button onClick={() => setCount(count => count + 1)}>add</button>
        </div>
      )
    }

    export default function() {
      const [show, setShow] = useState(true)

      return (
        <div>
          <h1>Page index</h1>
          {show && (
            <KeepAlive>
              <Counter />
            </KeepAlive>
          )}
          <button onClick={() => setShow(show => !show)}>toggle</button>
        </div>
      )
    }
    ```

## 文档

所有来自 [react-activation](https://github.com/CJY0208/react-activation/blob/master/README_CN.md) 都可以由 `umi` 导出

```javascript
import {
  KeepAlive,
  useActivate, 
  useUnactivate, 
  withActivation,
  withAliveScope, 
  useAliveController
} from 'umi'
```

访问 [react-activation](https://github.com/CJY0208/react-activation/blob/master/README_CN.md) 查阅完整的文档

## LICENSE

MIT
