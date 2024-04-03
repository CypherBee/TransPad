import {db} from '../../firebase.js';
import {collection,addDoc} from 'firebase/firestore';



import React, { useState } from 'react';

function AddProjectForm() {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [raiseGoal, setRaiseGoal] = useState('');
  const [registrationEnds, setregistrationEnds] = useState('');
  const [isPending,setIsPending]=useState(false)

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoUrlChange = (e) => {
    setPhotoUrl(e.target.value);
  };

  const handleRaiseGoalChange = (e) => {
    setRaiseGoal(e.target.value);
  };

  const handleRegistrationEnds = (e) => {
    setregistrationEnds(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      Name: name,
      PhotoUrl: photoUrl,
      RaiseGoal: parseInt(raiseGoal, 10),
      RegistrationEnds: new Date(registrationEnds),
      Participants:[]
    };
    setIsPending(true)

    addDoc(collection(db,"Projects"),newProject)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

    console.log(newProject);
    setIsPending(false)
  };

  return (
    <div className='create'>
    <h2>Add a new Project</h2>
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        Photo URL:
        <input type="text" value={photoUrl} onChange={handlePhotoUrlChange} />
      </label>
      <br />
      <label>
        Raise Goal:
        <input type="number" value={raiseGoal} onChange={handleRaiseGoalChange} />
      </label>
      <br />
      <label>
        Registration Ends:
        <input type="datetime-local" value={registrationEnds} onChange={handleRegistrationEnds} />
      </label>
      <br />
      {!isPending && <button type="submit">Add Project</button>}
      {isPending && <button disabled>Adding new project...</button>}
    </form>
    </div>
  );
}

export default AddProjectForm;
