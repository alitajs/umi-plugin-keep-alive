import { utils } from 'umi'
import { join } from 'path'
import { readFileSync } from 'fs'
// import { getFile } from '@umijs/utils'

export default (api) => {
  api.addRuntimePlugin({
    fn: () => '@@/plugin-keep-alive/runtime',
    stage: -1 * Number.MAX_SAFE_INTEGER,
  })

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
  //         content: utils.Mustache.render(
  //           readFileSync(join(__dirname, 'fixCustomizedRuntime.tsx.tpl'), 'utf-8'),
  //           {},
  //         ),
  //       })
  //     })
  //   }

  // Babel Plugin for react-activation
  const babelOpt = [[require.resolve('react-activation/babel')]]
  if (api.modifyBabelOpts && typeof api.modifyBabelOpts === 'function') {
    api.modifyBabelOpts((babelOpts) => {
      babelOpts.plugins.push(babelOpt)
      return babelOpts
    })
  }

  if (api.addExtraBabelPlugins && typeof api.addExtraBabelPlugins === 'function') {
    api.addExtraBabelPlugins(() => babelOpt)
  }
  // 生成：export * from 'react-activation'
  // TODO: 指明支持的 api，使用上述方式存在 bug https://github.com/guybedford/es-module-lexer/issues/76
  // 业务中可 import { KeepAlive } from 'umi'
  api.addUmiExports(() => [
    {
      specifiers: [
        'KeepAlive',
        'useActivate',
        'useUnactivate',
        'withActivation',
        'withAliveScope',
        'useAliveController',
      ],
      source: 'react-activation',
    },
  ])

  api.onGenerateFiles(async () => {
    api.writeTmpFile({
      path: 'plugin-keep-alive/runtime.tsx',
      content: utils.Mustache.render(readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'), {}),
    })
  })
}
