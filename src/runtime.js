import React from 'react';

export function rootContainer(container) {
  const KeepAliveProvider = require('@tmp/KeepAliveProvider').default;
  return React.createElement(KeepAliveProvider, null, container);
}
