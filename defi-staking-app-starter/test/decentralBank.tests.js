


const RWD = artifacts.require('RWD')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    // function converts token numbers to wei
    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    // This code runs before any tests/descriptions.
    before( async () => {
        
        // Load Contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all tokens to decetral bank
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer 100 mock tether tokens to Investor accounts[1]
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token') 
        })
    })
    
    
    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            
            const name = await rwd.name()
            assert.equal(name, 'Reward Token') 
        })
    }) 

    // Test to see if tokens have been issued to decentral bank

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank') 
        })

        // make sure there are tokens in bank
        it('Contract has tokens issued', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))

        })

    })
    
    describe('Yield Farming', async () => {
        it('rewards tokens for staking', async () => {
            let result
            
            // Check investor balance
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock tether balance before staking')
            
            // Check Staking for Customer of 100 tokens
            await tether.Approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            // Check updated balance of Customer and make sure its 0 after staking 100 tokens--ERROR START
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'), 'Customer mock wallet balance after staking 100 tokens')

            // Check updated balance of decentral bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'Decentral Bank wallet balance after staking from customer')

            // Is staking update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true', 'Customer is staking status after staking to be true')

            // Issue Tokens
            await decentralBank.issueTokens({from: owner})

            // Only Owner May Issue Tokens
            await decentralBank.issueTokens({from: customer}).should.be.rejected;

            // Unstake Tokens
            await decentralBank.unstakeTokens({from: customer})

            // ****Check unstaking Balances*****
            
                // Check updated balance of Customer and make sure its 0 after staking 100 tokens--ERROR START
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'Customer mock wallet balance after unstaking')

                // Check updated balance of decentral bank
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'Decentral Bank wallet balance after unstaking from customer')

                // Is staking balance
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'false', 'Customer is staking status after unstaking to be false')


        })



    })  // End of Yield Farming Block  



    

}) 
