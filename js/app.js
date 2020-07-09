/**
 * @var Game module pattern
 * @author Daniel Valencia <2020/06/06>
 */
var Game = (function Game() {
    /**
     * @var score the score of a game
     * @var movements the movements of a game.
     * @var statusGame the status of the game.
     */
    var score = 0
    var movements = 0
    var statusGame = 'new'

    /**
     * @const width is the quantity of columns and rows
     * @const squares is the quantity of candies
     */
    const width = 7
    const squares = []
    const candies = [
        './image/1.png',
        './image/2.png',
        './image/3.png',
        './image/4.png'
    ]

    /**
     * Elements HTML
     */
    const grid = $("#panel-tablero");
    const timer = $('#timer');
    const title = $("#main-titulo");
    const score_text = $("#score-text");
    const btn_reinicio = $("#btn-reinicio");
    const movimientos_text = $("#movimientos-text");

    /**
     * @let _myTimer timer
     * @let Dragging the Candy
     */
    let _myTimer = {}
    let candyBeingDragged
    let candyBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced

    /**
     * Class TimerGame control de game's timer
     * @author Daniel Valencia <2020/06/07>
     */
    class TimerGame {
        /**
         * Get the timer
         */
        static get myTimer() {
            return _myTimer
        }
        /**
         * Set the timer
         */
        static set myTimer(obj) {
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
            createBoard()
            addEventsBoard()

        } else {
            // Restart game
            changeStatusGame()
            if (statusGame == 'end') {
                resetGame()
            } else {
                finishTimerGame()
                removeCandiesBoard()
            }
            changePunctuation()
            changeMovements()

            showPunctuation()
            showMovements()

            removeSessionStorage()
        }
    }

    /**
     * Initialize all variables
     * @author Daniel Valencia <2020/06/06>
     */
    function newGame() {
        grid.html('')
        statusGame = "new"
        TimerGame.myTimer = {}
        sessionStorage.activeGame = true
        squares.splice(0, squares.length)
    }

    /**
     * Reset the original values of the game
     * @author Daniel Valencia <2020/06/08>
     */
    function resetGame() {
        $("#end-game").addClass("noShow")
        $("#panel-score").css("width", "25%")
        $("#time").show("fast")
        title.show("fast")
        grid.show("fast")
    }

    /**
     * Create the board
     * @author Daniel Valencia <2020/06/07>
     */
    function createBoard() {
        for (let i = 1; i < parseInt(width * width + 1); i++) {
            let randomColor = getRandomInt(null, candies.length)

            let square = $('<div/>', {
                id: i,
                draggable: 'true',
                style: 'background-image: url("' + candies[randomColor] + '")'
            });
            squares.push(square)
        }
        grid.append(squares)
    }

    /**
     * Remove all candies of the board
     * @author Daniel Valencia <2020/06/08>
     */
    function removeCandiesBoard() {
        grid.html('')
    }

    /**
     * Show the results obtained
     * @author Daniel Valencia <2020/06/08>
     */
    function showResults() {
        grid.hide("slow")
        title.hide("slow")
        $("#time").hide("slow")
        $("#panel-score").css("width", "100%")
        $("#end-game").removeClass("noShow")
    }

    /**
     * Add events to the board's candies
     * @author Daniel Valencia <2020/06/07>
     */
    function addEventsBoard() {
        let events = ["dragstart", "dragend", "dragover", "dragenter", "drageleave", "drop"]
        let nameFunctionEvents = ["dragStart", "dragEnd", "dragOver", "dragEnter", "dragLeave", "dragDrop"]

        squares.forEach(function (square, indexSquare) {
            events.forEach(function (element, index) {
                square.on(element, eval(nameFunctionEvents[index]))
            })
        })
    }

    /**
     * Drag Over
     * @param Event e
     * @author Daniel Valencia <2020/06/08>
     */
    function dragOver(e) {
        e.preventDefault()
    }

    /**
     * Drag Enter
     * @param Event e
     * @author Daniel Valencia <2020/06/08>
     */
    function dragEnter(e) {
        e.preventDefault()
    }

    /**
     * Drag Leave, Remove background image style
     * @author Daniel Valencia <2020/06/08>
     */
    function dragLeave() {
        $("#" + this.id).css("background-image", "")
        console.log("DragLeave", this.id)
    }

    /**
     * Drag Start:
     * Get the "candy" and "square" origin
     * @author Daniel Valencia <2020/06/08>
     */
    function dragStart() {
        candyBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)
        console.log("* DragStart: ", squareIdBeingDragged)
    }

    /**
     * Drag Drop:
     * Get the "candy" and "square" destination
     * After the candies will be exchange
     * @author Daniel Valencia <2020/06/08>
     */
    function dragDrop() {
        candyBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)

        this.style.backgroundImage = candyBeingDragged
        squares[squareIdBeingDragged - 1].css("background-image", candyBeingReplaced)
        console.log("DragDrop", squareIdBeingReplaced)
    }

    /**
    * Drag End:
    * Prevent wrong movements
    * @author Daniel Valencia <2020/06/08>
    */
    function dragEnd() {
        if (squareIdBeingReplaced) {
            if (validationValidMove()) {
                squareIdBeingReplaced = null
                changeMovements(1)
                showMovements()
                console.log("DragEnd Valid")
            } else {
                squares[squareIdBeingReplaced - 1].css("background-image", candyBeingReplaced)
                squares[squareIdBeingDragged - 1].css("background-image", candyBeingDragged)
                console.log("DragEnd Invalid")
            }
        } else {
            squares[squareIdBeingDragged].css("background-image", candyBeingDragged)
            console.log("DragEnd Itself")
        }
    }

    /**
    * Validate Valid Move
    * @author Daniel Valencia <2020/06/08>
    */
    function validationValidMove() {
        let validMoves = [
            squareIdBeingDragged - width,
            squareIdBeingDragged + width
        ]
        let candyLeftBorder = (parseInt(squareIdBeingDragged - 1) % width == 0)
        let candyRightBorder = (squareIdBeingDragged % width == 0)

        if (!candyLeftBorder) validMoves.push(squareIdBeingDragged - 1)
        if (!candyRightBorder) validMoves.push(squareIdBeingDragged + 1)

        return validMoves.includes(squareIdBeingReplaced)
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
        timer.html('02:00')
    }

    /**
     * When the timer finish
     * @author Daniel Valencia <2020/06/07>
     */
    function timerComplete() {
        statusGame = "end"
        timer.html('00:00')
        timer.removeClass("flex")
        timer.removeClass("noShow")
        removeCandiesBoard()
        showResults()
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
            timer.addClass("flex")
            btn_reinicio.html("Reiniciar")
        } else {
            timer.removeClass("flex")
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
    function changePunctuation(newValue = null) {
        if (!newValue) {
            score = 0
        } else {
            score = score + newValue
        }
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
    function changeMovements(newValue = null) {
        if (!newValue) {
            movements = 0
        } else {
            movements = movements + newValue
        }
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
    function getRandomInt(min = 1, max) {
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