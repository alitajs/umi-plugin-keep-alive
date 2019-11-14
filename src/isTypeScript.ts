// packages/umi-ui/src/detectLanguage.ts
import { existsSync } from 'fs';
import { join } from 'path';

export default function (cwd, { routeComponents }) {
  if (process.env.DETECT_LANGUAGE) {
    return process.env.DETECT_LANGUAGE;
  }

  // 没有 tsconfig.json -> JavaScript
  if (!existsSync(join(cwd, 'tsconfig.json'))) return false;

  // 路由文件 ts 占半数以上 -> TypeScript
  const tsFiles = routeComponents.filter(rc => {
    return rc.endsWith('.ts') || rc.endsWith('.tsx');
  });
  if (tsFiles.length >= routeComponents.length / 2) {
    return true;
  } else {
    return false;
  }
}
