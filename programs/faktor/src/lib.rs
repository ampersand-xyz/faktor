use {
    anchor_lang::{
        prelude::*,
        solana_program::{program::invoke, system_instruction, system_program},
    },
    std::cmp::min,
};

declare_id!("8BHW97BHkSKUHjTxHd6g7eGRfLxQfmXniEMcAskxQTKi");

#[program]
pub mod faktor {
    use super::*;
    pub fn issue_invoice(ctx: Context<IssueInvoice>, amount: u64) -> ProgramResult {
        let invoice = &mut ctx.accounts.invoice;
        invoice.initial_amount = amount;
        invoice.remaining_amount = amount;
        invoice.issuer = *ctx.accounts.issuer.key;
        invoice.payer = *ctx.accounts.payer.key;
        return Ok(());
    }

    pub fn pay_invoice(ctx: Context<PayInvoice>, amount: u64) -> ProgramResult {
        let invoice = &mut ctx.accounts.invoice;
        let amount = min(amount, invoice.remaining_amount);
        // Verify payer has enough SOL to pay the amount
        if ctx.accounts.payer.lamports() < amount {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        // Transfer SOL from the payer to the issuer
        invoke(
            &system_instruction::transfer(ctx.accounts.payer.key, ctx.accounts.issuer.key, amount),
            &[
                ctx.accounts.payer.to_account_info().clone(),
                ctx.accounts.issuer.clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;
        // Draw down invoice's remaining amount
        invoice.remaining_amount = invoice.remaining_amount - amount;
        return Ok(());
    }

    pub fn void_invoice(ctx: Context<VoidInvoice>) -> ProgramResult {
        let invoice = &mut ctx.accounts.invoice;
        invoice.remaining_amount = 0;
        return Ok(());
    }
}

#[derive(Accounts)]
pub struct IssueInvoice<'info> {
    #[account(init, payer = issuer, space = 8 + 8 + 8 + 32 + 32)]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    pub payer: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayInvoice<'info> {
    #[account(mut, has_one = issuer, has_one = payer)]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub issuer: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoidInvoice<'info> {
    #[account(mut, has_one = issuer)]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub issuer: Signer<'info>,
}

#[account]
pub struct Invoice {
    pub initial_amount: u64,
    pub remaining_amount: u64,
    pub issuer: Pubkey,
    pub payer: Pubkey,
}

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL to pay this invoice.")]
    NotEnoughSOL,
}
