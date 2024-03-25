import  {JsonRpcProvider,ethers}  from 'ethers';

//dotenv.config()
const ABI=[{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":false,"internalType":"string","name":"newMerkleRoot","type":"string"}],"name":"MerkleRootUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":false,"internalType":"string","name":"merkleRoot","type":"string"}],"name":"ProjectAdded","type":"event"},{"inputs":[{"internalType":"string","name":"merkleRoot","type":"string"}],"name":"addProject","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMerkleRoots","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"projectId","type":"uint256"}],"name":"getProjectMerkleRoot","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"projectCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"projects","outputs":[{"internalType":"string","name":"merkleRoot","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"projectId","type":"uint256"},{"internalType":"string","name":"merkleRoot","type":"string"}],"name":"updateProjectMerkleRoot","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const CONTRACT_ADDRESS = "0xe902652B55eC2F7fc255A9598C5719FB3C974c34"

const publishMerkleRoot = async (signer,merkleRoot) => {
    console.log("signer",signer)
    console.log("merkleRoot",merkleRoot)

    const rootStorageContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await rootStorageContract.addProject(merkleRoot);
    const receipt= await tx.wait();
    console.log(`Project added with Merkle root: ${merkleRoot}`);

    const projectAddedEvent = receipt.logs.find(
        (log) => log.fragment.name === 'ProjectAdded'
      );

    // Extract the projectId from the event
    if (projectAddedEvent) {
        const projectId = projectAddedEvent.args[0]; // Convert BigNumber to number
        console.log(`Project added with ID: ${projectId} and Merkle root: ${merkleRoot}`);
        return projectId;
      } else {
        throw new Error('ProjectAdded event not found');
      }
};

const updateProjectMerkleRoot = async (signer,projectId, newMerkleRoot) => {
    const rootStorageContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await rootStorageContract.updateProjectMerkleRoot(projectId, newMerkleRoot);
    await tx.wait();
    console.log(`Project ${projectId} updated with new Merkle root: ${newMerkleRoot}`);
};

// const TESTNET_PRIVATE_KEY="86ca623bd668e9ae2210996da95b945b4e9bbfe4808481b844b20316b8381804"
// const ALCHEMY_TESTNET_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/6UFMdV_kkQBCIM0GENrOZPvF0GfiK3YY"
// const provider = new JsonRpcProvider(ALCHEMY_TESTNET_RPC_URL);
// const wallet = new ethers.Wallet(TESTNET_PRIVATE_KEY, provider);
// addProjectMerkleRoot(wallet,"0xe902652B55eC2F7fc255A9598C5719FB3C974c34");
export { publishMerkleRoot, updateProjectMerkleRoot };




