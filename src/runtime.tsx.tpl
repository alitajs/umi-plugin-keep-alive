import React from 'react';
import { Router } from 'umi';
import { renderRoutes } from '@umijs/renderer-react';
import { AliveScope } from 'react-activation';

function AliveScopeContainer({ children, history, ...renderRoutesProps }: any) {
  const useRouterComponent = children.type;
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
