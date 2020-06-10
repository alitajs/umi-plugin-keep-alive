import { IApi, utils } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';

export default (api: IApi) => {
  api.addRuntimePlugin({
    fn: () => '../plugin-keep-alive/runtime',
    stage: -1 * Number.MAX_SAFE_INTEGER,
  });

  // Babel Plugin for react-activation
  api.modifyBabelOpts(babelOpts => {
    babelOpts.plugins.push([require.resolve('react-activation/babel')]);
    return babelOpts;
  });

  // 生成：export * from 'react-activation'
  // 业务中可 import { KeepAlive } from 'umi'
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: 'react-activation',
    },
  ]);

  api.onGenerateFiles(async () => {
    api.writeTmpFile({
      path: 'plugin-keep-alive/runtime.tsx',
      content: utils.Mustache.render(
        readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
        {},
      ),
    });
  });
};
