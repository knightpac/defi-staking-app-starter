

const RWD = artifacts.require('RWD')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', (accounts) => {
    let tether, rwd

    // This code runs before any tests/descriptions.
    before( async () => {
        tether = await Tether.new()
        rwd = await RWD.new()
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token') 
        })
    })
    
    
    describe('RWD Deployment', async () => {
        it('matches name successfully', async () => {
            
            const name = await rwd.name()
            assert.equal(name, 'Reward Token') 
        })
    }) 

}) 
