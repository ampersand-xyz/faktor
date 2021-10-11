use {
    anchor_lang::{
        prelude::*,
        solana_program::{program::invoke, system_instruction, system_program},
        AnchorSerialize,
    },
    // priority_queue::PriorityQueue,
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
    pub fn create_queue(ctx: Context<CreateQueue>, bump: u8) -> ProgramResult {
        // Get accounts
        let queue = &mut ctx.accounts.queue;
        // Initial task queue
        queue.bump = bump;
        return Ok(())
    }

    pub fn create_stream(
        ctx: Context<CreateStream>, 
        amount: u64, 
        interval: u64,
        bump: u8,
    ) -> ProgramResult {
        // Get accounts
        let stream = &mut ctx.accounts.stream;
        // let queue = &mut ctx.accounts.queue;
        let sender = &mut ctx.accounts.sender;
        let receiver = &mut ctx.accounts.receiver;
        let system_program = &mut ctx.accounts.system_program;

        // Initialize stream 
        stream.sender = sender.key();
        stream.receiver = receiver.key();
        stream.amount = amount;
        stream.interval = interval;
        stream.bump = bump;

        // Transfer fee into task queue pool
        let fee  = 500; // TODO fee should be a function of rent 
        require!(
            sender.to_account_info().lamports() > fee,
            ErrorCode::NotEnoughSOL,
        );
        invoke(
            &system_instruction::transfer(
                &sender.key(), 
                &stream.key(), 
                fee
            ),
            &[
                sender.to_account_info().clone(),
                stream.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;

        // TODO Collect signatures/approvals/rent/gas for transfers to be executed later. 
        // TODO Build a priority queue of transfer tasks.
        // TODO Process tasks from priority queue.
        // TODO Re-enqueue task if recurring.
        // TODO API to cancel a cash flow.
        // TODO API to estimate rent.

        return Ok(());
    }

}


/**
 * Instructions
 */

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateQueue<'info> {
    #[account(
        init, 
        seeds = [program_id.as_ref()],
        bump = bump,
        payer = signer, 
        space = 8 + 1
    )]
    pub queue: Account<'info, Queue>,
    #[account(mut)] // TODO restrict caller address?
    pub signer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64, interval: u64, bump: u8)]
pub struct CreateStream<'info> {
    #[account(
        init, 
        seeds = [sender.key().as_ref(), receiver.key().as_ref()],
        bump = bump,
        payer = sender, 
        space = 8 + 32 + 32 + 8 + 8 + 1
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


/**
 * Program-owned Accounts
 */

#[account]
pub struct Stream {
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub interval: u64,
    pub bump: u8,
}

#[account]
pub struct Queue {
    // pub tasks: PriorityQueue<Pubkey, String>,
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
