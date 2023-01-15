pub trait NonFungibleTokenTrait {
    // --------------------------------------------------------------------------------
    // Authentication interface
    // --------------------------------------------------------------------------------

    // Returns the current nonce for "id".
    fn nonce(env: soroban_sdk::Env, id: soroban_auth::Identifier) -> i128;

    // --------------------------------------------------------------------------------
    // Admin interface
    // --------------------------------------------------------------------------------

    /// Returns the current administrator
    fn admin(env: soroban_sdk::Env) -> soroban_auth::Identifier;

    /// If "admin" is the administrator, set the administrator to "new_admin".
    /// Emit event with topics = ["set_admin", admin: Identifier], data = [new_admin: Identifier]
    fn set_admin(
        env: soroban_sdk::Env,
        admin: soroban_auth::Signature,
        nonce: i128,
        new_admin: soroban_auth::Identifier,
    );

    // --------------------------------------------------------------------------------
    // Metadata interface
    // --------------------------------------------------------------------------------

    // Get the name for this token.
    fn name(env: soroban_sdk::Env) -> soroban_sdk::Bytes;

    // Get the symbol for this token.
    fn symbol(env: soroban_sdk::Env) -> soroban_sdk::Bytes;

    // Get the uniform resource identifier for token "id".
    fn token_uri(env: soroban_sdk::Env, id: i128) -> soroban_sdk::Bytes;

    // --------------------------------------------------------------------------------
    // Token interface
    // --------------------------------------------------------------------------------

    /// Allows "operator" to manage token "id" if "owner" is the current owner of token "id".
    /// Emit event with topics = ["appr", operator: Identifier], data = [id: i128]
    fn appr(
        env: soroban_sdk::Env,
        owner: soroban_auth::Signature,
        operator: soroban_auth::Identifier,
        id: i128,
    );

    /// If "approved", allows "operator" to manage all tokens of "owner"
    /// Emit event with topics = ["appr_all", operator: Identifier], data = [owner: Identifier]
    fn appr_all(
        env: soroban_sdk::Env,
        owner: soroban_auth::Signature,
        operator: soroban_auth::Identifier,
        approved: bool,
    );

    /// Returns the identifier approved for token "id".
    fn get_appr(env: soroban_sdk::Env, id: i128) -> soroban_auth::Identifier;

    /// If "operator" is allowed to manage assets of "owner", return true.
    fn is_appr(
        env: soroban_sdk::Env,
        owner: soroban_auth::Identifier,
        operator: soroban_auth::Identifier,
    ) -> bool;

    /// Get the balance of "id".
    fn balance(env: soroban_sdk::Env, owner: soroban_auth::Identifier) -> i128;

    /// Get the owner of "id" token.
    fn owner(env: soroban_sdk::Env, id: i128) -> soroban_auth::Identifier;

    /// Transfer token "id" from "from" to "to.
    /// Emit event with topics = ["transfer", from: Identifier, to: Identifier], data = [id: i128]
    fn xfer(
        env: soroban_sdk::Env,
        from: soroban_auth::Signature,
        nonce: i128,
        to: soroban_auth::Identifier,
        id: i128,
    );

    /// Transfer token "id" from "from" to "to", consuming the allowance of "spender".
    /// Emit event with topics = ["transfer", from: Identifier, to: Identifier], data = [id: i128]
    fn xfer_from(
        env: soroban_sdk::Env,
        spender: soroban_auth::Signature,
        nonce: i128,
        from: soroban_auth::Identifier,
        to: soroban_auth::Identifier,
        id: i128,
    );

    /// If "admin" is the administrator, mint token "id" to "to".
    /// Emit event with topics = ["mint", admin: Identifier, to: Identifier], data = [id: i128]
    fn mint(
        env: soroban_sdk::Env,
        admin: soroban_auth::Signature,
        nonce: i128,
        to: soroban_auth::Identifier,
        id: i128,
    );

    /// If "from" is the administrator or the token owner, burn token "id".
    /// Emit event with topics = ["burn", from: Identifier], data = [id: i128]
    fn burn(env: soroban_sdk::Env, from: soroban_auth::Signature, nonce: i128, id: i128);

    // --------------------------------------------------------------------------------
    // Implementation Interface
    // --------------------------------------------------------------------------------

    /// Initialize the contract with "admin" as administrator, "name" as the name, and
    /// "symbol" as the symbol.
    fn initialize(
        e: soroban_sdk::Env,
        admin: soroban_auth::Identifier,
        name: soroban_sdk::Bytes,
        symbol: soroban_sdk::Bytes,
    );
}
