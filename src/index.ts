import { IApi } from "umi-types";

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
