/// Minesweeper Betting Contract
/// Deploy on OneChain Testnet

module minesweeper_bet::minesweeper_game {
    use std::string;
    use std::vector;
    use one::object;
    use one::transfer;
    use one::tx_context;

    /// Error codes
    const E_INVALID_BET_AMOUNT: u64 = 1;
    const E_GAME_ALREADY_STARTED: u64 = 4;
    const E_NOT_HOST: u64 = 5;
    const E_ALREADY_JOINED: u64 = 6;
    const E_GAME_NOT_ENDED: u64 = 7;
    const E_INVALID_SCORE: u64 = 8;
    const E_INVALID_PLAYER: u64 = 9;

    /// House fee percentage (5%)
    const HOUSE_FEE_PERCENT: u8 = 5;

    /// Game status constants
    const STATUS_WAITING: u8 = 0;
    const STATUS_PLAYING: u8 = 1;
    const STATUS_FINISHED: u8 = 2;

    /// Struct for a game room (stored as owned object)
    public struct GameRoom has key, store {
        id: object::UID,
        game_id: string::String,
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
    public struct PlayerScore has store, drop, copy {
        player: address,
        score: u64,
        mines_hit: u64,
    }

    /// Game events
    public struct GameCreatedEvent has drop, store {
        game_id: string::String,
        host: address,
        bet_amount: u64,
    }

    public struct PlayerJoinedEvent has drop, store {
        game_id: string::String,
        player: address,
        bet_amount: u64,
    }

    public struct GameStartedEvent has drop, store {
        game_id: string::String,
        player_count: u64,
        total_pool: u64,
    }

    public struct PrizesDistributedEvent has drop, store {
        game_id: string::String,
        winners: vector<address>,
        amounts: vector<u64>,
        house_fee: u64,
    }

    /// Initialize the contract (called once at deployment)
    fun init(_ctx: &mut tx_context::TxContext) {
        // Contract initialization - no global registry needed
        // Games are stored as separate objects
    }

    /// Create a new game room
    public fun create_game(
        game_id: string::String,
        bet_amount: u64,
        max_players: u64,
        ctx: &mut tx_context::TxContext
    ): GameRoom {
        // Validate bet amount
        assert!(bet_amount > 0 && bet_amount <= 1000, E_INVALID_BET_AMOUNT);

        let host_addr = tx_context::sender(ctx);
        let now = tx_context::epoch(ctx);

        // Create game room as owned object with new UID
        GameRoom {
            id: object::new(ctx),
            game_id,
            host: host_addr,
            bet_amount,
            max_players,
            players: vector::empty(),
            status: STATUS_WAITING,
            total_pool: 0,
            created_at: now,
            started_at: 0,
        }
    }

    /// Join a game room (mutable reference passed in)
    public fun join_game(
        game: &mut GameRoom,
        ctx: &mut tx_context::TxContext
    ): PlayerJoinedEvent {
        let player_addr = tx_context::sender(ctx);

        // Validate game status
        assert!(game.status == STATUS_WAITING, E_GAME_ALREADY_STARTED);

        // Check not already joined
        let already_joined = vector::contains(&game.players, &player_addr);
        assert!(!already_joined, E_ALREADY_JOINED);

        // Add player
        vector::push_back(&mut game.players, player_addr);
        game.total_pool = game.total_pool + game.bet_amount;

        PlayerJoinedEvent {
            game_id: game.game_id,
            player: player_addr,
            bet_amount: game.bet_amount,
        }
    }

    /// Start the game (called by host when room is full)
    public fun start_game(
        game: &mut GameRoom,
        ctx: &mut tx_context::TxContext
    ): GameStartedEvent {
        let host_addr = tx_context::sender(ctx);

        // Validate host
        assert!(game.host == host_addr, E_NOT_HOST);

        // Validate game status
        assert!(game.status == STATUS_WAITING, E_GAME_ALREADY_STARTED);

        game.status = STATUS_PLAYING;
        game.started_at = tx_context::epoch(ctx);
        let player_count = vector::length(&game.players);

        GameStartedEvent {
            game_id: game.game_id,
            player_count,
            total_pool: game.total_pool,
        }
    }

    /// Submit score for a player
    public fun submit_score(
        game: &mut GameRoom,
        score: u64,
        _mines_hit: u64,
        ctx: &mut tx_context::TxContext
    ) {
        let player_addr = tx_context::sender(ctx);

        // Validate game is playing
        assert!(game.status == STATUS_PLAYING, E_GAME_NOT_ENDED);

        // Validate player is in game
        assert!(vector::contains(&game.players, &player_addr), E_INVALID_PLAYER);

        // Validate score (basic validation)
        assert!(score <= 1000, E_INVALID_SCORE);

        // In a full implementation, store scores for later distribution
    }

    /// Distribute prizes to top players
    public fun distribute_prizes(
        game: &mut GameRoom,
        scores: vector<PlayerScore>
    ): PrizesDistributedEvent {
        // Validate game is playing
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

        let mut i = 0;
        while (i < num_winners && i < vector::length(&scores)) {
            let score_entry = *vector::borrow(&scores, i);
            let pct = *vector::borrow(&percentages, i);
            let amount = (prize_pool * (pct as u64)) / 100;

            vector::push_back(&mut winners, score_entry.player);
            vector::push_back(&mut amounts, amount);

            // Note: Transfer would require the game object to hold the tokens
            // In production, implement proper escrow pattern
            i = i + 1;
        };

        PrizesDistributedEvent {
            game_id: game.game_id,
            winners,
            amounts,
            house_fee,
        }
    }

    /// Get game status
    public fun get_status(game: &GameRoom): u8 {
        game.status
    }

    /// Get total pool
    public fun get_total_pool(game: &GameRoom): u64 {
        game.total_pool
    }

    /// Get player count
    public fun get_player_count(game: &GameRoom): u64 {
        vector::length(&game.players)
    }

    /// Get game ID
    public fun get_game_id(game: &GameRoom): string::String {
        game.game_id
    }

    /// Get host address
    public fun get_host(game: &GameRoom): address {
        game.host
    }

    /// Check if player is in game
    public fun is_player(game: &GameRoom, player: address): bool {
        vector::contains(&game.players, &player)
    }

    /// Transfer game to new owner (for prize distribution)
    public fun transfer_game(game: GameRoom, to: address, _ctx: &mut tx_context::TxContext) {
        transfer::public_transfer(game, to);
    }
}
