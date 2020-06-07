var replace = require('replace-in-file');

const options = {
  files: './src/environments/environment.prod.ts',
  from: /version: '(.*)'/g,
  to: (version) => {
    return getNewPatchVersion(version);
  },
};

function getNewPatchVersion(version) {
  var patchRegex = /\d+(?!\.)/g;
  try {
    var patch = parseInt(
      version.match(patchRegex)[0]
    );

    version = version.replace(patchRegex, patch + 1)
  } catch (e) {
  }

  console.log('New ' + version);

  return version;
}

replace.sync(options);
