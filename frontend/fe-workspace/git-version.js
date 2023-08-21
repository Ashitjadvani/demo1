const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

const gitInfo = gitDescribeSync({
    dirtyMark: false,
    dirtySemver: false
});

gitInfo.version = version;

console.log('git-version: ', gitInfo);

let buildVersionFile = (projectName) => {
    const file = resolve(__dirname, '.', 'projects', projectName, 'src', 'environments', 'version.ts');

    writeFileSync(file,
        `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
        export const VERSION = '3.0.${gitInfo.hash}';
        `, { encoding: 'utf-8' });

    console.log(`git-version done for: ${projectName} version: ${gitInfo.hash}`);
}

buildVersionFile('fe-app');
buildVersionFile('fe-insights');
buildVersionFile('fe-touchpoint');
buildVersionFile('fe-graphs');
