use crate::storage_types::DataKey;
use soroban_auth::Identifier;
use soroban_sdk::{BytesN, Env};

pub fn zero_address(env: &Env) -> Identifier {
    Identifier::Ed25519(BytesN::from_array(env, &[0u8; 32]))
}

pub fn read_owner(env: &Env, id: i128) -> Identifier {
    let key = DataKey::Owner(id);
    match env.storage().get(key) {
        Some(balance) => balance.unwrap(),
        None => zero_address(&env),
    }
}

pub fn write_owner(env: &Env, id: i128, owner: Identifier) {
    let key = DataKey::Owner(id);
    env.storage().set(key, owner);
}

pub fn check_owner(env: &Env, auth: &Identifier, id: i128) {
    assert!(
        auth == &read_owner(env, id),
        "not the owner for token {}",
        id
    );
}
