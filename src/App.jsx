import Header from './Components/Header'
import Footer from './Components/Footer'
import ProjectCards from './Components/Project-Cards.jsx'
import { useState } from 'react';




function App(){
    const [connectedWallet, setConnectedWallet] = useState();

    return(
        <>
        <Header connectedWallet={connectedWallet} setConnectedWallet={setConnectedWallet}/>
            <hr/>
        <h2 className='container-title'>Live and Upcoming Launches</h2>
        <ProjectCards connectedWallet={connectedWallet}/>
            
        <Footer/>
        
        </>
    )

}

export default App