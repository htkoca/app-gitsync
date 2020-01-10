// ****************************************************************************************************
// Init
// ****************************************************************************************************

// dependencies
import dotenv from 'dotenv';
import commander from 'commander';

// local dependencies
import Local from '../services/Local';
import Github from '../services/Github';
import Cli from '../services/Cli';

// ****************************************************************************************************
// Shared Functions
// ****************************************************************************************************

function getEnvCfg() {
  return dotenv.config().parsed || {};
}

function getArgCfg() {
  const program = new commander.Command();
  return (
    program
      .option('-d, --dryrun', 'dryrun, does not make any changes')
      .option('-s, --small', 'small pizza size')
      .option('-p, --pizza-type <type>', 'flavour of pizza')
      .parse(process.argv) || {}
  );
}

// ****************************************************************************************************
// Export Functions
// ****************************************************************************************************

export default class Tasks {
  constructor() {
    this.cfg = {
      ...getEnvCfg(),
      ...getArgCfg()
    };
    this.github = new Github(this.cfg);
    this.local = new Local(this.cfg);
    this.cli = new Cli(this.cfg);
  }
  async start() {
    let repos = {};
    repos = await this.loadRepos(repos);
    // repos = await this.checkStatus(repos);
    // repos = await this.syncRepos(repos);
    // repos = await this.updateMeta(repos);
  }
  async loadRepos() {
    this.cli.log('[load]', 'loading local repos');
    const localRepos = await this.local.readAll((repo) => {
      this.cli.log('[load]', 'load - local repo:', repo.name);
    });
    this.cli.log('[load]', 'loading github repos');
    const githubRepos = await this.github.readAll((repo) => {
      this.cli.log('[load]', 'load - github repo:', repo.name);
    });
  }
}
