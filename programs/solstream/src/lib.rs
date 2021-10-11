use {
    anchor_lang::{
        prelude::*,
        AnchorSerialize,
        solana_program::{
            program::invoke, 
            system_instruction, 
            system_program
        },
    },
};

declare_id!("7DJcaKq8MFF1CJDtBGA1tUJfdNyjzbmfQYGvBVW3t4fG");

// Idea: create an on-chain crank function to process tasks from priority queue
// Anyone can enqueue tasks.
// Annyone can call the crank function.
// When you enqueue a task, you have to pay a small fee.
// Fees get distributed to particpants who call the crank function within a given time-window.

// We can't schedule in-memory timers (too expensive, never-ending transactions), 
// so let's instead create an incentive to reward anyone anyone who comes and turns the crank.
//
// Parties who submit tasks for scheduling should pay the fees to reward those who turn the crank.

// TODO (task queue) add a signed SchedulePayment instruction to the priority queue for processing in the future
// TODO (task "timer") create on-chain "crank function" to pull tasks off priority queue if "scheduled_for" time is past due
// TODO (task processor) execute payment transfer and re-enqueue task if debt_balance is non-zero

/**
 * Program
 */

#[program]
pub mod solstream {
    use super::*;
    pub fn create_stream(
        ctx: Context<CreateStream>, 
        amount: u64,
        interval: u64,
        balance: u64,
        bump: u8,
    ) -> ProgramResult {
        // Get accounts
        let stream = &mut ctx.accounts.stream;
        let sender = &mut ctx.accounts.sender;
        let receiver = &mut ctx.accounts.receiver;
        let system_program = &mut ctx.accounts.system_program;
        let clock = &ctx.accounts.clock;

        // Initialize stream 
        stream.sender = sender.key();
        stream.receiver = receiver.key();
        stream.amount = amount;
        stream.interval = interval;
        stream.timestamp = clock.unix_timestamp;
        stream.bump = bump;

        // Transfer fee into task queue pool
        require!(
            sender.to_account_info().lamports() > balance,
            ErrorCode::NotEnoughSOL,
        );
        invoke(
            &system_instruction::transfer(
                &sender.key(), 
                &stream.key(), 
                balance
            ),
            &[
                sender.to_account_info().clone(),
                stream.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;

        return Ok(());
    }

    pub fn fund_stream(ctx: Context<FundStream>, amount: u64) -> ProgramResult {
        // Get accounts
        let stream = &mut ctx.accounts.stream;
        let sender = &mut ctx.accounts.sender;
        let system_program = &mut ctx.accounts.system_program;
    
        
        // Transfer funds into stream balance
        require!(
            sender.to_account_info().lamports() > amount,
            ErrorCode::NotEnoughSOL,
        );
        invoke(
            &system_instruction::transfer(
                &sender.key(), 
                &stream.key(), 
                amount
            ),
            &[
                sender.to_account_info().clone(),
                stream.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        
        return Ok(());        
    }

    pub fn process_stream(ctx: Context<ProcessStream>) -> ProgramResult {
        // Get accounts
        let stream = &mut ctx.accounts.stream;
        let signer = &mut ctx.accounts.signer;
        let receiver = &mut ctx.accounts.receiver;
        let _system_program = &mut ctx.accounts.system_program;
        let _clock = &mut ctx.accounts.clock;

        // TODO validate the stream timestamp

        // Transfer stream amount from escrow to receiver
        // Transfer bounty from escrow to signer
        let bounty: u64 = 500;  
        let total_amount = stream.amount + bounty;
        require!(
            stream.to_account_info().lamports() > total_amount,
            ErrorCode::NotEnoughSOL,
        );
        **stream.to_account_info().try_borrow_mut_lamports()? -= total_amount;
        **receiver.to_account_info().try_borrow_mut_lamports()? += stream.amount;
        **signer.to_account_info().try_borrow_mut_lamports()? += bounty;

        // TODO update the stream timestamp

        return Ok(());
    }
}


/**
 * Instructions
 */

#[derive(Accounts)]
#[instruction(amount: u64, interval: u64, balance: u64, bump: u8)]
pub struct CreateStream<'info> {
    #[account(
        init, 
        seeds = [sender.key().as_ref(), receiver.key().as_ref()],
        bump = bump,
        payer = sender, 
        space = 8 + 32 + 32 + 8 + 8 + 8 + 1
    )]
    pub stream: Account<'info, Stream>,
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct FundStream<'info> {
    #[account(
        mut,
        seeds = [sender.key().as_ref(), receiver.key().as_ref()],
        bump = stream.bump,
    )]
    pub stream: Account<'info, Stream>,
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessStream<'info> {
    #[account(
        mut,
        seeds = [sender.key().as_ref(), receiver.key().as_ref()],
        bump = stream.bump,
    )]
    pub stream: Account<'info, Stream>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub sender: AccountInfo<'info>,
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}

/**
 * Program-owned Accounts
 */

#[account]
pub struct Stream {
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub interval: u64,
    pub timestamp: i64,
    pub bump: u8,
}


/**
 * Errors
 */

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
}
