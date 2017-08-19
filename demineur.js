(function () {
    //
    // Fonctionnel pur
    //

    var mkRecur = function (init, next, end) {
        var r = (i, acc, ...args) => (end(i, acc, args)) ? acc : r(i + 1, next(i, acc, args), ...args);
        return (...args) => r(0, init, ...args);
    };

    var fl = Math.floor;
    var coef = (x) => fl(((x + 1)*(x - 3)*(x - 7)*(x - 11) + 100) / 200);
    var sqDist = (x, y, nbCols) => (fl(x / nbCols) - fl(y / nbCols))**2 + (x % nbCols - y % nbCols)**2;

    var hasMine = mkRecur(false,
        (i, has, [mines, id]) => mines[i] === id,
        (i, has, [mines]) => has || i === mines.length);

    var countMines = mkRecur(0,
        (i, count, [mines, id, nbCols]) => count + fl((2 * sqDist(mines[i], id, nbCols) - 3)**(-2)),
        (i, nil, [mines]) => i === mines.length);

    var getAdjacents = mkRecur([],
        (i, ids, [id, nbCols, nbCells]) => {
            var newId = id + coef(i) * nbCols + coef(i + 2);
            return (0 <= newId && newId < nbCells && Math.abs(sqDist(newId, id, nbCols) - 1.5) === 0.5) ? ids.concat(newId) : ids;
        },
        (i, nil, none) => i === 8);

    function setLevel (e, m, h) {
        return (diff) => (diff === 'easy') ? e :
                        (diff === 'medium') ? m :
                        (diff === 'hard') ? h : null;
    }

    var getNbMines = setLevel(10, 40, 99);
    var getNbCols  = setLevel(10, 16, 30);
    var getNbCells = setLevel(100, 256, 480);

    //
    // Fonctionnel impur
    //

    var node = document.getElementById.bind(document);
    var _grid = node('grid');
    var _message = node('message');
    var _mines, _remainingCells;

    var setMatch = (function (randomize) {
        return function (diff) {
            _grid.className = diff;
            _remainingCells = getNbCells(diff) - getNbMines(diff);
            _mines = randomize(getNbMines(diff), getNbCells(diff));
        };
    })(mkRecur([],
        (i, mines, [nbMines, nbCells]) => (Math.random() < (nbMines - mines.length) / (nbCells - i)) ? mines.concat(i) : mines,
        (nil, mines, [nbMines]) => mines.length === nbMines
    ));

    var disable = (function (setClass) {
        return function (won) {
            _message.style.display = 'block';
            _message.innerText = (won) ? 'Gagné !' : 'Perdu !';
            setClass(_mines, won);
        };
    })(mkRecur(undefined,
        (i, nil, [mines, won]) => { node(mines[i]).className = (won) ? 'safe' : 'mine'; },
        (i, nil, [mines]) => i === mines.length
    ));

    var openCells = (function () {
        var next = (ids, nb) => {
            var count = null;
            var cell = node(ids[0]);

            if (cell.className === '') {
                count = countMines(_mines, ids[0], getNbCols(_grid.className));
                cell.className = 'c' + count;

                if (count === 0)
                    ids = ids.concat(getAdjacents(ids[0], getNbCols(_grid.className), getNbCells(_grid.className)));
                else
                    cell.innerText = count;
            }

            return [ids.slice(1), nb + ((count === null) ? 0 : 1)];
        };

        var r = (ids, nb) => (ids.length === 0) ? nb : r(...next(ids, nb));
        return (ids) => r(ids, 0);
    })();

    function cell_left_click (e) {
        if (e.target.className === '') {
            if (hasMine(_mines, parseInt(e.target.id))) {
                disable(false);
                e.target.className = 'hole';
            }
            else {
                _remainingCells -= openCells([parseInt(e.target.id)]);

                if (_remainingCells === 0) 
                    disable(true);
            }
        }
    }
    
    //
    //  Initialisation
    //

    (function r (i) {
        if (i < 480) {
            var div = document.createElement('div');
            div.id = i;
            div.onclick = cell_left_click;
            _grid.appendChild(div);

            r(i + 1);
        }
    })(0);

    setMatch('easy');
})();