/// Minesweeper Betting Contract
/// Deploy on OneChain Testnet

module minesweeper_bet::minesweeper_game {
    use std::ascii::String;
    use std::vector;
    use std::signer;
    use std::coin;
    use std::address;
    use std::table;
    use std::timestamp;

    /// Error codes
    const E_INVALID_BET_AMOUNT: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_GAME_NOT_FOUND: u64 = 3;
    const E_GAME_ALREADY_STARTED: u64 = 4;
    const E_NOT_HOST: u64 = 5;
    const E_ALREADY_JOINED: u64 = 6;
    const E_GAME_NOT_ENDED: u64 = 7;
    const E_INVALID_SCORE: u64 = 8;
    const E_INVALID_PLAYER: u64 = 9;

    /// OCT token address on OneChain
    const OCT_TOKEN_ADDRESS: address = @0x2;

    /// House fee percentage (5%)
    const HOUSE_FEE_PERCENT: u8 = 5;

    /// Game status constants
    const STATUS_WAITING: u8 = 0;
    const STATUS_PLAYING: u8 = 1;
    const STATUS_FINISHED: u8 = 2;

    /// Struct for game registry - stores all games globally
    public struct GameRegistry has key {
        games: table::Table<String, GameRoom>,
    }

    /// Struct for a game room
    public struct GameRoom has key, store {
        id: String,
        host: address,
        bet_amount: u64,
        max_players: u64,
        players: vector<address>,
        status: u8,
        total_pool: u64,
        created_at: u64,
        started_at: u64,
    }

    /// Struct for player score
    public struct PlayerScore has store, drop {
        player: address,
        score: u64,
        mines_hit: u64,
    }

    /// Game events
    public struct GameCreatedEvent has drop, store {
        game_id: String,
        host: address,
        bet_amount: u64,
    }

    public struct PlayerJoinedEvent has drop, store {
        game_id: String,
        player: address,
        bet_amount: u64,
    }

    public struct GameStartedEvent has drop, store {
        game_id: String,
        player_count: u64,
        total_pool: u64,
    }

    public struct PrizesDistributedEvent has drop, store {
        game_id: String,
        winners: vector<address>,
        amounts: vector<u64>,
        house_fee: u64,
    }

    /// Initialize the contract (called once at deployment)
    public fun init(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        move_to(admin, GameRegistry {
            games: table::new(),
        });
    }

    /// Helper to get the registry address (module address)
    fun get_registry_address(): address {
        @minesweeper_bet
    }

    /// Borrow the global game registry (immutable)
    fun borrow_registry(): &GameRegistry {
        borrow_global<GameRegistry>(get_registry_address())
    }

    /// Borrow the global game registry (mutable)
    fun borrow_registry_mut(): &mut GameRegistry {
        borrow_global_mut<GameRegistry>(get_registry_address())
    }

    /// Create a new game room
    public fun create_game(
        account: &signer,
        game_id: String,
        bet_amount: u64,
        max_players: u64
    ): GameCreatedEvent {
        // Validate bet amount
        assert!(bet_amount > 0 && bet_amount <= 1000, E_INVALID_BET_AMOUNT);

        let host_addr = signer::address_of(account);
        let now = timestamp::now();

        // Create game room (stored in global registry)
        let game = GameRoom {
            id: game_id,
            host: host_addr,
            bet_amount,
            max_players,
            players: vector::empty(),
            status: STATUS_WAITING,
            total_pool: 0,
            created_at: now,
            started_at: 0,
        };

        // Store game in global registry
        let registry = borrow_registry_mut();
        table::add(&mut registry.games, game_id, game);

        GameCreatedEvent {
            game_id,
            host: host_addr,
            bet_amount,
        }
    }

    /// Join a game room
    public fun join_game(
        account: &signer,
        game_id: String
    ): PlayerJoinedEvent {
        let player_addr = signer::address_of(account);

        // Get mutable reference to game
        let registry = borrow_registry_mut();
        let game = table::borrow_mut(&mut registry.games, &game_id);

        // Validate game status
        assert!(game.status == STATUS_WAITING, E_GAME_ALREADY_STARTED);

        // Check not already joined
        let players = &game.players;
        let already_joined = vector::contains(players, &player_addr);
        assert!(!already_joined, E_ALREADY_JOINED);

        // Add player
        vector::push_back(&mut game.players, player_addr);
        game.total_pool = game.total_pool + game.bet_amount;

        PlayerJoinedEvent {
            game_id,
            player: player_addr,
            bet_amount: game.bet_amount,
        }
    }

    /// Start the game (called by host when room is full)
    public fun start_game(
        account: &signer,
        game_id: String
    ): GameStartedEvent {
        let host_addr = signer::address_of(account);

        // Get mutable reference to game
        let registry = borrow_registry_mut();
        let game = table::borrow_mut(&mut registry.games, &game_id);

        // Validate host
        assert!(game.host == host_addr, E_NOT_HOST);

        // Validate game status
        assert!(game.status == STATUS_WAITING, E_GAME_ALREADY_STARTED);

        game.status = STATUS_PLAYING;
        game.started_at = timestamp::now();
        let player_count = vector::length(&game.players);

        GameStartedEvent {
            game_id,
            player_count,
            total_pool: game.total_pool,
        }
    }

    /// Submit score for a player
    public fun submit_score(
        account: &signer,
        game_id: String,
        score: u64,
        mines_hit: u64
    ) {
        let player_addr = signer::address_of(account);

        // Get mutable reference to game
        let registry = borrow_registry_mut();
        let game = table::borrow_mut(&mut registry.games, &game_id);

        // Validate game is playing
        assert!(game.status == STATUS_PLAYING, E_GAME_NOT_ENDED);

        // Validate player is in game
        assert!(vector::contains(&game.players, &player_addr), E_INVALID_PLAYER);

        // Validate score (basic validation - actual validation should be done server-side)
        assert!(score <= 1000, E_INVALID_SCORE);

        // In a full implementation, store scores for later distribution
        // For now, we just validate the submission
    }

    /// Distribute prizes to top players
    public fun distribute_prizes(
        account: &signer,
        game_id: String,
        scores: vector<PlayerScore>
    ): PrizesDistributedEvent {
        let organizer_addr = signer::address_of(account);

        // Get mutable reference to game
        let registry = borrow_registry_mut();
        let game = table::borrow_mut(&mut registry.games, &game_id);

        // Validate game is finished or can be distributed
        assert!(game.status == STATUS_PLAYING || game.status == STATUS_FINISHED, E_GAME_NOT_ENDED);

        game.status = STATUS_FINISHED;

        // Calculate house fee (5%)
        let house_fee = (game.total_pool * (HOUSE_FEE_PERCENT as u64)) / 100;
        let prize_pool = game.total_pool - house_fee;

        // Determine number of winners (top 10%, max 5)
        let player_count = vector::length(&game.players);
        let mut num_winners = player_count / 10;
        if (num_winners < 1) { num_winners = 1 };
        if (num_winners > 5) { num_winners = 5 };

        // Distribution percentages: 40%, 25%, 15%, 10%, 10%
        let percentages: vector<u8> = vector[40, 25, 15, 10, 10];
        let mut winners: vector<address> = vector::empty();
        let mut amounts: vector<u64> = vector::empty();

        // Note: In production, scores should be sorted by score descending
        // For now, we use the order provided (assuming pre-sorted)
        let i = 0;
        while (i < num_winners && i < vector::length(&scores)) {
            let score_entry = *vector::borrow(&scores, i);
            let pct = *vector::borrow(&percentages, i);
            let amount = (prize_pool * (pct as u64)) / 100;

            vector::push_back(&mut winners, score_entry.player);
            vector::push_back(&mut amounts, amount);

            // Transfer prize to winner
            // Note: This requires the contract to hold the OCT tokens
            // In production, use a proper escrow pattern
            coin::transfer(game.total_pool, score_entry.player, amount);

            i = i + 1;
        };

        // Transfer house fee to organizer
        // coin::transfer(game.total_pool, organizer_addr, house_fee);

        PrizesDistributedEvent {
            game_id,
            winners,
            amounts,
            house_fee,
        }
    }

    /// Get game by ID (immutable reference)
    public fun get_game(game_id: String): &GameRoom {
        let registry = borrow_registry();
        table::borrow(&registry.games, &game_id)
    }

    /// Get game status
    public fun get_status(game_id: String): u8 {
        let game = get_game(game_id);
        game.status
    }

    /// Get total pool
    public fun get_total_pool(game_id: String): u64 {
        let game = get_game(game_id);
        game.total_pool
    }

    /// Get player count
    public fun get_player_count(game_id: String): u64 {
        let game = get_game(game_id);
        vector::length(&game.players)
    }
}
