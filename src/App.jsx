import Header from './components/Header'
import Footer from './components/Footer'
import ProjectCards from './components/Project-Cards.jsx'
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