# Raffle Application
![image](https://github.com/CypherBee/TransPad/assets/99687146/cdceff97-5d84-4f6f-b731-24ba06480381)

# Live Demo:
https://trans-pad.vercel.app/

# Prequisites
1. Create a firestore database with two collections: Projects and Winners.
2. Populate your Env with the missing firebase credentials. The contract address and ABI are pre-filled. add an admin address to be able to add new projects, run raffles and publish merkleroot on-chain.


## Overview

Transpad stands for a transparent launchpad. A launchpad where the winners selection process is transparent and fair via a raffle system that combines an off-chain RNG calculation, the cleverness of Merkle trees and the immutability of Ethereum. This raffle system ensures that the selection process is tamper-proof and verifiable by all participants. 

## Features

- **Project Management**: Create and manage projects with ease.
- **Merkle Root Calculation**: Utilizes Merkle trees to ensure transparency and fairness in the selection process.
- **Winner Selection**: Automates the process of selecting winners from the pool of participants. For now the number of winners is set to 3. This can be modified in the **handleRunRaffle** function inside ***project-cards.jsx***
- **Publishing the root**: Publishes the merkle root on-chain.
- **Firebase Integration**: Leverages Firebase for robust backend management, including Firestore for data storage and Firebase Cloud Functions for backend logic.
- **Local Emulator Support**: Includes setup for Firebase Local Emulator for local testing and development.
- **React Frontend**: Provides a responsive and user-friendly interface built with React.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

**You can add Projects directly from the firebase UI, Or use the project UI**

## Files and directories
- contracts: Contain the smart contracts and their tests using Foundry. To run tests you should install foundry and run forge test -vv.

- functions: contains the firebase cloud function defintions
- src: contains all the front-end logic using react 

### Prerequisites

- Node.js
- npm or yarn
- Firebase CLI
- An Ethereum wallet for testing
- You can use your own firebase database or you can interact with my Own. 
- To create your own firebase DB, you should modify firebase.js config file.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CypherBee/TransPad
   cd TransPad
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. If you want to use the local emualtor, uncomment these two lines in firebase.js config
```javascript 
const functions = getFunctions(app)
connectFunctionsEmulator(functions, "127.0.0.1", 5001)
```
and comment the following line

```javascript 
const functions = getFunctions(app);
```

4. If you want to deploy your cloud functions and use them, follow these steps (Do not modify firebase.js in this case):
    - Install the Firebase Cli ```npm install -g firebase-tools```
    - Go to your functions folder and install firebase functions: ```npm install firebase-functions@latest firebase-admin@latest --save```
    - Deploy the cloud functions with ```firebase deploy --only functions```.

5. Start the react App
    ```bash
    npm run dev
    ```

## Usage
Create raffles, add participants, and run the raffle to select winners. The application provides a straightforward interface to manage and view the outcomes of your raffles.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Contact

CypherBee - CypherApis@gmail.com

Project Link: [https://github.com/CypherBee/TransPad](https://github.com/CypherBee/TransPad)
