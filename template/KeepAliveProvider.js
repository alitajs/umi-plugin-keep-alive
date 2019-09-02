import React from 'react';
import { Provider as KeepAliveProvider } from 'react-keep-alive';

const KeepAliveContext = ({ children }) => {
  return <KeepAliveProvider>{children}</KeepAliveProvider>;
};

export default KeepAliveContext;
