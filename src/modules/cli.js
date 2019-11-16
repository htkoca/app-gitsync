// ****************************************************************************************************
// Init
// ****************************************************************************************************

// dependencies
import inquirer from 'inquirer';

// ****************************************************************************************************
// Export Functions
// ****************************************************************************************************

export const log = function log(...messages) {
  console.log(...messages);
};

export const ask = async function ask(prefix, message, choices) {
  return inquirer
    .prompt({
      type: 'rawlist',
      name: 'answer',
      message,
      prefix,
      choices: [...choices.map((choice) => ({ name: choice, value: choice[0] })), new inquirer.Separator(), { name: 'skip', value: 's' }],
      default: 's'
    })
    .then((response) => response.answer);
};
