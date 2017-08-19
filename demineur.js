(function () {
    _grid = document.getElementById('grid');

    //
    // Fonctionnel pur
    //
    
    //
    //  Initialisation
    //

    (function r (i) {
        if (i < 480) {
            var div = document.createElement('div');
            div.id = i;
            _grid.appendChild(div);

            r(i + 1);
        }
    })(0);
})();