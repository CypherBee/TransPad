import { StandardMerkleTree,SimpleMerkleTree } from "@openzeppelin/merkle-tree";
import {keccak256} from '@ethersproject/keccak256';
import path from 'path';



// if we want to read a file from the arguments enable these two lines.
// const csvFilePath = process.argv[2];
// console.log(csvFilePath);

function printFileContents(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err); 
        return;
      }
      resolve(data); 

  });
  });
}

// Convert the read data to the Array that will be fed to the Standard Merkle Tree
function csvToArray(csvString) {
  const rows = csvString.split("\n"); 
  const values = [];

  for (let i = 1; i < rows.length; i++) { // Process all rows (no header check)
     if (rows[i].trim() === "") continue;
    const row = rows[i].split(","); 
    const address = row[0].trim(); 
    const balanceBN =  parseInt(row[1].replace(/,/g, ""));

    values.push([address, balanceBN]); 
  }

  return values;
}

// Build the merkle tree. Set the encoding to match the values.
async function buildMerkleTreeFromCsv(csv)
{
  const csvData=await printFileContents(csv)
  const array=csvToArray(csvData)
  const tree=  StandardMerkleTree.of(array, ["address", "uint256"]);
  const treeFilePath = path.join(import.meta.dirname, "../../lib/tree_" +tree.root+".json");
  fs.writeFileSync(treeFilePath, JSON.stringify(tree.dump()));
  console.log('Merkle Root:', tree.root);
  return(tree.root)
}

export async function buildMerkleTreeFromArray(obj)
{
  console.log(obj)
  const hashedArray=obj.map((e)=>keccak256(e))
  const tree=SimpleMerkleTree.of(hashedArray, ["address", "uint256"]);
  console.log('Merkle Root:', tree.root,tree);
  return(tree.root)
}


//buildMerkleTreeFromArray(["0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA","0x7d5549df4e94a29660ae30999d2c7fa76542f879"])

// if we want to read a file from the arguments enable these two lines.
// if (csvFilePath) {
//   await buildMerkleTreeFromCsv(csvFilePath)
// } else {
//   //Handle the case where no CSV file is provided or handle list input
//   console.log("No CSV file path provided." + " file found:"+ csvFilePath);
// }
