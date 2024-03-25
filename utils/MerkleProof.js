import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import dotenv from 'dotenv';


dotenv.config(); 

const treePath = process.env.TREE_PATH;
console.log(treePath)

// (1)
const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync(treePath, "utf8")));

// (2)
for (const [i, v] of tree.entries()) {
  if (v[0] === '0x3ec596c117117319162895579757839566a7dbbe') {
    // (3)
    const proof = tree.getProof(i);
    console.log('Value:', v);
    console.log('Proof:', proof);
  }
}