import {
  join
} from 'path'
import {
  readFileSync,
} from 'fs'
import {
  Mustache
} from '@umijs/utils';

const Encoding = 'utf-8';

export default (api) => {
  // 通过新增方法判断umi4
  const isUmi4 = typeof api.modifyAppData === 'function';

  if (isUmi4) {
    // umi@4 自动生成插件目录
    api.addRuntimePlugin({
      fn: () => '@@/plugin-keepAlive/runtime',
      stage: -1 * Number.MAX_SAFE_INTEGER,
    })
  } else {
    api.addRuntimePlugin({
      fn: () => '@@/plugin-keep-alive/runtime',
      stage: -1 * Number.MAX_SAFE_INTEGER,
    })
  }

  //   // 因 keep-alive 的 runtime 部分选择不渲染其 children，可能会丢失默认的用户 rootContainer
  //   // 此处修复自定义 rootContainer
  //   // https://github.com/umijs/umi/blob/master/packages/preset-built-in/src/plugins/generateFiles/core/plugin.ts#L23-L27
  //   const customizedAppPath = getFile({
  //     base: api.paths.absSrcPath,
  //     fileNameWithoutExt: 'app',
  //     type: 'javascript',
  //   })?.path

  //   if (customizedAppPath) {
  //     api.addRuntimePlugin({
  //       fn: () => '@@/plugin-keep-alive/fixCustomizedRuntime',
  //       stage: -1 * Number.MAX_SAFE_INTEGER + 1,
  //     })

  //     api.onGenerateFiles(async () => {
  //       api.writeTmpFile({
  //         path: 'plugin-keep-alive/fixCustomizedRuntime.tsx',
  //         content: Mustache.render(
  //           readFileSync(join(__dirname, 'fixCustomizedRuntime.tsx.tpl'), Encoding),
  //           {},
  //         ),
  //       })
  //     })
  //   }

  // Babel Plugin for react-activation
  const babelOpt = [require.resolve('react-activation/babel')]
  if (typeof api.modifyBabelOpts === 'function') {
    api.modifyBabelOpts((babelOpts) => {
      babelOpts.plugins.push(babelOpt)
      return babelOpts
    })
  }

  if (typeof api.addExtraBabelPlugins === 'function') {
    api.addExtraBabelPlugins(() => [babelOpt])
  }
  // 生成：export * from 'react-activation'
  // TODO: 指明支持的 api，使用上述方式存在 bug https://github.com/guybedford/es-module-lexer/issues/76
  // 业务中可 import { KeepAlive } from 'umi'
  if (isUmi4) {
    // umi@4 需要通过插件文件进行自动导出
    api.onGenerateFiles(async () => {
      api.writeTmpFile({
        path: 'index.ts',
        content: Mustache.render(readFileSync(join(__dirname, 'index.ts.tpl'), Encoding), {}),
      })
      api.writeTmpFile({
        path: 'runtime.tsx',
        content: Mustache.render(readFileSync(join(__dirname, 'runtime.tsx.tpl'), Encoding), {}),
      })
    })
  } else {
    api.addUmiExports(() => [{
      specifiers: [
        'KeepAlive',
        'useActivate',
        'useUnactivate',
        'withActivation',
        'withAliveScope',
        'useAliveController',
      ],
      source: 'react-activation',
    }, ])

    api.onGenerateFiles(async () => {
      api.writeTmpFile({
        path: 'plugin-keep-alive/runtime.tsx',
        content: Mustache.render(readFileSync(join(__dirname, 'runtime.tsx.tpl'), Encoding), {}),
      })
    })
  }
}