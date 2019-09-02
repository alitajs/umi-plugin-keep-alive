import { join } from 'path';
import { readFileSync } from 'fs';

export default function (api, options) {

  function generateContext() {
    const tpl = join(__dirname, '../template/KeepAliveProvider.js');
    const tplContent = readFileSync(tpl, 'utf-8');
    api.writeTmpFile('KeepAliveProvider.js', tplContent);
  }

  api.onGenerateFiles(() => {
    generateContext();
  });

  api.addRuntimePlugin(join(__dirname, './runtime'));
}
