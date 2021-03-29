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

export function rootContainer(container: React.ReactNode, clientProps: any) {    
  return (
    <AliveScope>{container}</AliveScope>
  );
}
