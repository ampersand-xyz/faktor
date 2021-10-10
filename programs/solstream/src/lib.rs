use {
    anchor_lang::{
        prelude::*,
        // solana_program::{program::invoke, system_instruction, system_program},
        solana_program::system_program,
        AnchorSerialize,
    },
    // priority_queue::PriorityQueue,
};

declare_id!("7DJcaKq8MFF1CJDtBGA1tUJfdNyjzbmfQYGvBVW3t4fG");

// TODO (task queue) add a signed SchedulePayment instruction to the priority queue for processing in the future
// TODO (task "timer") create on-chain "crank function" to pull tasks off priority queue if "scheduled_for" time is past due
// TODO (task processor) execute payment transfer and re-enqueue task if debt_balance is non-zero

#[program]
pub mod solstream {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> ProgramResult {
        // Get accounts
        let task_queue = &mut ctx.accounts.task_queue;
        // Initial task queue
        task_queue.bump = bump;
        return Ok(())
    }

    // TODO define the request interface
    pub fn create(
        ctx: Context<Create>, 
        amount: u64, 
        bump: u8,
    ) -> ProgramResult {
        // Get accounts
        let stream = &mut ctx.accounts.stream;
        let sender = &mut ctx.accounts.sender;
        let receiver = &mut ctx.accounts.receiver;

        // Initialize stream 
        let _fee = 500; // TODO fee should be a function of rent 
        stream.sender = sender.key();
        stream.receiver = receiver.key();
        stream.amount = amount;
        stream.bump = bump;

        // TODO transfer fee into task queue balance

        // fn process(stream: Stream) {
        //     if stream.sender.lamports() < stream.amount {
        //         return Err(ErrorCode::NotEnoughSOL.into());
        //     }    
        //     invoke(
        //         &system_instruction::transfer(&stream.sender.key(), &stream.receiver.key(), stream.amount),
        //         &[
        //             stream.sender.to_account_info().clone(),
        //             stream.receiver.to_account_info().clone(),
        //             system_program.to_account_info().clone(),
        //         ],
        //     )?;
        // }

        // TODO Collect signatures/approvals/rent/gas for transfers to be executed later. 
        // TODO Build a priority queue of transfer tasks.
        // TODO Process tasks from priority queue.
        // TODO Re-enqueue task if recurring.
        // TODO API to cancel a cash flow.
        // TODO API to estimate rent.

        return Ok(());
    }

    // fn process(transfer: Transfer) -> ProgramResult {
        // if transfer.sender.lamports() < transfer.amount {
        //     return Err(ErrorCode::NotEnoughSOL.into());
        // }
    //     invoke(
    //         &system_instruction::transfer(&sender.key(), &receiver.key(), transfer.amount),
    //         &[
    //             sender.to_account_info().clone(),
    //             receiver.to_account_info().clone(),
    //             system_program.to_account_info().clone(),
    //         ],
    //     )?;
    //     return Ok(())
    // }
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(
        init, 
        seeds = [signer.key.as_ref()],
        bump = bump,
        payer = signer, 
        space = 8 + 1
    )]
    pub task_queue: Account<'info, TaskQueue>,
    #[account(mut)] // TODO restrict caller address?
    pub signer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64, bump: u8)]
pub struct Create<'info> {
    #[account(
        init, 
        seeds = [sender.key.as_ref(), receiver.key.as_ref()],
        bump = bump,
        payer = sender, 
        space = 8 + 32 + 32 + 8 + 1
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

#[account]
pub struct Stream {
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

#[account]
pub struct TaskQueue {
    // pub tasks: PriorityQueue<Pubkey, String>,
    pub bump: u8,
}

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
}
