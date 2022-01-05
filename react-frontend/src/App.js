import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { CONTACT_ABI, CONTACT_ADDRESS } from './config';

function App() {
  const [account, setAccount] = useState(); // state variable to set account 
  const [contactList, setContactList] = useState();
  const [contacts, setContacts] = useState([]);



  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();

      // Instantiate smart contract using ADI and address
      const contactList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);

      //set contact list to state variable 
      setContactList(contactList);

      // Then we get total number of contacts for iteration 
      const counter = await contactList.methods.count().call();

      for(var i = 0 ; i <= counter ; i++){
        // call the contacts method to get that particular contact from smart contract 
        const contact = await contactList.methods.contacts(i).call();

        // add recently fetched contact to state variable 
        setContacts((contacts) => [...contacts, contact]);

      }
    }

    load();
  }, []);


  return (
    <div>
      Your account is: {account}
      <h1>Contacts</h1>
      <ul>
        {
          Object.keys(contacts).map((contact, index) => (
            <li key={`${contacts[index].name}-${index}`}>
              <h4>{contacts[index].name}</h4>
              <span><b>Phone: </b>{contacts[index].phone}</span>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default App;
