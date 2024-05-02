import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { app } from "../../firebase.js";

const functions = getFunctions(app);

connectFunctionsEmulator(functions, "localhost", 5001);
const selectKFromNAddressesFn = httpsCallable(
  functions,
  "select_k_from_n_addresses"
);
const addProject = httpsCallable(functions, "calculate_merkleRoot");
const getMerkleRoot = httpsCallable(functions, "calculate_merkleRoot");

const addresses = [
  "0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA",
  "0xd685F9A87f5Cbd534824BF1dea581a8DE083f3DA",
  "0xd685F9A87f5Cbd534824BF1dea581a8DE083f4DA",
  "0xd685F9A87f5Cbd534824BF1dea581a8DE083f5DA",
  "0xd685F9A87f5Cbd534824BF1dea581a8DE083f6DA",
];
const k = 3;

async function callAddProject(addresses) {
  try {
    const result = await addProject(addresses);
    console.log("AddProject Result:", result);
    return result.data; // Assuming the necessary data is in result.data
  } catch (error) {
    console.error("Error in addProject:", error);
  }
}

async function callSelectKFromNAddresses(addresses, k, merkleRoot) {
  try {
    const result = await selectKFromNAddressesFn({ addresses, k, merkleRoot });
    console.log("SelectKFromNAddresses Result:", result.data);
    return result.data; // Assuming the necessary data is in result.data
  } catch (error) {
    console.error("Error in selectKFromNAddresses:", error);
  }
}

// Example usage:
async function executeCalls() {
  const merkleRoot = await callAddProject(addresses);
  // You can now use projectResult for further logic if needed

  const winnersList = await callSelectKFromNAddresses(addresses, k, merkleRoot);
  // You can now use winnersList for further logic if needed
}

executeCalls(); // Initiates the function calls
