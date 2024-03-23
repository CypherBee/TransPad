import Logo from '../assets/Transpad.png'
import { useEffect } from 'react';


function Header({ connectedWallet, setConnectedWallet }) {



    const connectWallet = async () => {
        console.log('Connecting wallet...');
    
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnectedWallet(accounts[0]);
                console.log(accounts[0]);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('Please install MetaMask!');
        }
    };


    const addWalletListener = async () => {

        if (window.ethereum) {
          window.ethereum.on("accountsChanged",(accounts)=>{
            setConnectedWallet(accounts[0]);
            console.log(accounts[0]);
          })
        } else {
          setConnectedWallet("");
          console.log("nothing is connected")
        }
    };

    const getCurrentWallet = async () => {

        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if(accounts.length>0){
                setConnectedWallet(accounts[0]);
                //console.log(accounts[0]);
                }
                else{
                  console.log("Connect Metamask using the connect buttom")
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('Please install MetaMask!');
        }
      };

    useEffect(()=>{
        addWalletListener();
      },[connectedWallet]);

      useEffect(()=>{
        getCurrentWallet();
    
      });




    return(

       <header >
        <img className="logo" src={Logo} alt="Logo"/>
             <nav>
                 <ul className="nav__links">
                </ul>
             </nav>
             <button  className="connect-button" onClick={connectWallet}>
             {connectedWallet && connectedWallet.length>0 ?
             `Connected: ${connectedWallet.substring(0,6)}...${connectedWallet.substring(38)} `
            :"Connect Wallet"} 

                </button>

       </header>
    )

} 

export default Header
//  <button className="connect-button">click me</button>
