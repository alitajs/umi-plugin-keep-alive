import React, { useMemo } from 'react';
import { Router, isBrowser } from 'umi';
import { renderRoutes } from '@umijs/renderer-react';
import { AliveScope } from 'react-activation';

function AliveScopeContainer({ children, history, ...renderRoutesProps }: any) {
  const useRouterComponent = useMemo(() => isBrowser() ? children.type : () => null, [])
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
