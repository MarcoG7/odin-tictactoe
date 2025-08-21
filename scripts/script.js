const Gameboard = (() => {
    let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

    const get_board = () => board;

    const set_mark = (index, mark) => {
        if (board[index] === " ") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const is_spot_taken = (index) => {
        return board[index] !== " ";
    };

    const reset_board = () => {
        board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    };

    const display_board = () => {
        console.log(`
            ${board[0]} | ${board[1]} | ${board[2]}
            ---------
            ${board[3]} | ${board[4]} | ${board[5]}
            ---------
            ${board[6]} | ${board[7]} | ${board[8]}
        `);
    };

    return {
        get_board,
        set_mark,
        is_spot_taken,
        reset_board,
        display_board
    }
})();


const Player = (name, marker) => {
    const get_name = () => name;
    const get_marker = () => marker;

    const make_move = (gameboard, position) => {
        return gameboard.set_mark(position, marker);
    };

    return {
        get_name,
        get_marker,
        make_move
    }
};


const GameController = (() => {
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let current_player = player1;
    let is_game_active = true;

    const winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const switch_player = () => {
        current_player = current_player === player1 ? player2 : player1;
    };

    const get_current_player = () => current_player;

    const check_win = () => {
        const board = Gameboard.get_board();

        for (combination of winning_combinations) {
            const [a, b, c] = combination;

            if (board[a] != " " && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const check_tie = () => Gameboard.get_board().every(cell => cell !== " ");

    const play_move = (position) => {
        if (!is_game_active) {
            return { success: false, message: "Game is over" };
        }

        if (Gameboard.is_spot_taken(position)) {
            return { success: false, message: "Spot already taken" };
        }

        Gameboard.set_mark(position, current_player.get_marker());

        const win = check_win();
        if (win) {
            is_game_active = false;
            return {
                success: true,
                game_over: true,
                winner: current_player.get_name(),
                message: `${current_player.get_name()} wins!`
            };
        }

        const tie = check_tie();
        if (tie) {
            is_game_active = false;
            return {
                success: true,
                game_over: true,
                tie: true,
                message: "It's a tie"
            };
        }

        switch_player();
        return {
            success: true,
            game_over: false,
            message: `${current_player.get_name()}'s turn`
        };
    };

    const reset_game = () => {
        Gameboard.reset_board();
        current_player = player1;
        is_game_active = true;
    };

    const set_players = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        current_player = player1;
    };

    const get_game_state = () => {
        return {
            current_player: current_player.get_name(),
            is_game_active,
            board: Gameboard.get_board()
        };
    };

    return {
        play_move,
        get_current_player,
        reset_game,
        set_players,
        get_game_state
    }
})();


GameController.set_players("Alice", "Bob");
console.log(GameController.play_move(0)); // Alice plays
console.log(GameController.play_move(1)); // Bob plays  
console.log(GameController.play_move(4)); // Alice plays
console.log(GameController.play_move(2)); // Bob plays
console.log(GameController.play_move(8)); // Alice plays - might win!
Gameboard.display_board();
