import './App.css';
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';
import idl from './idl.json';

import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet()
]

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState('');
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');
  const wallet = useWallet();



  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    // const network = " https://api.testnet.solana.com";
    const network = " http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  // useEffect(() => {
  //   if(wallet.connected){
  //     async function fetchData() {
  //       const provider = await getProvider()
  //       const program = new Program(idl, programID, provider);
  //       console.log(provider.wallet)
  //       // const account = await program.account.baseAccount.filte(provider.wallet.publicKey);
  //       // setValue(account.count.toString());
  //     }
  //     fetchData();
  //   }

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[wallet])

  async function initialize() {    
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    console.log(program)
    try {
      /* interact with the program via rpc */
      await program.rpc.initialize("Hello World",{
        accounts: {
          baseAccount:provider.wallet.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [provider.wallet]
      });
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.data.toString());
      setDataList(account.dataList);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function update() {
    const provider = await getProvider();
    if(provider){
      const program = new Program(idl, programID, provider);
      const base_account = await program.account.baseAccount.all();
      await program.rpc.update({
        accounts: {
          baseAccount: base_account[0].publicKey
        }
      });
      const account = await program.account.baseAccount.fetch(base_account[0].publicKey);
      console.log('account: ', account);
      setValue(account.data.toString());
      setDataList(account.dataList);
      setInput('');
      console.log('account: ', account);
      setValue(account.count.toString());
    }
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <div>
          {
            !value && (<button onClick={initialize}>Initialize</button>)
          }

          {
            value ? (
              <div>
                <h2>Current value: {value}</h2>
                <input
                  placeholder="Add new data"
                  onChange={e => setInput(e.target.value)}
                  value={input}
                />
                <button onClick={update}>Add data</button>
              </div>
            ) : (
              <h3>Please Inialize.</h3>
            )
          }
          {
            dataList.map((d, i) => <h4 key={i}>{d}</h4>)
          }
        </div>
      </div>
    );
  }
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://127.0.0.1:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;