import React from 'react';
import { AliveScope, NodeKey, autoFixContext, fixContext } from 'react-activation';

// 与业务 app 入口共用同一份 jsx-runtime 实例上的 override（React 19 Provider===Context 依赖此探测）
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  autoFixContext(
    [require('react/jsx-runtime'), 'jsx', 'jsxs', 'jsxDEV'],
    [require('react/jsx-dev-runtime'), 'jsx', 'jsxs', 'jsxDEV'],
  );
} catch (e) {
  // ignore
}

// React 19 + createRoot：KeepAlive 子树在 AliveScope/Keeper 下渲染（Router 外），
// 必须主动修复 react-router 的 Context，否则 useLocation / useSearchParams 会报错。
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rr = require('react-router-dom');
  ;[rr.UNSAFE_LocationContext, rr.UNSAFE_NavigationContext, rr.UNSAFE_RouteContext]
    .filter(Boolean)
    .forEach((ctx) => fixContext(ctx));
} catch (e) {
  // ignore
}
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const r = require('react-router');
  ;[r.UNSAFE_LocationContext, r.UNSAFE_NavigationContext, r.UNSAFE_RouteContext]
    .filter(Boolean)
    .forEach((ctx) => fixContext(ctx));
} catch (e) {
  // ignore
}

// @ts-ignore
NodeKey.defaultProps.onHandleNode = (node, mark) => {
  // 因异步组件 loaded 后会去掉 LoadableComponent 层，导致 nodeKey 变化，缓存定位错误
  // 故排除对 LoadableComponent 组件的标记，兼容 dynamicImport
  if (node.type && node.type.displayName === 'LoadableComponent') {
    return undefined;
  }

  return mark;
};

const Wrapper = ({ children, ...props }) => (
  React.createElement(AliveScope, null, React.cloneElement(children, {	...children.props, ...props }))
);

/**
 * 使用 innerProvider：AliveScope 落在 dataflowProvider(Model) 之内，
 * 避免 useModel dispatcher 为 null。勿再导出 rootContainer，否则双重包裹。
 */
export function innerProvider(container: React.ReactNode) {
  return React.createElement(Wrapper, null, container);
}
