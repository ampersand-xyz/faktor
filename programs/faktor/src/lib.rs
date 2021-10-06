use {
    anchor_lang::{
        prelude::*,
        solana_program::{program::invoke, system_instruction, system_program},
        AnchorSerialize,
    },
    std::{clone::Clone, cmp::min},
};

declare_id!("8BHW97BHkSKUHjTxHd6g7eGRfLxQfmXniEMcAskxQTKi");

#[program]
pub mod faktor {
    use super::*;
    pub fn issue_invoice(ctx: Context<IssueInvoice>, amount: u64, memo: String) -> ProgramResult {
        let invoice = &mut ctx.accounts.invoice;
        invoice.initial_debt = amount;
        invoice.remaining_debt = amount;
        invoice.issuer = *ctx.accounts.issuer.key;
        invoice.debtor = *ctx.accounts.debtor.key;
        invoice.collector = *ctx.accounts.collector.key;
        invoice.memo = memo; // TODO: Max size limit on memo length?
        return Ok(());
    }

    pub fn pay_invoice(ctx: Context<PayInvoice>, amount: u64) -> ProgramResult {
        let invoice = &mut ctx.accounts.invoice;
        let amount = min(amount, invoice.remaining_debt);
        // Verify debtor has enough SOL to pay the amount
        if ctx.accounts.debtor.lamports() < amount {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        // Transfer SOL from the payer to the issuer
        invoke(
            &system_instruction::transfer(
                ctx.accounts.debtor.key,
                ctx.accounts.collector.key,
                amount,
            ),
            &[
                ctx.accounts.debtor.to_account_info().clone(),
                ctx.accounts.collector.to_account_info().clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;
        // Draw down the invoice's remaining debt
        invoice.remaining_debt = invoice.remaining_debt - amount;
        return Ok(());
    }

    pub fn void_invoice(ctx: Context<VoidInvoice>) -> ProgramResult {
        let invoice = &mut ctx.accounts.invoice;
        invoice.remaining_debt = 0;
        return Ok(());
    }
}

#[derive(Accounts)]
#[instruction(amount: u64, memo: String)]
pub struct IssueInvoice<'info> {
    #[account(init, payer = issuer, space = 8 + 32 + 32 + 32 + 8 + 8 + 4 + memo.len())]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    pub debtor: AccountInfo<'info>,
    pub collector: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayInvoice<'info> {
    #[account(mut, has_one = collector, has_one = debtor)]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub collector: AccountInfo<'info>,
    #[account(mut)]
    pub debtor: Signer<'info>,
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
    pub issuer: Pubkey,
    pub debtor: Pubkey,
    pub collector: Pubkey,
    pub initial_debt: u64,
    pub remaining_debt: u64,
    pub memo: String,
    // pub status: InvoiceStatus,
}

// pub enum InvoiceStatus {
//     Open,
//     Paid,
//     Void,
// }

// impl Clone for InvoiceStatus {
//     fn clone(&self) -> Self {
//         return *self;
//     }
// }

// impl AnchorSerialize for InvoiceStatus {}

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
}
