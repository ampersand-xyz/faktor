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
pub mod cashflow {
    use super::*;
    pub fn create(ctx: Context<Create>, amount: u64) -> ProgramResult {
        // Get accounts
        let cashflow = &mut ctx.accounts.cashflow;
        let sender = &mut ctx.accounts.sender;
        let receiver = &mut ctx.accounts.receiver;

        // Initialize cashflow 
        cashflow.sender = sender.key();
        cashflow.receiver = receiver.key();
        cashflow.amount = amount;

        // fn process(cashflow: Cashflow) {
        //     if cashflow.sender.lamports() < cashflow.amount {
        //         return Err(ErrorCode::NotEnoughSOL.into());
        //     }    
        //     invoke(
        //         &system_instruction::transfer(&cashflow.sender.key(), &cashflow.receiver.key(), cashflow.amount),
        //         &[
        //             cashflow.sender.to_account_info().clone(),
        //             cashflow.receiver.to_account_info().clone(),
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
pub struct Create<'info> {
    #[account(init, payer = sender, space = 8 + 32 + 32 + 8 + 1)]
    pub cashflow: Account<'info, Cashflow>,
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
pub struct Cashflow {
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
}

// #[account]
// pub struct TaskQueue {
//     pub queue: PriorityQueue<Pubkey, String>,
// }

#[error]
pub enum ErrorCode {
    #[msg("Not enough SOL")]
    NotEnoughSOL,
}
