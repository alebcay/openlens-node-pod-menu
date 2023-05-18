/* eslint-env es6 */

const https = require('https');
const semver = require('semver');

async function nodeVersionFromPackageJson(url) {
  return new Promise((resolve) => {
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        if (resp.statusCode >= 400) {
          resolve(undefined);
        } else {
          let packagejson = JSON.parse(data);
          resolve(packagejson.engines?.node);
        }
      });
    }).on('error', (e) => {
      console.error(e);
    });
  });
}

async function nodeVersionFromOldTag(tag) {
  let url = 'https://raw.githubusercontent.com/lensapp/lens/refs/tags/' + tag + '/package.json';
  return nodeVersionFromPackageJson(url);
}

async function nodeVersionFromNewTag(tag) {
  let url = 'https://raw.githubusercontent.com/lensapp/lens/refs/tags/' + tag + '/packages/open-lens/package.json'
  return nodeVersionFromPackageJson(url);
}

async function nodeVersionFromHead() {
  let url = 'https://raw.githubusercontent.com/lensapp/lens/HEAD/packages/open-lens/package.json'
  return nodeVersionFromPackageJson(url);
}

async function nodeVersionFromRef(tag) {
  return new Promise((resolve) => {
    if (tag === 'HEAD') {
      resolve(nodeVersionFromHead());
    } else {
      nodeVersionFromNewTag(tag).then((newValue) => {
        if (newValue == undefined) {
          resolve(nodeVersionFromOldTag(tag));
        } else {
          resolve(newValue);
        }
      });
    }
  });
}

async function getTags() {
  const options = {
    hostname: 'api.github.com',
    path: '/repos/lensapp/lens/git/refs/tags',
    headers: {
      'User-Agent': 'GenerateTestMatrixFromTags/1.0',
      'Accept': 'application/vnd.github+json'
    }
  };

  return new Promise((resolve) => {
    https.get(options, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        let tags = JSON.parse(data).map((tag) => tag.ref).map((ref) => ref.replace('refs/tags/', ''));
        resolve(tags);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  });
}

(async function() {
  let testConstraints = JSON.parse(process.env.TEST_CONSTRAINTS);
  if (process.env.TEST_HEAD_REF === '1') {
    testConstraints.unshift('HEAD');
  }
  let tags = await getTags();

  let matrix = await Promise.all(testConstraints.map((constraint) => {
    return new Promise((resolve) => {
      let tag = constraint === 'HEAD' ? 'HEAD' : semver.maxSatisfying(tags, constraint);
      let entry = { 'lens-ref': tag };
      nodeVersionFromRef(tag).then((nodeEngineVersion) => {
        entry['node-version'] = nodeEngineVersion;
        resolve(entry);
      });
    });
  }));
  process.stdout.write(JSON.stringify(matrix));
})();
