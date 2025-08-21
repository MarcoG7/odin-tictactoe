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

const player1 = Player("Alice", "X");
const player2 = Player("Bob", "O");

// Test the players
console.log(player1.get_name()); // "Alice"
console.log(player1.get_marker()); // "X"
console.log(player2.get_name()); // "Bob"
console.log(player2.get_marker()); // "O"

player1.make_move(Gameboard, 0);
player2.make_move(Gameboard, 4);
Gameboard.display_board();
