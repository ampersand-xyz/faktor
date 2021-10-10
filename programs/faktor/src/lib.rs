use {
    anchor_lang::{
        prelude::*,
        solana_program::{program::invoke, system_instruction, system_program},
        AnchorSerialize,
    },
    std::{
        clone::Clone,
        cmp::min,
    },
};

declare_id!("8BHW97BHkSKUHjTxHd6g7eGRfLxQfmXniEMcAskxQTKi");

#[program]
pub mod faktor {
    use super::*;
    pub fn issue(ctx: Context<Issue>, balance: u64, memo: String) -> ProgramResult {
        // Parse accounts from context
        let issuer = &ctx.accounts.issuer;
        let debtor = &ctx.accounts.debtor;
        let creditor = &ctx.accounts.creditor;
        let escrow = &mut ctx.accounts.escrow;
        // Intialize escrow account
        escrow.issuer = issuer.key();
        escrow.debtor = debtor.key();
        escrow.creditor = creditor.key();
        escrow.debits = balance;
        escrow.credits = 0;
        // TODO: Max debt limit on memo length?
        escrow.memo = memo;
        return Ok(());
    }

    pub fn pay(ctx: Context<Pay>, amount: u64) -> ProgramResult {
        // Parse accounts from context
        let escrow = &mut ctx.accounts.escrow;
        let debtor = &mut ctx.accounts.debtor;
        let system_program = &ctx.accounts.system_program;
        // Transfer SOL from the debtor to the escrow account
        let amount = min(amount, escrow.debits);
        if debtor.lamports() < amount {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        invoke(
            &system_instruction::transfer(&debtor.key(), &escrow.key(), amount),
            &[
                debtor.to_account_info().clone(),
                escrow.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        // Update credits and debits balances
        escrow.credits = escrow.credits + amount;
        escrow.debits = escrow.debits - amount;
        return Ok(());
    }


    pub fn collect(ctx: Context<Collect>, amount: u64) -> ProgramResult {
        // Parse accounts from context
        let escrow = &mut ctx.accounts.escrow;
        let creditor = &mut ctx.accounts.creditor;
        let system_program = &ctx.accounts.system_program;
        // Transfer SOL from the escrow account to the creditor
        if escrow.to_account_info().lamports() < amount || escrow.credits < amount {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        invoke(
            &system_instruction::transfer(&escrow.key(), &creditor.key(), amount),
            &[
                escrow.to_account_info().clone(),
                creditor.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        // Update credits and debits balances
        escrow.credits = escrow.credits - amount;
        return Ok(());
    }
}

#[derive(Accounts)]
#[instruction(amount: u64, memo: String)]
pub struct Issue<'info> {
    // TODO add seeds to make a PDA 
    #[account(init, payer = issuer, space = 8 + 32 + 32 + 32 + 8 + 8 + 4 + memo.len())]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    pub debtor: AccountInfo<'info>,
    pub creditor: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Pay<'info> {
    #[account(mut, has_one = debtor)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub debtor: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Collect<'info> {
    #[account(mut, has_one = creditor)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub creditor: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Escrow {
    pub issuer: Pubkey,
    pub debtor: Pubkey,
    pub creditor: Pubkey,
    pub debits: u64,
    pub credits: u64,
    pub memo: String,
}

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
}
