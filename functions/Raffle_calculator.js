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

//SeedRNG class uses LCG algorith with appropriate parameter choice for our Application
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
const projectsSample=[
    {
        "SaleEnds": {
            "seconds": 1712725465,
            "nanoseconds": 369000000
        },
        "Name": "Wif",
        "RaiseGoal": 200000,
        "PhotoUrl": "https://firebasestorage.googleapis.com/v0/b/transpad-7f889.appspot.com/o/wif.jfif?alt=media&token=983d05a0-2a11-4c3d-b322-6cab4e55c2c9",
        "Participants": [
            "0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA",
            "0x7d5549df4e94a29660ae30999d2c7fa76542f879"
        ],
        "id": "dXqj6ucB2R33PYbvd5Lu"
    },
    {
        "SaleEnds": {
            "seconds": 1713589297,
            "nanoseconds": 392000000
        },
        "PhotoUrl": "https://firebasestorage.googleapis.com/v0/b/transpad-7f889.appspot.com/o/Original_Doge_meme.jpg?alt=media&token=bcd790b5-647c-40c8-b2a7-40a0d5a4491a",
        "Participants": [
            "0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA",
            "0x7d5549df4e94a29660ae30999d2c7fa76542f879",
            "0xf76a2fa6239fd4d9144f27e94b3a70c73da33698"
        ],
        "RaiseGoal": 100000,
        "Name": "Doge",
        "id": "kkkJSMOKOB9tBKB6L00I"
    },
    {
        "RaiseGoal": 75000,
        "Name": "Pepe",
        "PhotoUrl": "https://firebasestorage.googleapis.com/v0/b/transpad-7f889.appspot.com/o/pepe.jpg?alt=media&token=43efaf4b-eab3-48e3-8de2-65f612cb0770",
        "SaleEnds": {
            "seconds": 1709874097,
            "nanoseconds": 0
        },
        "Participants": [
            "0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA",
            "0x7d5549df4e94a29660ae30999d2c7fa76542f879"
        ],
        "id": "wCRL0SnC1yZSKORjz7O8"
    }
]

const addrs = [
    "0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA",
    "0x7d5549df4e94a29660ae30999d2c7fa76542f879",
    "0x1d5549df4e94a29660ae30999d2c7fa76542f879",
    "0x2d5549df4e94a29660ae30999d2c7fa76542f879",
    "0x3d5549df4e94a29660ae30999d2c7fa76542f879",
    "0x4d5549df4e94a29660ae30999d2c7fa76542f879",
    "0x5d5549df4e94a29660ae30999d2c7fa76542f879",
    "0x6d5549df4e94a29660ae30999d2c7fa76542f879"
  ];
  
//const selectedAddresses = selectKFromNAddresses(addresses, k, merkleRoot);
//console.log(selectedAddresses);

//getMerkleRoot("kkkJSMOKOB9tBKB6L00I",projectsSample);

export { SeededRNG, calculateMerkleRoot as getMerkleRoot, selectKFromNAddresses };
