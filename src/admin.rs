use crate::storage_types::DataKey;
use soroban_auth::{Identifier, Signature};
use soroban_sdk::Env;

pub fn has_administrator(env: &Env) -> bool {
    let key = DataKey::Admin;
    env.storage().has(key)
}

pub fn read_administrator(env: &Env) -> Identifier {
    let key = DataKey::Admin;
    env.storage().get_unchecked(key).unwrap()
}

pub fn write_administrator(env: &Env, id: Identifier) {
    let key = DataKey::Admin;
    env.storage().set(key, id);
}

pub fn check_admin(env: &Env, auth: &Signature) {
    let auth_id = auth.identifier(env);
    assert!(
        auth_id == read_administrator(env),
        "not authorized by admin"
    );
}
