const core = require('@actions/core');
const {handleBranchesOption, handleDryRunOption} = require('./handleOptions');
const setUpJob = require('./setUpJob.task');
const installSpecifyingVersionSemantic = require('./installSpecifyingVersionSemantic.task');
const preInstallPlugins = require('./preInstallPlugins.task');
const cleanupNpmrc = require('./cleanupNpmrc.task');
const windUpJob = require('./windUpJob.task');

/**
 * Release main task
 * @returns {Promise<void>}
 */
const release = async () => {
  await setUpJob();
  await installSpecifyingVersionSemantic();
  await preInstallPlugins();

  const semanticRelease = require('semantic-release');
  const result = await semanticRelease({
    ...(handleBranchesOption()),
    ...(handleDryRunOption()),
  });

  await cleanupNpmrc();
  await windUpJob(result);
};

module.exports = () => {
  core.debug('Initialization successful');
  release().catch(core.setFailed);
};
