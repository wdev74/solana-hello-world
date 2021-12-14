use anchor_lang::prelude::*;
use borsh::{BorshSerialize, BorshDeserialize};
declare_id!("6U9komsBuAarVoHz8am73W9Aa6QR9Cvh8sqDLFkCrY7t");

#[program]
mod exam {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.data = data;
        base_account.data_list.push(ItemBase{address:1, address1:1, address2:1, address3:1});
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.data = data;
        base_account.data_list.push(ItemBase{address:1, address1:1, address2:1, address3:1});
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 64 + 64)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub data: String,
    pub data_list: Vec<ItemBase>,
}

#[derive(BorshSerialize, BorshDeserialize, Clone)]
// #[zero_copy(BorshSerialize)]
pub struct ItemBase {
    pub address: u64,
    pub address1: u64,
    pub address2: u64,
    pub address3: u64,
}