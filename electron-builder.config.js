var builder = require("electron-builder")
var path = require("path")
var Platform = builder.Platform

console.log("HEREE");

// Let's get that intellisense working
/**
* @type {import('electron-builder').Configuration}
* @see https://www.electron.build/configuration/configuration
*/
var options = {
  extends: null,
  appId: "com.loewe.dashbord",
  // "store" | “normal" | "maximum". - For testing builds, use 'store' to reduce build time significantly.
  compression: "store",
  removePackageScripts: true,
  win: { target: 'nsis' },
  nsis: { deleteAppDataOnUninstall: true },
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



// Promise is returned
builder.build({
  targets: Platform.WINDOWS.createTarget(),
  config: options
}).then(function (result) {
  console.log(JSON.stringify(result));
}).catch(console.error);
