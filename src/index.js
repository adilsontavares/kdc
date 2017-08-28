import KeyDistributionCenter from './app/kdc'
import Client from './app/client'

let bob = new Client(1, 'Bob', 'BOB_KEY')
let alice = new Client(2, 'Alice', 'ALICE_KEY')
let kdc = new KeyDistributionCenter([bob, alice])

bob.connectTo(alice)
