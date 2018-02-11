const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    
    createGenesisBlock() {
        return new Block(0, '01/01/2018', 'Genesis block', '0');
    }
    
    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }
    
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash; //sets the newblock's previous hash to the last block's hash
        newBlock.hash = newBlock.calculateHash(); //calculates the hash of the new block
        this.chain.push(newBlock); //push the newblock to the chain
    }
    
    //checks the chain for tampering 
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            
            if(previousBlock.hash !== previousBlock.calculateHash()) {
                return false;
            }
        }
        
        return true;
    }
}

let myCoin = new Blockchain();
myCoin.addBlock(new Block(1, '05/01/2018', { amount: 200 }));
myCoin.addBlock(new Block(2, '25/01/2018', { amount: 400 }));

console.log(JSON.stringify(myCoin, null, 4));
console.log('Validity: ' + myCoin.isChainValid());

myCoin.chain[1].data = {amount: 999};

console.log('Validity after tampering: ' + myCoin.isChainValid());