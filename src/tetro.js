/*
 --------------- TETRO ----------------------------------
 */
if (typeof window.TETRO !== 'undefined') var TETRO = {};

TETRO = (function () {

    var _self = this;

    /**
     * @type {{grid: Array, width: number, height: number}}
     */
    var Stack = {
        grid: [],
        width: 10,
        height: 20
    };

    /**
     * @type {{}}
     */
    var Game = {
        row: 0,
        col: 0,
        pieceCounter: 0,
        CurrentPiece: {
            id: 0,
            piece: {
                name: null,
                figure: null,
                color: null
            },
            cells: {}
        }
    };

    /**
     * Pieces type
     */
    var Pieces = {
        I: {
            name: 'I',
            figure: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            color: 'cyan'
        },
        O: {
            name: 'O',
            figure: [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            color: 'yellow'
        },
        S: {
            name: 'S',
            figure: [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            color: 'green'
        },
        Z: {
            name: 'Z',
            figure: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            color: 'red'
        },
        L: {
            name: 'L',
            figure: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'orange'
        },
        J: {
            name: 'J',
            figure: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'blue'
        },
        T: {
            name: 'T',
            figure: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'purple'
        }
    };

    /**
     * Init empty play area
     * @returns {boolean}
     */
    function initBucket() {
        Stack.grid = [];
        for (var r = 0; r < Stack.height; r++) {
            Stack.grid.unshift({});
            for (var c = 0; c < Stack.width; c++) {
                Stack.grid[0][c] = 0;
            }
        }
        return true;
    }

    /**
     * @param piece
     * @param row
     * @param col
     * @returns {{}}
     */
    function fillPiece(piece, row, col) {
        var cells = {};
        for (var r = 0; r < piece.length; r++) {
            // blocks
            for (var c = 0; c < piece[r].length; c++) {
                if (row + r >= 0) {
                    if (piece[r][c] === 1) {
                        Stack.grid[row + r][col + c] = 1;
                        if (typeof cells[row + r] === 'undefined') cells[row + r] = {};
                        cells[row + r][col + c] = 1;
                    } else {
                        if (typeof cells[row + r] === 'undefined') cells[row + r] = {};
                        cells[row + r][col + c] = 0;
                    }
                }
            }
        }
        return cells;
    }

    /**
     * @param cells
     */
    function clearPiece(cells) {
        for (var r in cells) {
            for (var c in cells[r]) {
                if (cells[r][c] === 1) {
                    Stack.grid[r][c] = 0;
                }
            }
        }
    }

    /**
     * @param piece
     * @param ccw
     * @returns {Array}
     */
    function rotatePiece(piece, ccw) {
        var col = piece[0].length;
        var row = piece.length;
        var rotate = [];

        if (ccw === true) {
            for (var c = col - 1, cc = 0; c >= 0; c--, cc++) {
                for (var r = 0; r < row; r++) {
                    if ((!rotate[cc])) {
                        rotate[cc] = [];
                    }
                    rotate[cc].push(piece[r][c]);
                }
            }
        }
        else {
            for (var r = row - 1; r >= 0; r--) {
                for (var c = 0; c < col; c++) {
                    if ((!rotate[c])) {
                        rotate[c] = [];
                    }
                    rotate[c].push(piece[r][c]);
                }
            }
        }
        return rotate;
    }

    /**
     * @param ccw
     */
    function rotate(ccw) {
        Game.CurrentPiece.piece.figure = rotatePiece(Game.CurrentPiece.piece.figure, ccw);
        clearPiece(Game.CurrentPiece.cells);
        Game.CurrentPiece.cells = fillPiece(Game.CurrentPiece.piece.figure, Game.row, Game.col);
    }

    /**
     * @param y
     * @param x
     * @param piece
     * @returns {boolean}
     */
    function collision(y, x, piece) {
        for (var r = 0; r < piece.length; r++) {
            for (var c = 0; c < piece[r].length; c++) {
                // first IF block not needed if erase piece before check
                if ((typeof Game.CurrentPiece.cells[y + r] === 'undefined'
                        || typeof Game.CurrentPiece.cells[y + r][x + c] === 'undefined'
                        || Game.CurrentPiece.cells[y + r][x + c] === 0
                    )
                ) {
                    // cell is empty and not go out from bucket
                    if (piece[r][c] &&
                        (
                            x + c < 0 || x + c >= Stack.width || y + r >= Stack.height || y + r < 0 || Stack.grid[y + r][x + c]
                        )
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /*
     ----------------------------- HELPERS -------------------------------
     */

    /**
     * @param count
     * @param length
     * @returns {number}
     */
    function getCenter(count, length) {
        return Math.round(( (count) / 2 - Math.round(length / 2)));
    }

    /**
     * @param min
     * @param max
     * @returns {*}
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @param obj
     * @returns {*}
     */
    function getRandomPiece(obj) {
        var rand = getRandomInt(1, Object.keys(obj).length);
        var count = 0;
        for (var prop in obj) {
            count++;
            if (count === rand) {
                return obj[prop];
            }
        }
    }

    /*
     ------------------------ CONTROLS -------------------------------
     */

    /**
     * move constants
     */
    Object.defineProperty(_self, 'UP', {
        value: 'up',
        writable: false,
        configurable: false
    });

    Object.defineProperty(_self, 'DOWN', {
        value: 'down',
        writable: false,
        configurable: false
    });

    Object.defineProperty(_self, 'LEFT', {
        value: 'left',
        writable: false,
        configurable: false
    });

    Object.defineProperty(_self, 'RIGHT', {
        value: 'right',
        writable: false,
        configurable: false
    });

    Object.defineProperty(_self, 'ROTATE', {
        value: 'rotate',
        writable: false,
        configurable: false
    });

    Object.defineProperty(_self, 'ROTATECCW', {
        value: 'rotateccw',
        writable: false,
        configurable: false
    });

    /**
     * @param direction
     */
    _self.move = function (direction) {
        var x = Game.col;
        var y = Game.row;
        var RotateFigure = Game.CurrentPiece.piece.figure;

        switch (direction) {
            case 'left':
                x--;
                break;
            case 'right':
                x++;
                break;
            case 'up':
                y--;
                break;
            case 'down':
                y++;
                break;
            case 'rotate':
                if (Game.CurrentPiece.piece.name !== 'O') {
                    RotateFigure = rotatePiece(Game.CurrentPiece.piece.figure, false);
                }
                break;
            case 'rotateccw':
                if (Game.CurrentPiece.piece.name !== 'O') {
                    RotateFigure = rotatePiece(Game.CurrentPiece.piece.figure, true);
                }
                break;
            default :
                return;
        }

        if (collision(y, x, RotateFigure)) {
            Game.row = y;
            Game.col = x;
            Game.CurrentPiece.piece.figure = RotateFigure;
            clearPiece(Game.CurrentPiece.cells);
            Game.CurrentPiece.cells = fillPiece(Game.CurrentPiece.piece.figure, Game.row, Game.col);
        }
    };

    /*
     ------------------------- GAME INIT ------------------------------
     */
    _self.init = function () {
        initBucket();

        // demo floor pieces
        Game.pieceCounter++;
        fillPiece(getRandomPiece(Pieces).figure, 18, 1);

        Game.pieceCounter++;
        fillPiece(getRandomPiece(Pieces).figure, 18, 6);

        // new spawn piece
        Game.CurrentPiece.piece = getRandomPiece(Pieces);

        Game.row = 0;
        Game.col = getCenter(Stack.width - 1, Game.CurrentPiece.piece.figure[0].length);

        Game.pieceCounter++;
        Game.CurrentPiece.id = Game.pieceCounter;
        Game.CurrentPiece.cells = fillPiece(Game.CurrentPiece.piece.figure, Game.row, Game.col);
    };

    /*
     ----------------------- DRAW ------------------------------
     */

    /**
     * draw
     */
    _self.draw = function () {
        clearFrame();
        drawFrame();
    };

    /**
     * clearFrame
     */
    function clearFrame() {
        document.getElementById('bucket').innerHTML = '';
    }

    /**
     * drawFrame
     */
    function drawFrame() {
        var table = document.createElement('table');

        for (var r = (Stack.height - 1); r >= 0; r--) {

            var row = document.createElement('tr');
            for (var c = 0; c < Stack.width; c++) {
                var td = document.createElement('td');

                if (Stack.grid[r][c] === 1) {
                    td.classList.add('block');
                }
                else if (typeof Game.CurrentPiece.cells[r] !== 'undefined'
                    && typeof Game.CurrentPiece.cells[r][c] !== 'undefined'
                    && Game.CurrentPiece.cells[r][c] !== 1
                    && Stack.grid[r][c] !== 1
                ) {
                    td.classList.add('o');
                }

                row.appendChild(td);
            }
            table.insertBefore(row, table.firstChild);

            var bucket = document.getElementById('bucket');
            bucket.insertBefore(table, bucket.firstChild);
        }
    }

    /*
     ----------------------- \ DRAW ------------------------------
     */

    return _self;

})();