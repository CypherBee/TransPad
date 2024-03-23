import { useEffect, useState } from 'react';
import moment from 'moment';
import db from '../firebase';
import {getMerkleRoot,selectKFromNAddresses} from './Raffle_calculator.js';
import { addProjectMerkleRoot } from './PublishMerkleRoot.js';
import  {ethers}  from 'ethers';
import {
    doc,
    updateDoc,
    collection,
    getDocs,
    getDoc,
    setDoc,
} from 'firebase/firestore';



function ProjectCards({connectedWallet}){
    
    const [loading, setLoading] = useState(false);
    const [projects, setProjects]=useState([]);
    const [publishedProjectId, setPublishedProjectId] = useState(null);
    const [appOwner,setAppOwner]=useState("0x7d5549dF4E94a29660AE30999d2C7fa76542f879")
    const colRef=collection(db,'Projects');

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
            .catch(err => {
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




    async function handleRegisterInterest(projectId,address){
            const projectIndex = projects.findIndex(project => project.id === projectId);
            const project = projects[projectIndex];

            if (!project.Participants.includes(address) && address) {
            const updatedProject={Participants:[...project.Participants,address]}
            const updatedProjectState={...project, Participants: [...project.Participants, address]}
            
            try {
                const projectRef=doc(colRef,projectId);
                await updateDoc(projectRef,updatedProject);
                //update the state
                const updatedProjects = [...projects];
                updatedProjects[projectIndex] = updatedProjectState;
                setProjects(updatedProjects);
            }

            catch(error){
                console.error(error)
            }
        }
    }

    async function handleRunRaffle(projectId) {
        const project = projects.find(project => project.id === projectId);
    
        // Early return if MerkleRoot exists
        if (project.MerkleRoot) {
            return;
        }
    
        try {
            const participants = project.Participants;
            const merkleRoot = await getMerkleRoot(participants);
            const winnersList = selectKFromNAddresses(participants, 3, merkleRoot); 
    
            //await setDoc(doc(db, "Winners", project.id), newWinners);
            await updateDoc(doc(colRef, projectId), { "MerkleRoot": merkleRoot,Winners:winnersList });
    
            // Update local state if necessary
            const updatedProjects = projects.map(p => p.id === projectId ? { ...p, MerkleRoot: merkleRoot,Winners:winnersList} : p);
            setProjects(updatedProjects);
        } catch (error) {
            console.error(error);
        }
    }


    const handlePublishRoot = async (projectId) => {
        const project = projects.find(project => project.id === projectId);
        setLoading(true);
        setPublishedProjectId(null);
    
        try {
            // Get the signer from the user's wallet
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Request account access if needed
            const signer = await provider.getSigner();
            const projectRef = doc(colRef, projectId);
            const projectDoc = await getDoc(projectRef);

            const projectData = projectDoc.data();
            if (projectData.isPublished) {
                console.log('Project is already published.');
                setLoading(false);
                return; // Stop the function execution if the project is already published
            }

            // Call the addProjectMerkleRoot function with the signer and Merkle Root
            const projectId=await addProjectMerkleRoot(signer, project.MerkleRoot);
    
            // Update the frontend state and Firestore database
            setPublishedProjectId(project.id);
            await updateDoc(projectRef, { isPublished: true },{ScProjectId:projectId});
            } 
        catch (error) 
            {
            console.error('Error publishing the Merkle root:', error);
            // Handle the error as needed
            }
    
        setLoading(false);
    };


        return(
            
            <div className='projects-container'>
                
            {projects.map((project) => (
                    
                <div key={project.id} className="project-card">
                    <div className='image-container'>
                    <img className='card-image' src={project.PhotoUrl} alt={project.name} />
                    <h3 className='card-title'>{project.Name}</h3>
                </div>
                <div className='info-container'>
                    <p className='card-text'><strong>participants: </strong>{project.Participants.length}</p>
                    <p className='card-text'><strong>Raise Goal:</strong> {project.RaiseGoal}$</p>
                    <p className='card-text'><strong>Sale Ends:</strong> {moment.unix(project.SaleEnds.seconds).format('MMMM Do YYYY, h:mm a')}</p>
                </div>
                
                <button className='participate-button' onClick={()=> handleRegisterInterest(project.id,connectedWallet)} >
                    {   (()=> {
                            const currentDate = moment();
                            const inputDate = moment.unix(project.SaleEnds.seconds);

                            if(!connectedWallet){
                                return("Connect Wallet")
                            }    

                            if (!inputDate.isAfter(currentDate)) {
                                if (project.Winners && project.Winners.includes(connectedWallet)) {
                                  return "You are Whitelisted";
                                } else {
                                  return "You are not Whitelisted";
                                }
                              }
                            
                              else{
                                if (project.Participants.includes(connectedWallet)) {
                                  return 'Registered';
                                } else {
                                  return 'Register Now!';
                                }
                              }
                        })()
                    }
                      
                </button>
                <div className='raffle-container'>
                <br></br>

                <button className='run-raffle-button' onClick={() => handleRunRaffle(project.id)}>
                    {
                        (() => {
                        const currentDate = moment();
                        const inputDate = moment.unix(project.SaleEnds.seconds);
                        if (inputDate.isAfter(currentDate)) {
                            const duration = moment.duration(inputDate.diff(currentDate));
                            const durationString = `${duration.months()}m ${duration.days()}days ${duration.hours()}hrs ${duration.minutes()}m`;
                            return (
                                <div>
                                Registration Ends in:<br />
                                {durationString}
                                </div>
                                );
                            } 

                        else 
                            {
                            {/*console.log("Project State Merkle root:" + project.MerkleRoot)*/}  
                            if(project.MerkleRoot){
                                    
                                if(connectedWallet && appOwner.toLowerCase() === connectedWallet.toLowerCase()){                          
                                    return(
                                    <div onClick={()=>handlePublishRoot(project.id)}>

                                    {loading && project.id === publishedProjectId ? (
                                    <p>Loading...</p>) 
                                        : (
                                    <>
                                    Publish Merkle Root:<br />
                                    {project.MerkleRoot.slice(0,4) + "..." + project.MerkleRoot.slice(-4)}
                                    </>
                                    )}
                                    
                                    </div>);
                                    }
                                else {
                                    return(
                                    <>
                                    Project Merkle Root:<br />
                                    {project.MerkleRoot.slice(0,4) + "..." + project.MerkleRoot.slice(-4)}
                                    </>
                                    )
                                }
 
                                }
                            return 'Raffle Now!';
                            }

                        })()
                    }
                </button>

                </div>

            </div>   
            ))}

        </div>
        );
    }




export default ProjectCards