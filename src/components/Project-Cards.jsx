import { useEffect, useState } from "react";
import moment from "moment";
import { db, app, functions } from "../../firebase.js";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { ethers } from "ethers";
import { publishMerkleRoot } from "../services/PublishMerkleRoot.js";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";



function ProjectCards({ connectedWallet }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [appOwner, setAppOwner] = useState(
    "0x7d5549dF4E94a29660AE30999d2C7fa76542f879"
  );
  const colRef = collection(db, "Projects");

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    getDocs(colRef)
      .then((snapshot) => {
        if (isMounted) {
          let Projects = [];
          snapshot.docs.forEach((doc) => {
            Projects.push({ ...doc.data(), id: doc.id });
          });
          setProjects(Projects);
          //console.log("Projects",Projects)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize loading states
  useEffect(() => {
    const initialLoadingStates = {};
    projects.forEach((project) => {
      initialLoadingStates[project.id] = false;
    });
    setLoadingStates(initialLoadingStates);
  }, [projects]);

  async function handleRegisterInterest(projectId, address) {
    const projectIndex = projects.findIndex(
      (project) => project.id === projectId
    );
    const project = projects[projectIndex];

    if (!project.Participants.includes(address) && address) {
      const updatedProject = {
        Participants: [...project.Participants, address],
      };
      const updatedProjectState = {
        ...project,
        Participants: [...project.Participants, address],
      };

      try {
        const projectRef = doc(colRef, projectId);
        await updateDoc(projectRef, updatedProject);
        //update the state
        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = updatedProjectState;
        setProjects(updatedProjects);
      } catch (error) {
        console.error(error);
      }
    }
  }

  //------------helper Functions Begin---------------

  async function callAddProject(addresses) {
    try {
      const getMerkleRoot = httpsCallable(functions, "calculate_merkleRoot");
      const result = await getMerkleRoot(addresses);
      console.log("getMerkleRoot Result:", result);
      return result.data;
    } catch (error) {
      console.error("Error in getMerkleRoot:", error);
    }
  }

  async function callSelectKFromNAddresses(addresses, k, merkleRoot) {
    try {
      const selectKFromNAddressesFn = httpsCallable(
        functions,
        "select_k_from_n_addresses"
      );
      const result = await selectKFromNAddressesFn({
        addresses,
        k,
        merkleRoot,
      });
      console.log("SelectKFromNAddresses Result:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error in selectKFromNAddresses:", error);
    }
  }

  // Example usage:
  async function executeCalls(addresses, k) {
    const merkleRoot = await callAddProject(addresses);
    const winnersList = await callSelectKFromNAddresses(
      addresses,
      k,
      merkleRoot
    );
    return { merkleRoot, winnersList };
  }

  //------------helper Functions End-------------------

  async function handleRunRaffle(projectId) {
    const project = projects.find((project) => project.id === projectId);
    console.log(projectId);
    // Early return if MerkleRoot exists
    if (project.MerkleRoot) {
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [projectId]: true }));
      const addresses = project.Participants;
      const k = 3;//hardcoded k value
      console.log("9lawi");
      const { merkleRoot, winnersList } = await executeCalls(addresses, k);
      console.log("About to update document");

      //await setDoc(doc(db, "Winners", project.id), newWinners);
      await updateDoc(doc(colRef, projectId), {
        MerkleRoot: merkleRoot,
        Winners: winnersList,
      });
      console.log("Document updated");

      // Update local state if necessary
      const updatedProjects = projects.map((p) =>
        p.id === projectId
          ? { ...p, MerkleRoot: merkleRoot, Winners: winnersList }
          : p
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error(error);
    }
    setLoadingStates((prev) => ({ ...prev, [projectId]: false }));
    console.log("states", loadingStates);
  }

  const handlePublishRoot = async (projectId) => {
    const project = projects.find((project) => project.id === projectId);

    setLoadingStates((prev) => ({ ...prev, [projectId]: true }));

    try {
      // Get the signer from the user's wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access if needed
      const signer = await provider.getSigner();
      const projectRef = doc(colRef, projectId);
      const projectDoc = await getDoc(projectRef);

      const projectData = projectDoc.data();
      if (projectData.isPublished && project.merkleRoot) {
        console.log("Project is already published.");
        return; // Stop the function execution if the project is already published
      }

      const merkleRoot = project.MerkleRoot;
      // Call the addProjectMerkleRoot function with the signer and Merkle Root
      const resposeId = await publishMerkleRoot(signer, merkleRoot);
      const scProjectId = Number(resposeId);
      console.log("scProjectId from UI", scProjectId);

      // Update the frontend state and Firestore database
      await updateDoc(projectRef, {
        isPublished: true,
        ScProjectId: scProjectId,
      });
      const updatedProjects = projects.map((p) =>
        p.id === projectId ? { ...p, isPublished: true } : p
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error publishing the Merkle root:", error);
      // Handle the error as needed
    }
    setLoadingStates((prev) => ({ ...prev, [projectId]: false }));
  };

  return (
    <div className="projects-container">
      {projects.map((project) => {
        const currentDate = moment();
        const inputDate = moment.unix(project.RegistrationEnds.seconds);
        const isRegistrationOn = inputDate.isAfter(currentDate);
        const isParticipant = project.Participants.includes(connectedWallet);
        const isWhitelisted =
          project.Winners && project.Winners.includes(connectedWallet);
        const isOwner =
          connectedWallet &&
          appOwner.toLowerCase() === connectedWallet.toLowerCase();
        const duration = moment.duration(inputDate.diff(currentDate));
        const durationString = ` ${Math.floor(
          duration.asDays()
        )} days ${duration.hours()}hrs ${duration.minutes()}m`;

        return (
          <div key={project.id} className="project-card">
            <div className="image-container">
              <img
                className="card-image"
                src={project.PhotoUrl}
                alt={project.Name}
              />
              <h3 className="card-title">{project.Name}</h3>
            </div>
            <div className="info-container">
              <p className="card-text">
                <strong>Participants:</strong>{" "}
              </p>
              <p className="card-text">{project.Participants.length}</p>
            </div>

            <div className="info-container">
              <p className="card-text">
                <strong>Raise Goal:</strong>{" "}
              </p>
              <p className="card-text">{project.RaiseGoal}$</p>
            </div>

            <div className="info-container">
              <p className="card-text">
                <strong>
                  {isRegistrationOn ? "Closes on:" : "Closed on:"}
                </strong>
              </p>
              <p className="card-text">
                {moment
                  .unix(project.RegistrationEnds.seconds)
                  .format("MMMM Do YYYY, h:mm a")}
              </p>
            </div>

            <div className="info-container">
              <p className="card-text">
                <strong>Merkle Root:</strong>
              </p>
              <p className="card-text">
                {project.MerkleRoot
                  ? project.MerkleRoot.slice(0, 6) +
                    "..." +
                    project.MerkleRoot.slice(-6)
                  : "TBA"}
              </p>
            </div>

            <div className="info-container">
              <p className="card-text">
                <strong>Status:</strong>
              </p>
              <p className="card-text">
                {project.isPublished ? "Published" : "Pending to publish"}
              </p>
            </div>

            <button
              className={`participate-button ${
                !isRegistrationOn && connectedWallet && isWhitelisted
                  ? "status-positive"
                  : ""
              }`}
              disabled={!isRegistrationOn || isParticipant}
              onClick={() =>
                handleRegisterInterest(project.id, connectedWallet)
              }
            >
              {!connectedWallet
                ? "Connect Wallet"
                : isRegistrationOn
                ? isParticipant
                  ? "You are Registered"
                  : "Register Now!"
                : project.MerkleRoot
                ? isWhitelisted
                  ? "You are Whitelisted 😎"
                  : "You are not Whitelisted"
                : "Wait for the Raffle !"}
            </button>

            <div className="raffle-container">
              <br></br>
              {isOwner && (
                <button
                  className="run-raffle-button"
                  onClick={() => handleRunRaffle(project.id)}
                >
                  {loadingStates[project.id] ? (
                    "loading..."
                  ) : isRegistrationOn ? (
                    <>
                      Registration Ends in:
                      <br />
                      {durationString}
                    </>
                  ) : project.MerkleRoot ? (
                    !project.isPublished ? (
                      <div onClick={() => handlePublishRoot(project.id)}>
                        Publish Merkle Root:
                        <br />
                        {project.MerkleRoot.slice(0, 4) +
                          "..." +
                          project.MerkleRoot.slice(-4)}
                      </div>
                    ) : (
                      <>
                        {project.isPublished
                          ? "Root is Published:"
                          : "Project Merkle Root:"}
                        <br />
                        {project.MerkleRoot.slice(0, 4) +
                          "..." +
                          project.MerkleRoot.slice(-4)}
                      </>
                    )
                  ) : (
                    "Raffle Now!"
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectCards;
