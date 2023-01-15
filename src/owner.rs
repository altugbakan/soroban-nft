use crate::storage_types::DataKey;
use soroban_auth::{Identifier, Signature};
use soroban_sdk::{BytesN, Env};

pub fn zero_address(env: &Env) -> Identifier {
    Identifier::Ed25519(BytesN::from_array(env, &[0u8; 32]))
}

pub fn read_owner(env: &Env, id: i128) -> Identifier {
    let key = DataKey::Owner(id);
    env.storage().get_unchecked(key).unwrap()
}

pub fn write_owner(env: &Env, id: i128, owner: Identifier) {
    let key = DataKey::Owner(id);
    env.storage().set(key, owner);
}

pub fn check_owner(env: &Env, auth: &Signature, id: i128) {
    let auth_id = auth.identifier(env);
    if auth_id != read_owner(env, id) {
        panic!("not the owner for token {}", id)
    }
}
