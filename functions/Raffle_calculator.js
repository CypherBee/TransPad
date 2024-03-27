import {buildMerkleTreeFromArray} from '../utils/MerkleRoot.js';


//getting the Merkle Tree
//-----------------------//
async function calculateMerkleRoot(participantsList){
    const merkleRoot= await buildMerkleTreeFromArray(participantsList)
    console.log("MerkleRoot From raffle:"+ merkleRoot)
    return merkleRoot
}
//-----------------------//


//getting the Winners from the Merkle Root
//-----------------------//

//SeedRNG class uses LCG algorithm with appropriate parameter choice for our Application
// m=2^31-1, a=16807=7^5, c=0.


class SeededRNG {
    constructor(seed) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    next() {
        return this.seed = this.seed * 16807 % 2147483647;
    }

    nextFloat() {
        return (this.next() - 1) / 2147483646;
    }
}

function selectKFromNAddresses(addresses, k, merkleRoot) {
    const selectedAddresses = new Set();
    const seed = parseInt(merkleRoot, 16); // Assuming merkleRoot is a hex string
    const rng = new SeededRNG(seed);

    while (selectedAddresses.size < k) {
        const index = Math.floor(rng.nextFloat() * addresses.length);
        selectedAddresses.add(addresses[index]);
    }

    return Array.from(selectedAddresses);
}


// Testing Constants
const addresses = ['0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA', '0xd685F9A87f5Cbd534824BF1dea581a8DE083f3DA', '0xd685F9A87f5Cbd534824BF1dea581a8DE083f4DA', '0xd685F9A87f5Cbd534824BF1dea581a8DE083f5DA', '0xd685F9A87f5Cbd534824BF1dea581a8DE083f6DA']; // Replace with actual addresses
const k = 2;
const merkleRoot = '0x3f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632'; 


//const selectedAddresses = selectKFromNAddresses(addresses, k, merkleRoot);
//console.log(selectedAddresses);
//getMerkleRoot("kkkJSMOKOB9tBKB6L00I",projectsSample);

export { SeededRNG, calculateMerkleRoot as getMerkleRoot, selectKFromNAddresses };
