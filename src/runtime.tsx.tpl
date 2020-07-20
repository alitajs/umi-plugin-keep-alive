import React, { useEffect } from 'react';
import { Router, ApplyPluginsType } from 'umi';
import { renderRoutes } from '@umijs/renderer-react';
import { AliveScope, NodeKey } from 'react-activation';
import { matchRoutes } from 'react-router-config';

// @ts-ignore
NodeKey.defaultProps.onHandleNode = (node, mark) => {
  // 因异步组件 loaded 后会去掉 LoadableComponent 层，导致 nodeKey 变化，缓存定位错误
  // 故排除对 LoadableComponent 组件的标记，兼容 dynamicImport
  if (node.type && node.type.displayName === 'LoadableComponent') {
    return undefined;
  }

  return mark;
};

// 覆写 RouterComponent，仅置入 AliveScope 而不改动剩余逻辑
// https://github.com/umijs/umi/blob/v3.2.10/packages/renderer-react/src/renderClient/renderClient.tsx#L22
function AliveRouterComponent({ children, history, ...renderProps }: any) {
  const renderRoutesProps = {...children.props, ...renderProps};
  const props = { history, ...renderRoutesProps };

  useEffect(() => {
    // first time using window.g_initialProps
    // switch route fetching data, if exact route reset window.getInitialProps
    if ((window as any).g_initialProps) {
      (window as any).g_initialProps = null;
    }
    function routeChangeHandler(location: any, action?: string) {
      const matchedRoutes = matchRoutes(props.routes, location.pathname);

      // Set title
      if (
        typeof document !== 'undefined' &&
        renderRoutesProps.defaultTitle !== undefined
      ) {
        document.title =
          (matchedRoutes.length &&
            // @ts-ignore
            matchedRoutes[matchedRoutes.length - 1].route.title) ||
          renderRoutesProps.defaultTitle ||
          '';
      }
      props.plugin.applyPlugins({
        key: 'onRouteChange',
        type: ApplyPluginsType.event,
        args: {
          routes: props.routes,
          matchedRoutes,
          location,
          action,
        },
      });
    }
    routeChangeHandler(history.location, 'POP');
    return history.listen(routeChangeHandler);
  }, [history]);

  return (
    <Router history={history}>
      <AliveScope>{renderRoutes(renderRoutesProps)}</AliveScope>
    </Router>
  );
}

export function rootContainer(container: React.ReactNode, clientProps: any) {    
  return (
    <AliveRouterComponent {...clientProps}>{container}</AliveRouterComponent>
  );
}
