use crate::{interface::WriteType, storage_types::DataKey};
use soroban_auth::Identifier;
use soroban_sdk::Env;

pub fn read_balance(env: &Env, owner: Identifier) -> i128 {
    let key = DataKey::Balance(owner);
    if let Some(balance) = env.storage().get(key) {
        balance.unwrap()
    } else {
        0
    }
}

pub fn write_balance(env: &Env, owner: Identifier, write_type: WriteType) {
    let key = DataKey::Balance(owner.clone());
    let balance = read_balance(env, owner);

    match write_type {
        WriteType::Add => env.storage().set(key, balance + 1),
        WriteType::Remove => env.storage().set(key, balance - 1),
    }
}
