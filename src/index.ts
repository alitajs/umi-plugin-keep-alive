import { IApi } from "umi-types";
import isTypeScript from "./isTypeScript";
import assert from 'assert'
import fs from 'fs'
import { join } from 'path'
import get from 'lodash/get'

export default (api: IApi) => {
  // .umi/route.js 中加入 import wrapChildrenWithAliveScope from 'umi-plugin-keep-alive/lib/wrapChildrenWithAliveScope' 语句
  api.addRouterImport({
    source: "umi-plugin-keep-alive/lib/wrapChildrenWithAliveScope",
    specifier: `wrapChildrenWithAliveScope`
  });

  // 使 AliveScope 嵌于 Router 与其 children 之间
  const currentModifyRouterRootComponent = api.applyPlugins(
    "modifyRouterRootComponent"
  );
  api.modifyRouterRootComponent(
    `wrapChildrenWithAliveScope(${currentModifyRouterRootComponent})`
  );

  // 生成：export * from 'react-activation'
  // 业务中可 import { KeepAlive } from 'umi'
  api.addUmiExports([
    {
      exportAll: true,
      source: "react-activation"
    }
  ]);


  function getRouteComponents(routes = []) {
    return routes.reduce((memo, route) => {
      if (route.component && !route.component.startsWith('()')) {
        const component = api.winPath(require.resolve(join(api.cwd, route.component)));
        if (!component.includes('src/layout')) {
          memo.push(component);
        }
      }
      if (route.routes) {
        memo = memo.concat(getRouteComponents(route.routes));
      }
      return memo;
    }, []);
  }



  api.modifyAFWebpackOpts(memo => {
    // 探测 tsconfig.json 中的 compilerOptions.jsx 是否为 react
    // 此值之下 ts 将编译 react jsx 语法，破坏 react-activation/babel 插件的处理过程将导致 KeepAlive 效果不稳定
    // 在此告警
    const routes = api.getRoutes()
    const isTs = isTypeScript(api.cwd, {
      routeComponents: getRouteComponents(routes),
    })
    if (isTs) {
      const tsConfigFile = memo.tsConfigFile || join(get(memo, 'cwd', {}), 'tsconfig.json')
      const origTsConfig = JSON.parse(String(fs.readFileSync(tsConfigFile))) as object
      const typescript = {
        ...origTsConfig,
        compilerOptions: {
          ...get(origTsConfig, 'compilerOptions', {}),
          ...get(memo, 'typescript.compilerOptions', {}),
        },
        ...(memo.typescript || {}),
      }

      assert(
        get(typescript, 'compilerOptions.jsx') !== 'react',
        'Will cause unstable `<KeepAlive>` effect while `tsConfig.compilerOptions.jsx` is "react", use "preserve" instead. Ref: https://github.com/CJY0208/react-activation/issues/8',
      )

      // 注入 babel 插件 react-activation/babel
      const extraBabelPlugins = [...(memo.extraBabelPlugins || []), ...['react-activation/babel']]

      return {
        ...memo,
        extraBabelPlugins,
      }

    }
    return memo;
  })

  api.modifyAFWebpackOpts(memo => {
    // 注入 babel 插件 react-activation/babel
    const extraBabelPlugins = [
      ...(memo.extraBabelPlugins || []),
      ...["react-activation/babel"]
    ];

    return {
      ...memo,
      extraBabelPlugins
    };
  });
};
