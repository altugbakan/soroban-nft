use crate::owner::zero_address;
use crate::storage_types::DataKey;
use crate::storage_types::{ApprovalAll, ApprovalKey};
use soroban_auth::Identifier;
use soroban_sdk::Env;

pub fn read_approval(env: &Env, id: i128) -> Identifier {
    let key = DataKey::Approval(ApprovalKey::ID(id));
    if let Some(approval) = env.storage().get(key) {
        approval.unwrap()
    } else {
        zero_address(&env)
    }
}

pub fn read_approval_all(env: &Env, owner: Identifier, operator: Identifier) -> bool {
    let key = DataKey::Approval(ApprovalKey::All(ApprovalAll { operator, owner }));
    if let Some(approval) = env.storage().get(key) {
        approval.unwrap()
    } else {
        false
    }
}

pub fn write_approval(env: &Env, id: i128, operator: Identifier) {
    let key = DataKey::Approval(ApprovalKey::ID(id));
    env.storage().set(key, operator);
}

pub fn write_approval_all(env: &Env, owner: Identifier, operator: Identifier, approved: bool) {
    let key = DataKey::Approval(ApprovalKey::All(ApprovalAll { operator, owner }));
    env.storage().set(key, approved);
}
