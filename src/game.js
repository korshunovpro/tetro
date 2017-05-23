/*
 --------------- GAME ----------------------------------
 */
if (typeof window.GAME !== 'undefined') var GAME = {};

/**
 * reference: http://codeincomplete.com/posts/javascript-game-foundations-the-game-loop/
 */
GAME = (function () {
    var now,
        dt   = 0,
        last = Date.now(),
        step = 1/60;

    // init game
    TETRO.init();

    // main loop
    function frame() {
        now = Date.now();
        dt = dt + Math.min(1, (now - last) / 1000);
        while(dt > step) {
            dt = dt - step;
            // loop
            TETRO.draw();
        }
        last = now;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    // \ main loop

    return this;
})();