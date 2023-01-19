use soroban_auth::Identifier;
use soroban_sdk::contracttype;

#[derive(Clone)]
#[contracttype]
pub struct ApprovalAll {
    pub operator: Identifier,
    pub owner: Identifier,
}

#[derive(Clone)]
#[contracttype]
pub enum ApprovalKey {
    All(ApprovalAll),
    ID(i128),
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Balance(Identifier),
    Nonce(Identifier),
    Minted(Identifier),
    Admin,
    Name,
    Symbol,
    URI(i128),
    Approval(ApprovalKey),
    Owner(i128),
    Supply,
}
