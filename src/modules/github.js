// ****************************************************************************************************
// Init
// ****************************************************************************************************

// dependencies
import { graphql as QL } from '@octokit/graphql';
import Rest from '@octokit/rest';
import { uniq, compact } from 'lodash';

// local dependencies
import { map } from './common';

// ****************************************************************************************************
// Shared Functions
// ****************************************************************************************************

async function readGithub(token) {
  return QL(
    `query readGithub {
      user: viewer {
        repositories(affiliations: [OWNER], first: 100) {
          nodes {
            url
            id
            name
            package: object(expression: "master:package.json") { ... on Blob { text } }
          }
        }
      }
    }`,
    {
      headers: {
        authorization: `token ${token}`
      }
    }
  ).then((resp) => resp.user.repositories.nodes);
}

async function updateGithub(token, repo) {
  return QL(
    `mutation updateGithub ($input: UpdateRepositoryInput!) {
      updateRepository(input: $input) {
        repository {
          url
          id
          name
          package: object(expression: "master:package.json") { ... on Blob { text } }
        }
      }
    }`,
    {
      headers: {
        authorization: `token ${token}`
      },
      input: {
        repositoryId: repo.id,
        name: repo.name
      }
    }
  ).then((resp) => resp.updateRepository.repository);
}

function formatRepo(repoObj) {
  const repoPath = repoObj.url;
  const repoId = repoObj.id;
  const repoName = repoObj.name;
  const packageObj = repoObj.package && repoObj.package.text ? JSON.parse(repoObj.package.text) : {};
  const aliases = uniq(compact([repoObj.name, packageObj.name, repoId]));
  return {
    type: 'github',
    id: repoId,
    name: repoName,
    path: repoPath,
    package: packageObj,
    aliases
  };
}

// ****************************************************************************************************
// Export Functions
// ****************************************************************************************************

// Create
export async function create(token, repo) {
  // test
}

// Read
export async function load(token) {
  const repoObjs = await readGithub(token);
  return map(repoObjs, (repoObj) => formatRepo(repoObj), true);
}

// Update
export async function update(token, repo) {
  const repoObj = await updateGithub(token, repo);
  return formatRepo(repoObj);
}

// Delete
export async function remove(token) {
  // test
}
