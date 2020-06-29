import React, { useMemo } from 'react';
import { Router, isBrowser } from 'umi';
import { renderRoutes } from '@umijs/renderer-react';
import { AliveScope, NodeKey } from 'react-activation';

NodeKey.defaultProps.onHandleNode = (node, mark) => {
  // 因异步组件 loaded 后会去掉 LoadableComponent 层，导致 nodeKey 变化，缓存定位错误
  // 故排除对 LoadableComponent 组件的标记，兼容 dynamicImport
  if (node.type && node.type.displayName === 'LoadableComponent') {
    return undefined;
  }

  return mark;
};

function AliveScopeContainer({ children, history, ...renderRoutesProps }: any) {
  const useRouterComponent = useMemo(() => typeof isBrowser !== 'function' || isBrowser() ? children.type : () => null, []);
  useRouterComponent({ history, ...renderRoutesProps });

  return (
    <Router history={history}>
      <AliveScope>{renderRoutes(renderRoutesProps)}</AliveScope>
    </Router>
  );
}

export function rootContainer(container: React.ReactNode, clientProps: any) {  
  return (
    <AliveScopeContainer {...clientProps}>{container}</AliveScopeContainer>
  );
}

