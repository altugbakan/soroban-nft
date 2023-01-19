#![cfg(any(test, feature = "testutils"))]

use crate::contract::{NonFungibleToken, NonFungibleTokenClient};
use ed25519_dalek::Keypair;
use soroban_auth::{Ed25519Signature, Identifier, Signature, SignaturePayload, SignaturePayloadV0};
use soroban_sdk::testutils::ed25519::Sign;
use soroban_sdk::{symbol, AccountId, Bytes, BytesN, Env, IntoVal};

pub const TOKEN_NAME: &str = "Non Fungible Dogs";
pub const TOKEN_SYMBOL: &str = "NFD";

pub fn register_contract(env: &Env) -> BytesN<32> {
    env.register_contract(None, NonFungibleToken {})
}

pub fn to_ed25519(env: &Env, kp: &Keypair) -> Identifier {
    Identifier::Ed25519(kp.public.to_bytes().into_val(env))
}

pub struct Token {
    env: Env,
    contract_id: BytesN<32>,
}

impl Token {
    pub fn new(env: &Env, contract_id: &BytesN<32>) -> Self {
        Self {
            env: env.clone(),
            contract_id: contract_id.clone(),
        }
    }

    pub fn create() -> (Env, Token) {
        let env: Env = Default::default();
        let contract_id = register_contract(&env);
        let token = Token::new(&env, &contract_id);
        (env, token)
    }

    pub fn initialize(&self, admin: &Identifier) {
        let name: Bytes = TOKEN_NAME.into_val(&self.env);
        let symbol: Bytes = TOKEN_SYMBOL.into_val(&self.env);
        NonFungibleTokenClient::new(&self.env, &self.contract_id).initialize(admin, &name, &symbol);
    }

    pub fn nonce(&self, owner: &Identifier) -> i128 {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).nonce(owner)
    }

    pub fn balance(&self, owner: &Identifier) -> i128 {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).balance(owner)
    }

    pub fn owner(&self, id: &i128) -> Identifier {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).owner(id)
    }

    pub fn token_uri(&self, id: &i128) -> Bytes {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).token_uri(id)
    }

    pub fn get_appr(&self, id: &i128) -> Identifier {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).get_appr(id)
    }

    pub fn is_appr(&self, owner: &Identifier, operator: &Identifier) -> bool {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).is_appr(&owner, &operator)
    }

    pub fn appr(&self, owner: &Keypair, operator: &Identifier, id: &i128) {
        let owner_id = to_ed25519(&self.env, owner);
        let nonce = self.nonce(&owner_id);

        let msg = SignaturePayload::V0(SignaturePayloadV0 {
            name: symbol!("appr"),
            contract: self.contract_id.clone(),
            network: self.env.ledger().network_passphrase(),
            args: (owner_id, &nonce, operator, id).into_val(&self.env),
        });

        let auth = Signature::Ed25519(Ed25519Signature {
            public_key: BytesN::from_array(&self.env, &owner.public.to_bytes()),
            signature: owner.sign(msg).unwrap().into_val(&self.env),
        });

        NonFungibleTokenClient::new(&self.env, &self.contract_id).appr(&auth, &nonce, operator, id);
    }

    pub fn appr_all(&self, owner: &Keypair, operator: &Identifier) {
        let owner_id = to_ed25519(&self.env, owner);
        let nonce = self.nonce(&owner_id);

        let msg = SignaturePayload::V0(SignaturePayloadV0 {
            name: symbol!("appr_all"),
            contract: self.contract_id.clone(),
            network: self.env.ledger().network_passphrase(),
            args: (owner_id, &nonce, operator).into_val(&self.env),
        });

        let auth = Signature::Ed25519(Ed25519Signature {
            public_key: BytesN::from_array(&self.env, &owner.public.to_bytes()),
            signature: owner.sign(msg).unwrap().into_val(&self.env),
        });

        NonFungibleTokenClient::new(&self.env, &self.contract_id)
            .appr_all(&auth, &nonce, operator, &true);
    }

    pub fn xfer(&self, from: &Keypair, to: &Identifier, id: &i128) {
        let from_id = to_ed25519(&self.env, from);
        let nonce = self.nonce(&from_id);

        let msg = SignaturePayload::V0(SignaturePayloadV0 {
            name: symbol!("xfer"),
            contract: self.contract_id.clone(),
            network: self.env.ledger().network_passphrase(),
            args: (from_id, &nonce, to, id).into_val(&self.env),
        });

        let auth = Signature::Ed25519(Ed25519Signature {
            public_key: BytesN::from_array(&self.env, &from.public.to_bytes()),
            signature: from.sign(msg).unwrap().into_val(&self.env),
        });

        NonFungibleTokenClient::new(&self.env, &self.contract_id).xfer(&auth, &nonce, to, id);
    }

    pub fn xfer_from(&self, spender: &Keypair, from: &Identifier, to: &Identifier, id: &i128) {
        let spender_id = to_ed25519(&self.env, spender);
        let nonce = self.nonce(&spender_id);

        let msg = SignaturePayload::V0(SignaturePayloadV0 {
            name: symbol!("xfer_from"),
            contract: self.contract_id.clone(),
            network: self.env.ledger().network_passphrase(),
            args: (spender_id, &nonce, from, to, id).into_val(&self.env),
        });

        let auth = Signature::Ed25519(Ed25519Signature {
            public_key: spender.public.to_bytes().into_val(&self.env),
            signature: spender.sign(msg).unwrap().into_val(&self.env),
        });

        NonFungibleTokenClient::new(&self.env, &self.contract_id)
            .xfer_from(&auth, &from, &to, &nonce, id);
    }

    pub fn mint(&self, admin: &Keypair, to: &Identifier, id: &i128) {
        let admin_id = to_ed25519(&self.env, admin);
        let nonce = self.nonce(&admin_id);

        let msg = SignaturePayload::V0(SignaturePayloadV0 {
            name: symbol!("mint"),
            contract: self.contract_id.clone(),
            network: self.env.ledger().network_passphrase(),
            args: (admin_id, &nonce, to, id).into_val(&self.env),
        });
        let auth = Signature::Ed25519(Ed25519Signature {
            public_key: admin.public.to_bytes().into_val(&self.env),
            signature: admin.sign(msg).unwrap().into_val(&self.env),
        });
        NonFungibleTokenClient::new(&self.env, &self.contract_id).mint(&auth, &nonce, to, id);
    }

    pub fn mint_next(&self, source_account: &AccountId) {
        NonFungibleTokenClient::new(&self.env, &self.contract_id)
            .with_source_account(source_account)
            .mint_next();
    }

    pub fn burn(&self, admin: &Keypair, id: &i128) {
        let from_id = to_ed25519(&self.env, admin);
        let nonce = self.nonce(&from_id);

        let msg = SignaturePayload::V0(SignaturePayloadV0 {
            name: symbol!("burn"),
            contract: self.contract_id.clone(),
            network: self.env.ledger().network_passphrase(),
            args: (from_id, &nonce, id).into_val(&self.env),
        });

        let auth = Signature::Ed25519(Ed25519Signature {
            public_key: BytesN::from_array(&self.env, &admin.public.to_bytes()),
            signature: admin.sign(msg).unwrap().into_val(&self.env),
        });

        NonFungibleTokenClient::new(&self.env, &self.contract_id).burn(&auth, &nonce, id);
    }

    pub fn set_admin(&self, admin: &Keypair, new_admin: &Identifier) {
        let admin_id = to_ed25519(&self.env, admin);
        let nonce = self.nonce(&admin_id);

        let msg = SignaturePayload::V0(SignaturePayloadV0 {
            name: symbol!("set_admin"),
            contract: self.contract_id.clone(),
            network: self.env.ledger().network_passphrase(),
            args: (admin_id, &nonce, new_admin).into_val(&self.env),
        });
        let auth = Signature::Ed25519(Ed25519Signature {
            public_key: admin.public.to_bytes().into_val(&self.env),
            signature: admin.sign(msg).unwrap().into_val(&self.env),
        });
        NonFungibleTokenClient::new(&self.env, &self.contract_id)
            .set_admin(&auth, &nonce, new_admin);
    }

    pub fn name(&self) -> Bytes {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).name()
    }

    pub fn symbol(&self) -> Bytes {
        NonFungibleTokenClient::new(&self.env, &self.contract_id).symbol()
    }
}
