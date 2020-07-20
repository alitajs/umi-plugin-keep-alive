import * as customizedRuntime from '@/app';

export function rootContainer(container, ...rest) {
  const customizedRootContainer = customizedRuntime.rootContainer;
  return typeof customizedRootContainer === 'function' ? customizedRootContainer(container, ...rest) : container;
};
