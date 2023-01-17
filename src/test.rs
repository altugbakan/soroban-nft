#![cfg(test)]

use crate::interface::NftURIs;
use crate::metadata::to_bytes;
use crate::owner::zero_address;
use crate::testutils::{to_ed25519, Token};
use ed25519_dalek::Keypair;
use rand::thread_rng;

fn generate_keypair() -> Keypair {
    Keypair::generate(&mut thread_rng())
}

#[test]
fn test_mint() {
    let (env, token) = Token::create();

    let admin = generate_keypair();
    let admin_id = to_ed25519(&env, &admin);
    let user = generate_keypair();
    let user_id = to_ed25519(&env, &user);

    token.initialize(&admin_id);

    token.mint(&admin, &user_id, &1);
    assert_eq!(token.balance(&user_id), 1);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user_id);

    let uri = token.token_uri(&1);
    assert!(
        uri == to_bytes(&env, NftURIs::Pug.value())
            || uri == to_bytes(&env, NftURIs::ShibaInu.value())
            || uri == to_bytes(&env, NftURIs::StBernard.value())
    );
}

#[test]
fn test_burn_admin() {
    let (env, token) = Token::create();

    let admin = generate_keypair();
    let admin_id = to_ed25519(&env, &admin);
    let user = generate_keypair();
    let user_id = to_ed25519(&env, &user);

    token.initialize(&admin_id);

    token.mint(&admin, &user_id, &1);
    assert_eq!(token.balance(&user_id), 1);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user_id);

    token.burn(&admin, &1);
    assert_eq!(token.balance(&user_id), 0);
    assert_eq!(token.owner(&1), zero_address(&env));
}

#[test]
fn test_xfer() {
    let (env, token) = Token::create();

    let admin = generate_keypair();
    let admin_id = to_ed25519(&env, &admin);
    let user1 = generate_keypair();
    let user1_id = to_ed25519(&env, &user1);
    let user2 = generate_keypair();
    let user2_id = to_ed25519(&env, &user2);

    token.initialize(&admin_id);

    token.mint(&admin, &user1_id, &1);
    assert_eq!(token.balance(&user1_id), 1);
    assert_eq!(token.balance(&user2_id), 0);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user1_id);

    token.xfer(&user1, &user2_id, &1);
    assert_eq!(token.balance(&user1_id), 0);
    assert_eq!(token.balance(&user2_id), 1);
    assert_eq!(token.nonce(&user1_id), 1);
    assert_eq!(token.owner(&1), user2_id);
}

#[test]
#[should_panic(expected = "not the owner for token 2")]
fn test_xfer_non_owner() {
    let (env, token) = Token::create();

    let admin = generate_keypair();
    let admin_id = to_ed25519(&env, &admin);
    let user1 = generate_keypair();
    let user1_id = to_ed25519(&env, &user1);
    let user2 = generate_keypair();
    let user2_id = to_ed25519(&env, &user2);

    token.initialize(&admin_id);

    token.mint(&admin, &user1_id, &1);
    assert_eq!(token.balance(&user1_id), 1);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user1_id);

    token.xfer(&user1, &user2_id, &2);
}

#[test]
fn test_xfer_from_appr_id() {
    let (env, token) = Token::create();

    let admin = generate_keypair();
    let user1 = generate_keypair();
    let user2 = generate_keypair();
    let user3 = generate_keypair();
    let admin_id = to_ed25519(&env, &admin);
    let user1_id = to_ed25519(&env, &user1);
    let user2_id = to_ed25519(&env, &user2);
    let user3_id = to_ed25519(&env, &user3);

    token.initialize(&admin_id);

    token.mint(&admin, &user1_id, &1);
    assert_eq!(token.balance(&user1_id), 1);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user1_id);

    token.appr(&user1, &user3_id, &1);
    assert_eq!(token.get_appr(&1), user3_id);

    token.xfer_from(&user3, &user1_id, &user2_id, &1);
    assert_eq!(token.balance(&user2_id), 1);
    assert_eq!(token.balance(&user1_id), 0);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user2_id);
    assert_eq!(token.get_appr(&1), zero_address(&env));
}

#[test]
fn test_xfer_from_appr_all() {
    let (env, token) = Token::create();

    let admin = generate_keypair();
    let user1 = generate_keypair();
    let user2 = generate_keypair();
    let user3 = generate_keypair();
    let admin_id = to_ed25519(&env, &admin);
    let user1_id = to_ed25519(&env, &user1);
    let user2_id = to_ed25519(&env, &user2);
    let user3_id = to_ed25519(&env, &user3);

    token.initialize(&admin_id);

    token.mint(&admin, &user1_id, &1);
    assert_eq!(token.balance(&user1_id), 1);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user1_id);

    token.appr_all(&user1, &user3_id);
    assert!(token.is_appr(&user1_id, &user3_id));

    token.xfer_from(&user3, &user1_id, &user2_id, &1);
    assert_eq!(token.balance(&user2_id), 1);
    assert_eq!(token.balance(&user1_id), 0);
    assert_eq!(token.nonce(&admin_id), 1);
    assert_eq!(token.owner(&1), user2_id);
    assert_eq!(token.get_appr(&1), zero_address(&env));
}

#[test]
#[should_panic(expected = "not approved")]
fn test_xfer_from_non_approved() {
    let (env, token) = Token::create();

    let admin1 = generate_keypair();
    let user1 = generate_keypair();
    let user2 = generate_keypair();
    let user3 = generate_keypair();
    let admin1_id = to_ed25519(&env, &admin1);
    let user1_id = to_ed25519(&env, &user1);
    let user2_id = to_ed25519(&env, &user2);

    token.initialize(&admin1_id);

    token.mint(&admin1, &user1_id, &1);
    assert_eq!(token.balance(&user1_id), 1);
    assert_eq!(token.nonce(&admin1_id), 1);
    assert_eq!(token.owner(&1), user1_id);

    token.xfer_from(&user3, &user1_id, &user2_id, &1);
}

#[test]
#[should_panic(expected = "already initialized")]
fn test_initialize_already_initialized() {
    let (env, token) = Token::create();

    let admin1 = generate_keypair();
    let admin1_id = to_ed25519(&env, &admin1);

    token.initialize(&admin1_id);
    token.initialize(&admin1_id);
}

#[test]
#[should_panic(expected = "not authorized by admin")]
fn test_set_admin_bad_actor() {
    let (env, token) = Token::create();

    let admin = generate_keypair();
    let user = generate_keypair();
    let admin_id = to_ed25519(&env, &admin);
    let user_id = to_ed25519(&env, &user);

    token.initialize(&admin_id);

    token.set_admin(&user, &user_id);
}
