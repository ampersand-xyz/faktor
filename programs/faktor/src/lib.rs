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
        let escrow = &mut ctx.accounts.escrow;
        let system_program = &ctx.accounts.system_program;
        // Intialize escrow account
        escrow.issuer = issuer.key();
        escrow.debtor = debtor.key();
        escrow.collateral_balance = balance;
        escrow.debt_balance = balance;
        // TODO: Max size limit on memo length?
        escrow.memo = memo;
        // Transfer SOL from issuer to escrow as collateral
        if issuer.lamports() < balance {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        invoke(
            &system_instruction::transfer(&issuer.key(), &escrow.key(), balance),
            &[
                issuer.to_account_info().clone(),
                escrow.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        return Ok(());
    }

    pub fn pay(ctx: Context<Pay>, amount: u64) -> ProgramResult {
        // Parse accounts from context
        let escrow = &mut ctx.accounts.escrow;
        let debtor = &mut ctx.accounts.debtor;
        let system_program = &ctx.accounts.system_program;
        // Transfer SOL from the debtor to the escrow account
        let payment_amount = min(amount, escrow.debt_balance);
        if debtor.lamports() < payment_amount {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        invoke(
            &system_instruction::transfer(&debtor.key(), &escrow.key(), payment_amount),
            &[
                debtor.to_account_info().clone(),
                escrow.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        // Update collateral and debt balances
        escrow.collateral_balance = escrow.collateral_balance + amount;
        escrow.debt_balance = escrow.debt_balance - amount;
        return Ok(());
    }
}

#[derive(Accounts)]
#[instruction(amount: u64, memo: String)]
pub struct Issue<'info> {
    #[account(init, payer = issuer, space = 8 + 32 + 32 + 8 + 8 + 4 + memo.len())]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    pub debtor: AccountInfo<'info>,
    // #[account(mut)]
    // pub ftoken_mint: Account<'info, Mint>,
    // #[account(address = spl_token::id())]
    // pub token_program: Program<'info, Token>,
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

#[account]
pub struct Escrow {
    pub issuer: Pubkey,
    pub debtor: Pubkey,
    pub collateral_balance: u64,
    pub debt_balance: u64,
    pub memo: String,
}

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
    #[msg("This invoice is not open")]
    InvoiceNotOpen,
}
