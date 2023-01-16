use crate::admin::{check_admin, has_administrator, read_administrator, write_administrator};
use crate::approval::{read_approval, read_approval_all, write_approval, write_approval_all};
use crate::balance::{read_balance, write_balance};
use crate::event;
use crate::interface::{NftURIs, NonFungibleTokenTrait, WriteType};
use crate::metadata::{
    read_name, read_symbol, read_token_uri, write_name, write_symbol, write_token_uri,
};
use crate::owner::{check_owner, read_owner, write_owner, zero_address};
use crate::storage_types::DataKey;
use soroban_auth::verify;
use soroban_auth::{Identifier, Signature};
use soroban_sdk::{contractimpl, symbol, Bytes, Env};

pub struct NonFungibleToken;
mod token {
    soroban_sdk::contractimport!(file = "./soroban_token_spec.wasm");
}

fn read_nonce(e: &Env, id: &Identifier) -> i128 {
    let key = DataKey::Nonce(id.clone());
    e.storage().get(key).unwrap_or(Ok(0)).unwrap()
}

fn verify_and_consume_nonce(e: &Env, auth: &Signature, expected_nonce: i128) {
    match auth {
        Signature::Invoker => {
            if expected_nonce != 0 {
                panic!("nonce should be zero for Invoker")
            }
            return;
        }
        _ => {}
    }

    let id = auth.identifier(e);
    let key = DataKey::Nonce(id.clone());
    let nonce = read_nonce(e, &id);

    if nonce != expected_nonce {
        panic!("incorrect nonce")
    }
    e.storage().set(key, &nonce + 1);
}

#[contractimpl]
impl NonFungibleTokenTrait for NonFungibleToken {
    fn initialize(env: Env, admin: Identifier, name: Bytes, symbol: Bytes) {
        if has_administrator(&env) {
            panic!("already initialized")
        }

        write_administrator(&env, admin);
        write_name(&env, name);
        write_symbol(&env, symbol);
    }

    fn nonce(env: Env, id: Identifier) -> i128 {
        read_nonce(&env, &id)
    }

    fn admin(env: Env) -> Identifier {
        read_administrator(&env)
    }

    fn set_admin(env: Env, admin: Signature, nonce: i128, new_admin: Identifier) {
        check_admin(&env, &admin);

        verify_and_consume_nonce(&env, &admin, nonce);

        let admin_id = admin.identifier(&env);

        verify(
            &env,
            &admin,
            symbol!("set_admin"),
            (&admin_id, nonce, &new_admin),
        );
        write_administrator(&env, new_admin.clone());
        event::set_admin(&env, admin_id, new_admin);
    }

    fn name(env: Env) -> Bytes {
        read_name(&env)
    }

    fn symbol(env: Env) -> Bytes {
        read_symbol(&env)
    }

    fn token_uri(env: Env, id: i128) -> Bytes {
        read_token_uri(&env, id)
    }

    /// Allows "operator" to manage token "id" if "owner" is the current owner of token "id".
    fn appr(env: Env, owner: Signature, nonce: i128, operator: Identifier, id: i128) {
        check_owner(&env, &owner.identifier(&env), id);
        verify_and_consume_nonce(&env, &owner, nonce);

        write_approval(&env, id, operator.clone());

        event::approve(&env, operator, id);
    }

    /// If "approved", allows "operator" to manage all tokens of "owner"
    fn appr_all(env: Env, owner: Signature, nonce: i128, operator: Identifier, approved: bool) {
        verify_and_consume_nonce(&env, &owner, nonce);

        write_approval_all(&env, owner.identifier(&env), operator.clone(), approved);
        event::approve_all(&env, operator, owner.identifier(&env))
    }

    /// Returns the identifier approved for token "id".
    fn get_appr(env: Env, id: i128) -> Identifier {
        read_approval(&env, id)
    }

    /// If "operator" is allowed to manage assets of "owner", return true.
    fn is_appr(env: Env, owner: Identifier, operator: Identifier) -> bool {
        read_approval_all(&env, owner, operator)
    }

    /// Get the amount of tokens that "owner" has.
    fn balance(env: Env, owner: Identifier) -> i128 {
        read_balance(&env, owner)
    }

    /// Get the owner of "id" token.
    fn owner(env: Env, id: i128) -> Identifier {
        read_owner(&env, id)
    }

    /// Transfer token "id" from "from" to "to.
    /// Emit event with topics = ["transfer", from: Identifier, to: Identifier], data = [id: i128]
    fn xfer(env: Env, from: Signature, nonce: i128, to: Identifier, id: i128) {
        check_owner(&env, &from.identifier(&env), id);
        verify_and_consume_nonce(&env, &from, nonce);

        write_owner(&env, id, to.clone());
        write_balance(&env, from.identifier(&env), WriteType::Remove);
        write_balance(&env, to.clone(), WriteType::Add);

        event::transfer(&env, from.identifier(&env), to, id);
    }

    /// Transfer token "id" from "from" to "to", consuming the allowance of "spender".
    /// Emit event with topics = ["transfer", from: Identifier, to: Identifier], data = [id: i128]
    fn xfer_from(env: Env, from: Identifier, to: Signature, nonce: i128, id: i128) {
        check_owner(&env, &from, id);
        verify_and_consume_nonce(&env, &to, nonce);

        if to.identifier(&env) == read_approval(&env, id)
            || read_approval_all(&env, from.clone(), to.identifier(&env))
        {
            write_approval(&env, id, zero_address(&env));

            write_owner(&env, id, to.identifier(&env));
            write_balance(&env, from.clone(), WriteType::Remove);
            write_balance(&env, to.identifier(&env), WriteType::Add);

            event::transfer(&env, from, to.identifier(&env), id);
        } else {
            panic!("not approved")
        }
    }

    /// If "admin" is the administrator, mint token "id" to "to".
    /// Emit event with topics = ["mint", admin: Identifier, to: Identifier], data = [id: i128]
    fn mint(env: Env, _admin: Signature, _nonce: i128, to: Identifier, id: i128) {
        // For this demo, let anyone mint.
        // check_admin(&env, &admin);
        // verify_and_consume_nonce(&env, &admin, nonce);

        write_balance(&env, to.clone(), WriteType::Add);

        // Create psuedo randomness.
        let uri = match env.ledger().timestamp() % 3 {
            0 => NftURIs::Pug.value(),
            1 => NftURIs::ShibaInu.value(),
            2 => NftURIs::StBernard.value(),
            _ => panic!("impossible"),
        };

        write_token_uri(&env, id, Bytes::from_slice(&env, uri.as_bytes()));

        event::mint(&env, to, id)
    }

    /// If "from" is the administrator or the token owner, burn token "id" from "from".
    /// Emit event with topics = ["burn", from: Identifier], data = [id: i128]
    fn burn(env: Env, admin: Signature, nonce: i128, id: i128) {
        check_admin(&env, &admin);
        verify_and_consume_nonce(&env, &admin, nonce);

        let from = read_owner(&env, id);
        write_owner(&env, id, zero_address(&env));
        write_balance(&env, from.clone(), WriteType::Remove);

        event::burn(&env, from, id);
    }
}
