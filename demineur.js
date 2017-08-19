var sweeper = {
    //
    // Variables
    //

    grid: document.getElementById('grid'),
    pMines: document.getElementById('nbMines'),
    message: document.getElementById('message'),

    nbMines: {easy: 10, medium: 40, hard: 99},
    nbCols: {easy: 10, medium: 16, hard: 30},
    nbCells: {easy: 100, medium: 256, hard: 480},

    remainingCells: null,
    coefs: [-1, -1, -1, 0, 1, 1, 1, 0],
    mines: [],
    ids: [],

    //
    // Fonctions internes
    //

    sqDist: function (x, y) {
        return (Math.floor(x / this.nbCols[grid.className]) - Math.floor(y / this.nbCols[grid.className]))**2
                + (x % this.nbCols[grid.className] - y % this.nbCols[grid.className])**2;
    },

    hasMine: function (id) {
        var has = false;

        for (var i = 0; i < this.mines.length; i++) {
            has = has || this.sqDist(this.mines[i], id) === 0;
        }

        return has;
    },

    countMines: function (id) {
        var count = 0;

        for (var i = 0; i < this.mines.length; i++) {
            count += ([1, 2].includes(this.sqDist(this.mines[i], id))) ? 1 : 0;
        }

        return count;
    },

    addAdjacents: function (id) {
        var newId;

        for (var i = 0; i < 8; i++) {
            newId = id + this.coefs[i] * this.nbCols[this.grid.className] + this.coefs[(i+2)%8];
            cell = document.getElementById(newId);

            if (0 <= newId && newId < this.nbCells[this.grid.className] && [1, 2].includes(this.sqDist(newId, id)) && cell.className === '') {
                this.ids.push(newId);
                cell.className = "waiting";
            }
        }
    },

    openCells: function () {
        var count, cell, id;

        while (this.ids.length !== 0) {
            id = this.ids[0];
            cell = document.getElementById(id);
            count = this.countMines(id);

            cell.className = 'c' + count;

            if (count === 0)
                this.addAdjacents(id);
            else
                cell.innerText = count;

            this.ids.shift();
            this.remainingCells--;
        }
    },

    setMatch: function (diff) {
        this.grid.className = diff;
        this.mines = [];
        this.remainingCells = this.nbCells[diff] - this.nbMines[diff];
        var i = 0;

        while (this.mines.length < this.nbMines[diff]) {
            if (Math.random() < (this.nbMines[diff] - this.mines.length) / (this.nbCells[diff] - i))
                this.mines.push(i);

            i++;
        }
    },

    disableGrid: function (won) {
        for (var i = 0; i < this.mines.length; i++)
            document.getElementById(this.mines[i]).className = (won) ? 'safe' : 'mine';

        this.message.style.display = "block";
        this.message.innerText = (won) ? 'Gagné !' : 'Perdu !';
    }
};

function cell_left_click (e) {
    if (e.target.className === '') {
        if (sweeper.hasMine(parseInt(e.target.id))) {
            sweeper.disableGrid(false);
            e.target.className = 'hole';
        }
        else {
            sweeper.ids.push(parseInt(e.target.id));
            e.target.className = 'waiting';
            sweeper.openCells();

            if (sweeper.remainingCells === 0)
                sweeper.disableGrid(true);
        }

        console.log(sweeper.remainingCells);
    }
}

function cell_right_click (e) {
    //
}

function button_click (e) {
    //
}

var div;
sweeper.grid.oncontextmenu = function () { return false; };

for (var i = 0; i < 480; i++) {
    div = document.createElement('div');
    div.id = i;
    div.onclick = cell_left_click;
    div.oncontextmenu = cell_right_click;
    sweeper.grid.appendChild(div);
}

sweeper.setMatch('easy');