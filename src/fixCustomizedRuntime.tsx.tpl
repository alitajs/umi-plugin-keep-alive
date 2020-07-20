import * as customizedRuntime from '@/app';

const key = 'rootContainer';

export function rootContainer(container, ...rest) {
  const customizedRootContainer = customizedRuntime[key];
  return typeof customizedRootContainer === 'function' ? customizedRootContainer(container, ...rest) : container;
};
