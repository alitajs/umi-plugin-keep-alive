# umi-plugin-keep-alive

[![NPM version](https://img.shields.io/npm/v/umi-plugin-keep-alive.svg?style=flat)](https://npmjs.org/package/umi-plugin-keep-alive)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-keep-alive.svg?style=flat)](https://npmjs.org/package/umi-plugin-keep-alive)

`<KeepAlive>` for umijs base on [react-activation](https://github.com/CJY0208/react-activation)

## Usage

1. Configure in `.umirc.js` or `.umirc.ts`

    **MUST** place after `umi-plugin-react` or `umi-plugin-dva`

    ```javascript
    export default {
      plugins: [
        ['umi-plugin-react', ...],
        'umi-plugin-keep-alive', // MUST place after umi-plugin-react or umi-plugin-dva
      ],
    }
    ```

2. export `KeepAlive` from umi and wrap any component you want to be keeped  

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

## Typescript

If you are using `Typescript`, make sure that `tsConfig.compilerOptions.jsx` is "preserve",

Will cause unstable `<KeepAlive>` effect while `tsConfig.compilerOptions.jsx` is "react", use "preserve" instead. 

Ref: https://github.com/CJY0208/react-activation/issues/8

```json
{
  "compilerOptions": {
      "jsx": "preserve"
  }
}
```

## Options

TODO

## Documentation

All function of react-activation can be completely imported from umi

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

Visit [react-activation](https://github.com/CJY0208/react-activation) for full documentation

## LICENSE

MIT
