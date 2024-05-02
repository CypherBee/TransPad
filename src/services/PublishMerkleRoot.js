import { JsonRpcProvider, ethers } from "ethers";

//dotenv.config()
const ABI = import.meta.env.VITE_CONTRACT_ABI;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const publishMerkleRoot = async (signer, merkleRoot) => {
  console.log("signer", signer);
  console.log("merkleRoot", merkleRoot);

  const rootStorageContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );
  const tx = await rootStorageContract.addProject(merkleRoot);
  const receipt = await tx.wait();
  console.log(`Project added with Merkle root: ${merkleRoot}`);

  const projectAddedEvent = receipt.logs.find(
    (log) => log.fragment.name === "ProjectAdded"
  );

  // Extract the projectId from the event
  if (projectAddedEvent) {
    const projectId = projectAddedEvent.args[0]; // Convert BigNumber to number
    console.log(
      `Project added with ID: ${projectId} and Merkle root: ${merkleRoot}`
    );
    return projectId;
  } else {
    throw new Error("ProjectAdded event not found");
  }
};

const updateProjectMerkleRoot = async (signer, projectId, newMerkleRoot) => {
  const rootStorageContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );
  const tx = await rootStorageContract.updateProjectMerkleRoot(
    projectId,
    newMerkleRoot
  );
  await tx.wait();
  console.log(
    `Project ${projectId} updated with new Merkle root: ${newMerkleRoot}`
  );
};

// const TESTNET_PRIVATE_KEY=""
// const ALCHEMY_TESTNET_RPC_URL=""
// const provider = new JsonRpcProvider(ALCHEMY_TESTNET_RPC_URL);
// const wallet = new ethers.Wallet(TESTNET_PRIVATE_KEY, provider);
// addProjectMerkleRoot(wallet,"0xe902652B55eC2F7fc255A9598C5719FB3C974c34");
export { publishMerkleRoot, updateProjectMerkleRoot };
