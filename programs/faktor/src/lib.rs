use {
    anchor_lang::{
        prelude::*,
        solana_program::{program::invoke, system_instruction, system_program},
        AnchorSerialize,
    },
    std::{
        clone::Clone,
        cmp::{min, PartialEq},
    },
};

declare_id!("8BHW97BHkSKUHjTxHd6g7eGRfLxQfmXniEMcAskxQTKi");

#[program]
pub mod faktor {
    use super::*;
    pub fn open(ctx: Context<Open>, balance: u64, memo: String) -> ProgramResult {
        // Parse accounts from context
        let issuer = &ctx.accounts.issuer;
        let debtor = &ctx.accounts.debtor;
        let invoice = &mut ctx.accounts.invoice;
        let system_program = &ctx.accounts.system_program;
        // Open invoice
        invoice.status = InvoiceStatus::Open;
        invoice.issuer = issuer.key();
        invoice.collateral = balance;
        invoice.debtor = debtor.key();
        invoice.debt = balance;
        // TODO: Max size limit on memo length?
        invoice.memo = memo;
        // Transfer SOL from issuer to invoice as collateral
        if issuer.lamports() < balance {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        invoke(
            &system_instruction::transfer(&issuer.key(), &invoice.key(), balance),
            &[
                issuer.to_account_info().clone(),
                invoice.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        return Ok(());
    }

    pub fn pay(ctx: Context<Pay>, amount: u64) -> ProgramResult {
        // Parse accounts from context
        let invoice = &mut ctx.accounts.invoice;
        let debtor = &mut ctx.accounts.debtor;
        let system_program = &ctx.accounts.system_program;
        // Only continue if the invoice is open
        if invoice.status != InvoiceStatus::Open {
            return Err(ErrorCode::InvoiceNotOpen.into());
        }
        // Transfer SOL from the debtor to the invoice
        let amount = min(amount, invoice.debt);
        if debtor.lamports() < amount {
            return Err(ErrorCode::NotEnoughSOL.into());
        }
        invoke(
            &system_instruction::transfer(&debtor.key(), &invoice.key(), amount),
            &[
                debtor.to_account_info().clone(),
                invoice.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        // Update collateral and debt balances
        invoice.collateral = invoice.collateral + amount;
        invoice.debt = invoice.debt - amount;
        // Update invoice status
        if invoice.debt <= 0 {
            invoice.status = InvoiceStatus::Paid;
        }
        return Ok(());
    }

    // pub fn reject_invoice(ctx: Context<RejectInvoice>, is_spam: bool) -> ProgramResult {
    //     // Validate the invoice is open
    //     let invoice = &mut ctx.accounts.invoice;
    //     if invoice.status != InvoiceStatus::Open {
    //         return Err(ErrorCode::InvoiceNotOpen.into());
    //     }
    //     // Reject the invoice and optionally flag as spam
    //     invoice.remaining_debt = 0;
    //     if is_spam {
    //         invoice.status = InvoiceStatus::Spam;
    //     } else {
    //         invoice.status = InvoiceStatus::Rejected;
    //     }
    //     return Ok(());
    // }

    // pub fn void_invoice(ctx: Context<VoidInvoice>) -> ProgramResult {
    //     // Validate the invoice is open
    //     let invoice = &mut ctx.accounts.invoice;
    //     if invoice.status != InvoiceStatus::Open {
    //         return Err(ErrorCode::InvoiceNotOpen.into());
    //     }
    //     // Void the invoice's remaining debt
    //     invoice.remaining_debt = 0;
    //     invoice.status = InvoiceStatus::Void;
    //     return Ok(());
    // }
}

#[derive(Accounts)]
#[instruction(amount: u64, memo: String)]
pub struct Open<'info> {
    #[account(init, payer = issuer, space = 8 + 4 + 32 + 8 + 32 + 8 + 4 + memo.len())]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    pub debtor: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Pay<'info> {
    #[account(mut, has_one = debtor)]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub debtor: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// pub struct RejectInvoice<'info> {
//     #[account(mut, has_one = payer)]
//     pub invoice: Account<'info, Invoice>,
//     #[account(mut)]
//     pub payer: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct VoidInvoice<'info> {
//     #[account(mut, has_one = opener)]
//     pub invoice: Account<'info, Invoice>,
//     #[account(mut)]
//     pub opener: Signer<'info>,
// }

#[account]
pub struct Invoice {
    pub status: InvoiceStatus,
    pub issuer: Pubkey,
    pub collateral: u64,
    pub debtor: Pubkey,
    pub debt: u64,
    pub memo: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum InvoiceStatus {
    Open,
    Paid,
}

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
    #[msg("This invoice is not open")]
    InvoiceNotOpen,
}
