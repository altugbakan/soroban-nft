use soroban_auth::Identifier;
use soroban_sdk::{symbol, Env};

pub(crate) fn transfer(e: &Env, from: Identifier, to: Identifier, id: i128) {
    let topics = (symbol!("transfer"), from, to);
    e.events().publish(topics, id);
}

pub(crate) fn set_admin(e: &Env, admin: Identifier, new_admin: Identifier) {
    let topics = (symbol!("set_admin"), admin);
    e.events().publish(topics, new_admin);
}

pub(crate) fn mint(e: &Env, to: Identifier, id: i128) {
    let topics = (symbol!("mint"), to);
    e.events().publish(topics, id);
}

pub(crate) fn burn(e: &Env, from: Identifier, id: i128) {
    let topics = (symbol!("burn"), from);
    e.events().publish(topics, id);
}

pub(crate) fn approve(e: &Env, operator: Identifier, id: i128) {
    let topics = (symbol!("appr"), operator);
    e.events().publish(topics, id);
}

pub(crate) fn approve_all(e: &Env, operator: Identifier, owner: Identifier) {
    let topics = (symbol!("appr_all"), operator);
    e.events().publish(topics, owner);
}
