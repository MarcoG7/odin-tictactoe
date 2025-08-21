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


const DisplayController = (() => {
    const game_board_div = document.getElementById("game-board");
    const game_info_div = document.getElementById("game-info");

    const create_board = () => {
        game_board_div.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.addEventListener("click", cell_click);
            game_board_div.appendChild(cell);
        }
    };

    const cell_click = (e) => {
        const index = parseInt(e.target.dataset.index);
        const result = GameController.play_move(index);

        if (result.success) {
            update_display();

            if (result.game_over) {
                if (result.winner) {
                    game_info_div.textContent = result.message;
                    game_info_div.className = "game-info winner";
                } else if (result.tie) {
                    game_info_div.textContent = result.message;
                    game_info_div.className = "game-info tie";
                }
            } else {
                game_info_div.textContent = result.message;
                game_info_div.className = "game-info";
            }
        }
    };

    const update_display = () => {
        const board = Gameboard.get_board();
        const cells = document.querySelectorAll(".cell");

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.className = "cell";

            if (board[index] !== ' ') {
                cell.classList.add('taken');
                cell.classList.add(board[index].toLowerCase());
            }
        });
    };

    const setup_players = () => {
        const player1_name = document.getElementById("player1-name").value || "Player 1";
        const player2_name = document.getElementById("player2-name").value || "Player 2";

        GameController.set_players(player1_name, player2_name);
        GameController.reset_game();
        create_board();
        update_display();

        game_info_div.textContent = `${GameController.get_current_player().get_name()}'s turn (${GameController.get_current_player().get_marker()})`
        game_info_div.className = "game-info";
    };

    const reset_game = () => {
        if (GameController.is_game_active || confirm("Start a new game?")) {
            GameController.reset_game();
            update_display();
            game_info_div.textContent = `${GameController.get_current_player().get_name()}'s turn (${GameController.get_current_player().get_marker()})`
            game_info_div.className = "game-info";
        }
    };

    create_board();

    return {
        setup_players,
        reset_game
    }
})();


let btn_start_game = document.getElementById("btn-start-game");
btn_start_game.addEventListener("click", DisplayController.setup_players);

let btn_reset_game = document.getElementById("btn-reset");
btn_reset_game.addEventListener("click", DisplayController.reset_game);
