const Tether = artifacts.require('Tether');
const DecentralBank = artifacts.require('DecentralBank');
const RWD = artifacts.require('RWD');

module.exports = async function(deployer) {
    // Deploy mock tether contract
    await deployer.deploy(Tether)

    // Deploy Decentral Bank Contract
    await deployer.deploy(DecentralBank)

    // Deploy Reward Token Contract
    await deployer.deploy(RWD)
};

