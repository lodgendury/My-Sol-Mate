import React from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import Confetti from "react-confetti"
import abi from "./utils/TinderPortal.json";
import { ethers } from "ethers";


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media.giphy.com/media/cUIq4MyZk95s35eSTt/giphy.gif',
	'https://media.giphy.com/media/cwTtbmUwzPqx2/giphy.gif',
	'https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif',
	'https://media.giphy.com/media/xL7PDV9frcudO/giphy.gif'
];

const App = () => {
    /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
       const contractAddress = "0x1210387C93c8e89D98882AA1f357aBb2207E6D08";
   /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [inputValue, setInputValue] = React.useState('');
  const [gifList, setGifList] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [load, setLoad] = React.useState(0);
  const [match, setMatch] = React.useState({
        firstName: "First Name",
        lastName: "Last Name",
        city: "City",
        country: "Country",
        work: "Work",
        workPlace: "Work Place",
        phone: "Mobile No.",
        twitterHandle: "Twitter Handle",
        image: "https://randomuser.me/api/portraits/women/17.jpg"
    })
  const [allMatches, setAllMatches] = React.useState([]);
  const [revealMatch, setRevealMatch] = React.useState(false);
  const [randomNum, setRandomNum] = React.useState(0);
  const [job, setJob] = React.useState({});
  const [company, setCompany] = React.useState({});
  const [error, setError] = React.useState(false);



  
   React.useEffect(() => {
        fetch("https://randomuser.me/api/?results=1000")
            .then(res => res.json())
            .then(data => setAllMatches(data))
    }, [])
    React.useEffect(() => {
        fetch("https://random-data-api.com/api/users/random_user")
            .then(res => res.json())
            .then(data => setJob(data))
    }, [])
  React.useEffect(() => {
        fetch("https://random-data-api.com/api/company/random_company")
            .then(res => res.json())
            .then(data => setCompany(data))
    }, [])
  
   /*
      * Check if we're authorized to access the user's wallet
     

*/

const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        
        setCurrentAccount(account);
        
        
        
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
       setCount(50);
    try {
      const { ethereum } = window;
      

      if (!ethereum) {
        alert("Get MetaMask!");
        setCount(25);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      
    } catch (error) {
      console.log(error);
      setCount(25);
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  

  
     const getMatch = async() => {
       if (inputValue.length > 0) {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tinderPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await tinderPortalContract._generateRandomMagicNum(inputValue);
        console.log("Retrieved total wave count...", count.toNumber());
        const newCount = count.toNumber();
        setRandomNum(newCount);
   
        

        /*
        * Execute the actual wave from your smart contract
     { gasLimit: 300000 }   */
        const matchArray = allMatches.results;
         const jobs = job.employment;
         
        
        const userFirstName = matchArray[randomNum].name.first;
         const userLastName = matchArray[randomNum].name.last;
        const userCity = matchArray[randomNum].location.city;
        const userCountry = matchArray[randomNum].location.country;
        const userMobile = matchArray[randomNum].cell;
        const userTwitterHandle = matchArray[randomNum].login.username;
       const userImage = matchArray[randomNum].picture.large;
         const userJob = jobs.title;
         const userWorkPlace = company.business_name;
        setMatch(prevMatch => ({
            ...prevMatch,
            firstName: userFirstName,
          lastName: userLastName,
          work: userJob,
          workPlace: userWorkPlace,
        city: userCity,
        country: userCountry,
        phone: userMobile,
        twitterHandle: userTwitterHandle,
        image: userImage
        }));
         setLoad(100); 
         
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setLoad(0);
      setError(true);
      
    }

  } else {
    console.log('Empty input. Try again.');
  }
        
    }


  
  

 

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  
  const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
 


*/
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      { (count === 0) && (<p>Connect Wallet</p>)} { 
             (count === 50) && (<div class="loader">
  <span class="loader__element"></span>
  <span class="loader__element"></span>
  <span class="loader__element"></span>
</div>)}{(count === 25) && (<p>Retry</p>)}
    </button>
  );
 

  const renderInputForm = () => (
  <div className="connected-container">
     {/* Go ahead and add this input and button to start */}
    <form
      onSubmit={(event) => {
        event.preventDefault();
       if (inputValue.length > 0) {
         setLoad(50);
         setTimeout(getMatch, 1000);
      } else {
    console.log('Empty input. Try again.');
  } }
      
      }
    >
     <input
  type="text"
  placeholder="Enter your name"
  value={inputValue}
  onChange={onInputChange}
/>
      {!error && (<button type="submit" className="cta-button submit-gif-button" >Submit</button>)} {error && (<button type="submit" className="cta-button submit-gif-button" >Please Retry</button>)}
    </form>
    </div>
);
    const renderMatch = () => (
      <div class="card-container">
    <div class="card">
    <section className="section1">
    <div className="match-grid">
    <div className="first-grid">
                <img src={match.image} className="image" />
                
    </div>
      
      <div className="item name"><p><i class="fa fa-user" aria-hidden="true"></i>{match.firstName} {match.lastName}</p></div>
      <div className="item"><p><i class="fa fa-briefcase" aria-hidden="true"></i>{match.work} at {match.workPlace}</p></div>
      <div className="item location"><p><i class="fa fa-map-marker" aria-hidden="true"></i>{match.city}, {match.country}</p></div>
       <div className="item"><p><i class="fa fa-mobile" aria-hidden="true"></i>{match.phone}</p></div>
          <div className="item"><p><i class="fa fa-twitter" aria-hidden="true"></i>{match.twitterHandle}</p></div>
           
    
      </div>
      </section>
      <section className="section2">
    <div className="match-grid">
    <div className="first-grid">
                <img src={match.image} className="image" />
                
    </div>
      
      <div className="item name"><p><i class="fa fa-user" aria-hidden="true"></i>{match.firstName} {match.lastName}</p></div>
      <div className="item"><p><i class="fa fa-briefcase" aria-hidden="true"></i>{match.work} at {match.workPlace}</p></div>
      <div className="item location"><p><i class="fa fa-map-marker" aria-hidden="true"></i>{match.city}, {match.country}</p></div>
       <div className="item"><p><i class="fa fa-mobile" aria-hidden="true"></i>{match.phone}</p></div>
          <div className="item"><p><i class="fa fa-twitter" aria-hidden="true"></i>{match.twitterHandle}</p></div>
           
    
      </div>
      </section>
      </div>
        </div>
   
);
  
  return (
    <div className="App">
      {/* This was solely added for some styling fanciness 


*/}
      {(load == 100 ) && (<Confetti/>)}
			<div className="container">
        {(load == 0) && (<div className="form-container">
          <p className="header">My <span>Sol</span> Mate</p>
          <p className="sub-text">
            Find your <span>soulmate</span> in the metaverse
          </p>
           
          {!currentAccount && renderNotConnectedContainer()} 
           
        {currentAccount && renderInputForm()}
          
        </div>)}

        {(load == 100 ) && renderMatch()}

        {(load == 50 ) && (<div className="spin-container"><div id="container">
  <div class="circle1">
  </div>
  <div class="circle2">
  </div>
  <div class="circle3">
  </div></div>
</div>)}

        {/*  

{revealMatch && (<div className="spin-container"><div id="container">
  <div class="circle1">
  </div>
  <div class="circle2">
  </div>
  <div class="circle3">
  </div></div>
</div>)}

We just need to add the inverse here! */}
        
    
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
