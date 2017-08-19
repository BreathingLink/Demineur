var minesWeeper = {
    grid: document.getElementById('grid'),
    setGrid: function () {
        var div;

        for (var i = 0; i < 480; i++) {
            div = document.createElement('div');
            div.id = i;
            this.grid.appendChild(div);
        }
    }
};

minesWeeper.setGrid();