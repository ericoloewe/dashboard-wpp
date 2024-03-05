const builder = require("electron-builder")
const { GitHubPublisher } = require("electron-publish/out/gitHubPublisher")
const { CancellationToken } = require("builder-util-runtime/out/CancellationToken")
const Platform = builder.Platform
const path = require('path');
const { readdir } = require('fs');

require('dotenv').config()


function run() {
  if (process.argv.includes('--publish')) {
    publish();
  } else {
    // Promise is returned
    build();
  }
}

function publish() {
  var pjson = require('./package.json');
  console.log(pjson.version);

  /**
   * @type {import('builder-util-runtime/out/publishOptions').GithubOptions}
   * @see https://www.electron.build/configuration/configuration
  */
  const info = {
    provider: 'github',
    owner: 'ericoloewe',
    repo: 'dashboard-wpp',
    private: true,
  };

  const cancellationToken = new CancellationToken();

  const publisher = new GitHubPublisher({ cancellationToken: cancellationToken }, info, pjson.version, { publish: 'always' });
  const distPath = path.join(__dirname, './dist');

  readdir(distPath, async (err, files) => {
    const releaseFilesPromises = files
      .filter(x => x.includes('dashboard-gestao'))
      .map(x => path.join(distPath, x))
      .map(x => publishFile(publisher, x));

    Promise.all(releaseFilesPromises)
      .then(function (result) {
        console.log(JSON.stringify(result));
      }).catch(console.error);
  });
}

function build() {
  /**
    * @type {import('electron-builder').Configuration}
    * @see https://www.electron.build/configuration/configuration
    */
  const options = {
    extends: null,
    appId: "com.loewe.dashbord",
    // "store" | “normal" | "maximum". - For testing builds, use 'store' to reduce build time significantly.
    compression: "store",
    removePackageScripts: true,
    win: {
      target: 'nsis',
      publish: ['github']
    },
    publish: {
      provider: 'github',
      owner: 'ericoloewe',
      repo: 'dashboard-wpp',
      private: true,
    },
    nsis: { deleteAppDataOnUninstall: true, oneClick: false },
    mac: null,
    target: [
      { target: 'win' },
    ],
    asar: false,
    files: [
      "build/**/*",
      "package.json",
      "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
      "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
      "!**/node_modules/*.d.ts",
      "!**/node_modules/.bin",
      "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
      "!.editorconfig",
      "!**/._*",
      "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
      "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
      "!**/{appveyor.yml,.travis.yml,circle.yml}",
      "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}",
      // "!node_modules",
      // "node_modules/whatsapp-web.js/**/*",
      // "node_modules/electron/**/*",
      // "node_modules/puppeteer/**/*",
      // "node_modules/debug/**/*",
      // "node_modules/ms/**/*",
      // "node_modules/@electron/**/*",
    ],
    includeSubNodeModules: false,
    extraMetadata: {
      main: "build/electron/starter.js"
    }
  };

  builder.build({
    targets: Platform.WINDOWS.createTarget(),
    config: options
  }).then(function (result) {
    console.log(JSON.stringify(result));
  }).catch(console.error);
}

/**
 * 
 * @param {import('electron-publish/out/gitHubPublisher').GitHubPublisher} publisher 
 * @param {string} filePath 
 */
function publishFile(publisher, filePath) {
  /**
  * @type {import('electron-publish').UploadTask}
  */
  const task = {
    file: filePath,
  };

  return publisher.upload(task)
}

run();
