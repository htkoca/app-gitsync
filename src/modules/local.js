// ****************************************************************************************************
// Init
// ****************************************************************************************************

// dependencies
import { join, dirname, basename } from 'path';
import fs from 'fs-extra';
import glob from 'fast-glob';
import git from 'simple-git/promise';
import { uniq, compact } from 'lodash';

// local dependencies
import { mapAsync, posixPath } from './common';

// ****************************************************************************************************
// Shared Functions
// ****************************************************************************************************

async function readLocal(srcDir) {
  return glob('**/.git', {
    cwd: posixPath(srcDir),
    ignore: ['**/{.git,node_modules}/**/*'],
    onlyDirectories: true,
    absolute: true
  }).then((repoPaths) => {
    return mapAsync(repoPaths, (repoPath) => git(dirname(repoPath, '.git')).silent(true));
  });
}

async function updateNameLocal(repo) {
  const newPath = join(dirname(repo.path), '/', repo.name);
  await fs.rename(repo.path, newPath);
  return git(newPath).silent(true);
}

async function formatRepo(repoObj) {
  const repoPath = await repoObj.revparse(['--absolute-git-dir']).then((data) => dirname(data));
  const repoId = '';
  const repoName = basename(repoPath);
  const packageObj = await repoObj
    .show([`master:package.json`])
    .then((data) => JSON.parse(data))
    .catch(() => ({}));
  const readmeStr = await repoObj
    .show([`master:README.md`])
    .then((data) => data.toString())
    .catch(() => '');
  const status = await repoObj.status();
  const remotes = await repoObj.getRemotes(true);
  const remoteNames = remotes.map((remote) => (basename(remote.refs.fetch, '.git') !== 'repository' ? basename(remote.refs.fetch, '.git') : null));
  const aliases = uniq(compact([basename(repoPath), packageObj.name, repoId, ...remoteNames]));
  return {
    type: 'local',
    id: repoId,
    name: repoName,
    path: repoPath,
    package: packageObj,
    readme: readmeStr,
    remotes,
    status,
    aliases
  };
}

// ****************************************************************************************************
// Export Functions
// ****************************************************************************************************

// Create
export async function create(repo) {
  // test
}

// Read
export async function load(srcDir) {
  const repoObjs = await readLocal(srcDir);
  return mapAsync(repoObjs, (repoObj) => formatRepo(repoObj));
}

// Update
export async function updateName(repo) {
  const repoObj = await updateNameLocal(repo);
  return formatRepo(repoObj);
}

// Delete
export async function remove() {
  // test
}
