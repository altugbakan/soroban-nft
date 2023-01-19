use crate::{interface::NftURIs, storage_types::DataKey};
use soroban_sdk::{Bytes, Env};

pub fn read_name(env: &Env) -> Bytes {
    let key = DataKey::Name;
    env.storage().get_unchecked(key).unwrap()
}

pub fn write_name(env: &Env, name: Bytes) {
    let key = DataKey::Name;
    env.storage().set(key, name)
}

pub fn read_symbol(env: &Env) -> Bytes {
    let key = DataKey::Symbol;
    env.storage().get_unchecked(key).unwrap()
}

pub fn write_symbol(env: &Env, symbol: Bytes) {
    let key = DataKey::Symbol;
    env.storage().set(key, symbol)
}

pub fn read_token_uri(env: &Env, id: i128) -> Bytes {
    let key = DataKey::URI(id);
    env.storage().get_unchecked(key).unwrap()
}

pub fn write_token_uri(env: &Env, id: i128, uri: Bytes) {
    let key = DataKey::URI(id);
    env.storage().set(key, uri)
}

pub fn get_rand_uri(env: &Env) -> Bytes {
    to_bytes(
        &env,
        match env.ledger().timestamp() % 9 {
            0 => NftURIs::Bacon.value(),
            1 => NftURIs::Bailey.value(),
            2 => NftURIs::Coco.value(),
            3 => NftURIs::Frankie.value(),
            4 => NftURIs::Marley.value(),
            5 => NftURIs::Noir.value(),
            6 => NftURIs::Riley.value(),
            7 => NftURIs::Scout.value(),
            8 => NftURIs::Shadow.value(),
            _ => panic!("impossible"),
        },
    )
}

pub fn to_bytes(env: &Env, value: &str) -> Bytes {
    Bytes::from_slice(&env, value.as_bytes())
}
