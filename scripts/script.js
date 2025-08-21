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

Gameboard.set_mark(0, "X");
Gameboard.set_mark(4, "O");
Gameboard.display_board();