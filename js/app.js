/**
 * @var Game module pattern
 * @author Daniel Valencia <2020/06/06>
 */
var Game = (function Game() {
    /**
     * @var score the score of a game
     * @var movements the movements of a game.
     * @var timer is an element HTML
     * @var title is an element HTML
     * @var score_text is an element HTML
     * @var btn_reinicio is an element HTML
     * @var movimientos_text is an element HTML
     */
    var score = 0
    var movements = 0
    var timer = $('#timer');
    var title = $("#main-titulo");
    var score_text = $("#score-text");
    var btn_reinicio = $("#btn-reinicio");
    var movimientos_text = $("#movimientos-text");

    /**
     * @var _myTimer timer
     */
    let _myTimer = {}

    /**
     * Class TimerGame control de game's timer
     * @author Daniel Valencia <2020/06/07>
     */
    class TimerGame {
        /**
         * Get the timer
         */
        static get myTimer(){
            return _myTimer
        }
        /**
         * Set the timer
         */
        static set myTimer(obj){
            _myTimer = obj
        }
    }

    /**
     * Start the necessary functions for proper operation.
     * @author Daniel Valencia <2020/06/06>
     */
    function init() {
        removeSessionStorage()
        // Every 5 seconds, varies the speed of the title color change
        setInterval(function () {
            setInterval(changeColorTitle, getRandomInt(1, 4) * 1000);
        }, 5000);
    }

    /**
     * Start the game
     * @author Daniel Valencia <2020/06/06>
     */
    function start() {
        // It is a new game
        if (!sessionStorage.activeGame) {
            changeStatusGame(true)
            newGame()
            startTimerGame()

        } else {
            // Restart game
            changeStatusGame()
            finishTimerGame()
            removeSessionStorage()
        }
    }

    /**
     * Initialize all variables
     * @author Daniel Valencia <2020/06/06>
     */
    function newGame() {
        score = 0
        movements = 0
        TimerGame.myTimer = {}
        sessionStorage.activeGame = true
    }

    /**
     * Start the countdown timer.
     * @author Daniel Valencia <2020/06/07>
     */
    function startTimerGame() {
        timer.html('')

        TimerGame.myTimer = timer.startTimer({
            onComplete: function (element) {
                timerComplete()
            },
            classNames: {
                hours: 'noShow',
                minutes: 'minutesTimer',
                seconds: 'secondsTimer',
                clearDiv: 'noShow',
                timeout: 'noShow'
            }
        });

        TimerGame.myTimer.trigger('start');
    }

    /**
     * Finish the countdown timer.
     * @author Daniel Valencia <2020/06/07>
     */
    function finishTimerGame() {
        TimerGame.myTimer.trigger('resetime');
        timer.html('<span>02:00</span>')
    }

    /**
     * When the timer finish
     * @author Daniel Valencia <2020/06/07>
     */
    function timerComplete() {
        timer.html('<span>00:00</span>')
    }

    /**
     * Remove the session storage
     * @author Daniel Valencia <2020/06/06>
     */
    function removeSessionStorage() {
        if (sessionStorage.activeGame) sessionStorage.removeItem("activeGame")
    }

    /**
     * Change the status (name) of game
     * @param Boolean status { true: Start Game , false: Restart game }
     */
    function changeStatusGame(status = false) {
        if (status) {
            btn_reinicio.html("Reiniciar")
        } else {
            btn_reinicio.html("Iniciar")
        }
    }

    /**
     * Change the color of the title.
     * @author Daniel Valencia <2020/06/06>
     */
    function changeColorTitle() {
        var yellowClass = "color-yellow"
        var whiteClass = "color-white"

        if (title.hasClass(yellowClass)) {
            title.removeClass(yellowClass)
            title.addClass(whiteClass)
        } else {
            title.removeClass(whiteClass)
            title.addClass(yellowClass)
        }
    }


    /**
     * Change the score
     * @param int newValue
     * @author Daniel Valencia <2020/06/06>
     */
    function changePunctuation(newValue) {
        score = score + newValue
        return Number(score)
    }

    /**
     * Show the current score
     * @author Daniel Valencia <2020/06/06>
     */
    function showPunctuation() {
        score_text.html(score)
    }

    /**
     * Change the movements
     * @param int newValue
     * @author Daniel Valencia <2020/06/06>
     */
    function changeMovements(newValue) {
        movements = movements + newValue
        return Number(movements)
    }

    /**
     * Show the current movements
     * @author Daniel Valencia <2020/06/06>
     */
    function showMovements() {
        movimientos_text.html(movements)
    }

    /**
     * Return a random int between parameter min and parameter max
     * @param int min
     * @param int max
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    return {
        init: init,
        start: start
    }
})();

/**
 * Cuando cargué el DOM
 * @author Daniel Valencia <2020/06/06>
 */
$(function () {
    Game.init()
})