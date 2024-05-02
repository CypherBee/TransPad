import { buildMerkleTreeFromArray } from "./MerkleRoot.js";

//getting the Merkle Tree
//-----------------------//
async function calculateMerkleRoot(participantsList) {
  const merkleRoot = await buildMerkleTreeFromArray(participantsList);
  console.log("MerkleRoot From raffle:" + merkleRoot);
  return merkleRoot;
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
    return (this.seed = (this.seed * 16807) % 2147483647);
  }

  nextFloat() {
    return (this.next() - 1) / 2147483646;
  }
}

function selectKFromNAddresses(addresses, k, merkleRoot) {
  if(k > addresses.length) {
    throw new Error("k cannot be greater than the number of addresses");
  }

  const selectedAddresses = new Set();
  const seed = parseInt(merkleRoot, 16); // Assuming merkleRoot is a hex string
  const rng = new SeededRNG(seed);

  while (selectedAddresses.size < k) {
    const index = Math.floor(rng.nextFloat() * addresses.length);
    selectedAddresses.add(addresses[index]);
  }

  return Array.from(selectedAddresses);
}
//-------------------------------------//

export {
  SeededRNG,
  calculateMerkleRoot as getMerkleRoot,
  selectKFromNAddresses,
};
