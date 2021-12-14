import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Exam } from '../target/types/exam';
const { SystemProgram } = anchor.web3;
const assert = require('assert');

describe('exam', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Exam as Program<Exam>;

  let _baseAccount;

  it('Creates a counter', async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.initialize('Hello World',{
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
  
    // The account should have been created.
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('Data: ', account.data);
    assert.ok(account.data === "Hello World");
    _baseAccount = baseAccount;
  });
  
  it('Increments a counter', async () => {
    const baseAccount = _baseAccount;
    await program.rpc.update("Some new data",{
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Updated data: ', account.data)
    assert.ok(account.data === "Some new data");
    console.log('all account data:', account)
    console.log('All data: ', account.dataList);
    assert.ok(account.dataList.length === 2);

  });

  // it('Increments a counter', async () => {
  //   const baseAccount = _baseAccount;
  //   await program.rpc.allIncrement({
  //     accounts: {
  //       baseAccount: baseAccount.publicKey,
  //     },
  //   });
  
  //   const account = await program.account.baseAccount.fetch(
  //     baseAccount.publicKey
  //   );
  //   console.log('After increment: ', account.value[0].ItemBase);
  //   assert.deepEqual(account.value[0].ItemBase, [2,2,2,2]);

  // });
  
  
});

