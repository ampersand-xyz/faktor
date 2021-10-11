use {
    anchor_lang::{
        prelude::*,
        solana_program::{
            program::invoke, 
            system_instruction, 
            system_program,
        },
    },
    std::cmp::min,
};

declare_id!("8BHW97BHkSKUHjTxHd6g7eGRfLxQfmXniEMcAskxQTKi");

#[program]
pub mod faktor {
    use super::*;
    pub fn issue(ctx: Context<Issue>, bump: u8, balance: u64, memo: String) -> ProgramResult {
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
        escrow.bump = bump;
        return Ok(());
    }

    pub fn pay(ctx: Context<Pay>, amount: u64) -> ProgramResult {
        // Parse accounts from context
        let escrow = &mut ctx.accounts.escrow;
        let debtor = &mut ctx.accounts.debtor;
        let system_program = &ctx.accounts.system_program;
        // Transfer SOL from the debtor to the escrow account
        let amount = min(amount, escrow.debits);
        require!(
            debtor.to_account_info().lamports() > amount, 
            ErrorCode::NotEnoughSOL
        );
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
        let creditor = &ctx.accounts.creditor;
        // Transfer SOL from the escrow account to the creditor
        let amount = min(amount, escrow.credits);
        require!(
            escrow.to_account_info().lamports() > amount,
            ErrorCode::NotEnoughSOL
        );
        **escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **creditor.to_account_info().try_borrow_mut_lamports()? += amount;
        // Update credits and debits balances
        escrow.credits = escrow.credits - amount;
        // TODO delete account if debits and credits are zero
        return Ok(());
    }
}

#[derive(Accounts)]
#[instruction(bump: u8, amount: u64, memo: String)]
pub struct Issue<'info> {
    #[account(
        init,  
        seeds = [issuer.key().as_ref(), debtor.key().as_ref(), creditor.key().as_ref()],
        bump = bump,
        payer = issuer,
        space = 8 + 32 + 32 + 32 + 8 + 8 + 4 + memo.len() + 1,
    )]
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
    #[account(
        mut, 
        seeds = [issuer.key().as_ref(), debtor.key().as_ref(), creditor.key().as_ref()],
        bump = escrow.bump,
        has_one = issuer,
        has_one = debtor,
    )]
    pub escrow: Account<'info, Escrow>,
    pub issuer: AccountInfo<'info>,
    #[account(mut)]
    pub debtor: Signer<'info>,
    pub creditor: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Collect<'info> {
    #[account(
        mut, 
        seeds = [issuer.key().as_ref(), debtor.key().as_ref(), creditor.key().as_ref()],
        bump = escrow.bump,
        has_one = issuer,
        has_one = debtor,
        has_one = creditor,
    )]
    pub escrow: Account<'info, Escrow>,
    pub issuer: AccountInfo<'info>,
    pub debtor: AccountInfo<'info>,
    #[account(mut)]
    pub creditor: Signer<'info>,
}

#[account]
pub struct Escrow {
    pub issuer: Pubkey,
    pub debtor: Pubkey,
    pub creditor: Pubkey,
    pub debits: u64,
    pub credits: u64,
    pub memo: String,
    pub bump: u8,
}




#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
    #[msg("Something happened")]
    SomethingHappened,
}
