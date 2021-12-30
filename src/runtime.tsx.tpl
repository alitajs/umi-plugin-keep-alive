import React from 'react';
import { AliveScope, NodeKey } from 'react-activation';

// @ts-ignore
NodeKey.defaultProps.onHandleNode = (node, mark) => {
  // 因异步组件 loaded 后会去掉 LoadableComponent 层，导致 nodeKey 变化，缓存定位错误
  // 故排除对 LoadableComponent 组件的标记，兼容 dynamicImport
  if (node.type && node.type.displayName === 'LoadableComponent') {
    return undefined;
  }

  return mark;
};

// 兼容因使用 rootContainer 导致 access 权限无效问题 (传入 routes 带有 unaccessible 才能成功)
const Wrapper = ({ children, ...props }) => (
  React.createElement(AliveScope, null, React.cloneElement(children, {	...children.props, ...props }))
);

export function rootContainer(container: React.ReactNode) {
  return React.createElement(Wrapper, null, container);
}
