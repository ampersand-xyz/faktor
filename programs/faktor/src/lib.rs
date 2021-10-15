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

declare_id!("GxReFFF7LTe64UeY9ijUmmqUiDdYKTVD8pw6FLZxEQ8i");

#[program]
pub mod faktor {
    use anchor_lang::AccountsClose;

    use super::*;
    pub fn issue(ctx: Context<Issue>, bump: u8, balance: u64, memo: String) -> ProgramResult {
        // Parse accounts from context
        let invoice = &mut ctx.accounts.invoice;
        let creditor = &ctx.accounts.creditor;
        let debtor = &ctx.accounts.debtor;
        let clock = &ctx.accounts.clock;
        
        // Intialize invoice account
        invoice.creditor = creditor.key();
        invoice.debtor = debtor.key();
        invoice.balance = balance;
        invoice.memo = memo; // TODO: Max limit on memo length?
        invoice.issued_at = clock.unix_timestamp;
        invoice.bump = bump;
        return Ok(());
    }

    pub fn pay(ctx: Context<Pay>, amount: u64) -> ProgramResult {
        // Parse accounts from context
        let invoice = &mut ctx.accounts.invoice;
        let debtor = &mut ctx.accounts.debtor;
        let creditor = &mut ctx.accounts.creditor;
        let system_program = &ctx.accounts.system_program;

        // Transfer SOL from the debtor to the creditor account
        let amount = min(amount, invoice.balance);
        require!(
            debtor.to_account_info().lamports() > amount, 
            ErrorCode::NotEnoughSOL
        );
        invoke(
            &system_instruction::transfer(&debtor.key(), &creditor.key(), amount),
            &[
                debtor.to_account_info().clone(),
                creditor.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;

        // Update invoice balance
        invoice.balance = invoice.balance - amount;

        // If invoice is fully paid, close the invoice account
        if invoice.balance <= 0 {
            invoice.close(creditor.to_account_info())?;
        }
        return Ok(());
    }
}

#[derive(Accounts)]
#[instruction(bump: u8, amount: u64, memo: String)]
pub struct Issue<'info> {
    #[account(
        init,  
        seeds = [creditor.key().as_ref(), debtor.key().as_ref()],
        bump = bump,
        payer = creditor,
        space = 8 + 32 + 32 + 8 + 4 + memo.len() + 8 + 1,
    )]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub creditor: Signer<'info>,
    pub debtor: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct Pay<'info> {
    #[account(
        mut, 
        seeds = [creditor.key().as_ref(), debtor.key().as_ref()],
        bump = invoice.bump,
        has_one = creditor,
        has_one = debtor,
    )]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub creditor: AccountInfo<'info>,
    #[account(mut)]
    pub debtor: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}


#[account]
pub struct Invoice {
    pub creditor: Pubkey,
    pub debtor: Pubkey,
    pub balance: u64,
    pub memo: String,
    pub issued_at: i64,
    pub bump: u8,
}


#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
}
