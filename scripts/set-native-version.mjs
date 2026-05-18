import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const {version} = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const [major, minor, patch] = version.split('.').map(Number);
const buildNumber = (major * 1_000_000) + (minor * 1_000) + patch;

console.log(`Setting version ${version} (build ${buildNumber})`);

// iOS: project.pbxproj
const pbxprojPath = resolve(root, 'ios/App/App.xcodeproj/project.pbxproj');
const pbxproj = readFileSync(pbxprojPath, 'utf8')
  .replace(/MARKETING_VERSION = .+;/g, `MARKETING_VERSION = ${version};`)
  .replace(/CURRENT_PROJECT_VERSION = .+;/g, `CURRENT_PROJECT_VERSION = ${buildNumber};`);
writeFileSync(pbxprojPath, pbxproj);

// Android: app.properties
const appPropertiesPath = resolve(root, 'android/app/app.properties');
const appProperties = readFileSync(appPropertiesPath, 'utf8')
  .replace(/versionCode=\d+/, `versionCode=${buildNumber}`)
  .replace(/versionName=.+/, `versionName=${version}`);
writeFileSync(appPropertiesPath, appProperties);