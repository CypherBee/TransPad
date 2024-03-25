import * as functions from 'firebase-functions/v2';
//import admin from 'firebase-admin';

// imports for your custom scripts
import {getMerkleRoot, selectKFromNAddresses } from './Raffle_calculator.js';


// Export Cloud Functions

export const select_k_from_n_addresses = functions.https.onCall((request) => {
  return selectKFromNAddresses(request.data.addresses,request.data.k,request.data.merkleRoot);

});

export const calculate_merkleRoot = functions.https.onCall((request) => {
    return getMerkleRoot(request.data);
  });
  