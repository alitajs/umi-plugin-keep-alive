// packages/umi-ui/src/detectLanguage.ts
import { IApi } from 'umi-types'
import { existsSync } from 'fs'
import { join } from 'path'

function judgeTS(cwd: IApi['cwd'], { routeComponents }): Boolean {
  if (process.env.DETECT_LANGUAGE) {
    return Boolean(process.env.DETECT_LANGUAGE)
  }

  // 没有 tsconfig.json -> JavaScript
  if (!existsSync(join(cwd, 'tsconfig.json'))) return false

  // 路由文件 ts 占半数以上 -> TypeScript
  const tsFiles = routeComponents.filter(rc => {
    return rc.endsWith('.ts') || rc.endsWith('.tsx')
  })
  if (tsFiles.length >= routeComponents.length / 2) {
    return true
  } else {
    return false
  }
}

export default function isTypeScript(api: IApi): Boolean {
  function getRouteComponents(routes = []) {
    return routes.reduce((memo, route) => {
      if (route.component && !route.component.startsWith('()')) {
        const component = api.winPath(require.resolve(join(api.cwd, route.component)))
        if (!component.includes('src/layout')) {
          memo.push(component)
        }
      }
      if (route.routes) {
        memo = memo.concat(getRouteComponents(route.routes))
      }
      return memo
    }, [])
  }
  const routes = api.getRoutes()

  return judgeTS(api.cwd, {
    routeComponents: getRouteComponents(routes),
  })
}
