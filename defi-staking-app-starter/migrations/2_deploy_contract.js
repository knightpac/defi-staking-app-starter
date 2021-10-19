const Tether = artifacts.require('Tether');
const DecentralBank = artifacts.require('DecentralBank');
const RWD = artifacts.require('RWD');

module.exports = async function(deployer, network, accounts) {
    // Deploy mock tether contract
    await deployer.deploy(Tether)
    const tether = await Tether.deployed()

    // Deploy Reward Token Contract
    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    // Deploy Decentral Bank Contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address)
    const decentralBank = await DecentralBank.deployed()

    // Transfer all RWD tokens to the Decentral bank
    await rwd.transfer(decentralBank.address, '1000000000000000000000000')

    // Distribute 100 Mock Tether tokens to investor
    await tether.transfer(accounts[1], '100000000000000000000')
};

