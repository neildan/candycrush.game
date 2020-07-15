/**
 * @var Game module pattern
 * @author Daniel Valencia <2020/06/06>
 */
var Game = (function Game() {
    /**
     * @var score the score of a game
     * @var movements the movements of a game.
     * @var statusGame the status of the game.
     * @var checkSuccessfulMovements check successful movements.
     */
    var score = 0
    var movements = 0
    var statusGame = 'new'
    var checkSuccessfulMovements

    /**
     * @const width the length of rows and columns
     * @const candies list of all types of candy in the game
     * @const squares all candies of the board
     * @const minMovement is the minimum combination of a successful movement.
     * @const successfulMovements successful movements
     */
    const width = 7
    const candies = [
        './image/1.png',
        './image/2.png',
        './image/3.png',
        './image/4.png'
    ]
    const squares = []
    const minMovement = 3
    const successfulMovements = []

    /**
     * Elements HTML
     */
    const grid = $("#panel-tablero");
    const timer = $('#timer');
    const title = $("#main-titulo");
    const score_text = $("#score-text");
    const first_score = $("#first_score");
    const second_score = $("#second_score");
    const third_score = $("#third_score");
    const btn_reinicio = $("#btn-reinicio");
    const movimientos_text = $("#movimientos-text");

    /**
     * @let _myTimer timer
     * @let Dragging the Candy
     */
    let _myTimer = {}
    let countTimer = 0
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
            checkSuccessfulMovements = setInterval(checkNewSuccessfulMovements, 1000);
        } else {
            // Restart game
            changeStatusGame()
            if (statusGame == 'end') {
                resetGame()
            } else {
                finishTimerGame()
                clearInterval(checkSuccessfulMovements);
                removeCandiesBoard()
            }
            changeScore()
            changeMovements()

            showScore()
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
        countTimer = 0
        statusGame = "new"
        TimerGame.myTimer = {}
        sessionStorage.activeGame = true
        squares.splice(0, squares.length)
        checkSuccessfulMovements = null
    }

    /**
     * Reset the original values of the game
     * @author Daniel Valencia <2020/06/08>
     */
    function resetGame() {
        $("#end-game").addClass("noShow")
        $("#best-scores").addClass("noShow")
        $("#panel-score-and-best-scores").css("width", "30%")
        $("#panel-score").css("width", "100%")
        $("#panel-score").css("padding-right", "")
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
            let randomCandy = getRandomInt(null, candies.length)

            let square = $('<div/>', {
                id: i,
                draggable: 'true',
                style: 'background-image: url("' + candies[randomCandy] + '")'
            });
            squares.push(square)
        }
        grid.append(squares)
    }

    /**
     * Add events to the board's candies
     * @author Daniel Valencia <2020/06/07>
     */
    function addEventsBoard() {
        let events = ["dragstart", "dragend", "dragover", "dragenter", "drop"]
        let functionEvents = [dragStart, dragEnd, dragOver, dragEnter, dragDrop]

        squares.forEach(function (square, indexSquare) {
            events.forEach(function (element, index) {
                square.on(element, functionEvents[index])
            })
        })
    }

    /**
     * Drag Start:
     * Get the "candy" and "square" origin
     * @author Daniel Valencia <2020/06/08>
     */
    function dragStart() {
        candyBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)
    }

    /**
    * Drag End:
    * Prevent wrong movements
    * @author Daniel Valencia <2020/06/08>
    */
    function dragEnd() {
        if (squareIdBeingReplaced) {
            if (validationMove()) {
                squareIdBeingReplaced = null
                changeMovements(1)
                showMovements()
            } else {
                squares[squareIdBeingReplaced - 1].css("background-image", candyBeingReplaced)
                squares[squareIdBeingDragged - 1].css("background-image", candyBeingDragged)
            }
        } else {
            squares[squareIdBeingDragged].css("background-image", candyBeingDragged)
        }
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
    }

    /**
    * Validate Valid Move
    * @author Daniel Valencia <2020/06/08>
    */
    function validationMove() {
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
     * Check new successful movements
     * @author Daniel Valencia <2020/06/14>
     */
    function checkNewSuccessfulMovements() {
        if (analyzeBoard()) {
            addScore()
            removeSuccessfulMovementsOfBoard()
            reorderAndCreateNewCandies()
        }
    }

    /**
     * Analyze Board in search of successful movements.
     * @return Boolean
     * @author Daniel Valencia <2020/06/09>
     */
    function analyzeBoard() {
        successfulMovements.splice(0, squares.length)

        for (let typeMove = width; typeMove >= minMovement; typeMove--) {
            for (let i = 1; i <= parseInt(width * width); i++) {

                let typeCandy = squares[i - 1].css("background-image")
                if (typeCandy === 'none') continue

                let row = [i]
                let column = [i]
                let movement = {}
                let orientation = ["row", "column"]
                let successfulMovementInRow = false
                let successfulMovementInColumn = false

                orientation.forEach(function (orientationOfMove, orientationOfMoveIndex) {
                    if (orientationOfMove == "row" && !limitSearchCapabilityRows(i, typeMove)) {

                        for (let j = 1; j < typeMove; j++) {
                            row.push(i + j)
                        }

                        successfulMovementInRow = row.every(
                            idCandy => compareCandies(idCandy, typeCandy)
                        )

                    } else if (orientationOfMove == "column" && !limitSearchCapabilityColumns(i, typeMove)) {

                        for (let j = 1; j < typeMove; j++) {
                            column.push(i + j * width)
                        }

                        successfulMovementInColumn = column.every(
                            idCandy => compareCandies(idCandy, typeCandy)
                        )
                    }
                })

                if (successfulMovementInRow || successfulMovementInColumn) {

                    movement = {
                        row: row,
                        column: column,
                        successRow: successfulMovementInRow,
                        successColumn: successfulMovementInColumn
                    }

                    if (repeatedMovements(movement)) continue

                    successfulMovements.push(movement)
                }
            }
        }

        return (successfulMovements.length > 0)
    }

    /**
     * Compare Candies
     * @param int idCandy
     * @param int typeCandy
     * @return Boolean
     * @author Daniel Valencia <2020/06/09>
     */
    function compareCandies(idCandy, typeCandy) {
        return (squares[idCandy - 1].css("background-image") === typeCandy)
    }

    /**
    * Limit Search Capability for rows
    * @param int CandyPosition
    * @param int typeMove
    * @return Boolean
    * @author Daniel Valencia <2020/06/09>
    */
    function limitSearchCapabilityRows(candyPosition, typeMove) {
        let leaveSearch = []
        let limit = typeMove - 2

        for (let i = 1; i <= width; i++) {
            for (let j = 1; j <= limit; j++) {
                leaveSearch.push(width * i - j)
            }
            leaveSearch.push(width * i)
        }
        return leaveSearch.includes(candyPosition)
    }

    /**
     * Limit Search Capability for columns
     * @param int candyPosition
     * @param int typeMove
     * @return Boolean
     * @author Daniel Valencia <2020/06/09>
     */
    function limitSearchCapabilityColumns(candyPosition, typeMove) {
        let limitSearchCapability = 0

        for (i = 0; i < width - 2 && limitSearchCapability == 0; i++) {
            if (typeMove == width - i) limitSearchCapability = i + 1
        }

        return (candyPosition > width * limitSearchCapability)
    }

    /**
     * Exclude repeated movements
     * @param obj movement
     * @return Boolean
     * @author Daniel Valencia <2020/06/09>
     */
    function repeatedMovements(movement) {
        if (successfulMovements.length > 0) {
            let exit = false

            if (movement.successRow) {
                successfulMovements.some(function (element) {
                    if (element.successRow) {
                        if (compareTwoArrays(element.row, movement.row)) {
                            exit = true
                            return true
                        }
                    }
                })
            } else if (movement.successColumn) {
                successfulMovements.some(function (element) {
                    if (element.successColumn) {
                        if (compareTwoArrays(element.column, movement.column)) {
                            exit = true
                            return true
                        }
                    }
                })
            }
            return exit
        }
    }

    /**
     * Add Score
     * @author Daniel Valencia <2020/06/09>
     */
    function addScore() {
        successfulMovements.forEach(function (move) {
            if (move.successRow) changeScore(parseInt(move.row.length))
            if (move.successColumn) changeScore(parseInt(move.column.length))
        })
        showScore()
    }

    /**
     * Get the candies from sucessful movements
     * @return array
     * @author Daniel Valencia <2020/06/09>
     */
    function getCandiesFromSuccessfulMovements() {
        let movements = []
        if (successfulMovements.length > 0) {

            successfulMovements.forEach(function (element, index) {
                let coma = (index > 0) ? "," : ""
                if (element.successRow) movements += coma + element.row.join(",")
                if (element.successColumn) movements += coma + element.column.join(",")
            })
            if (movements != "") movements = movements.split(",")

            movements = movements.filter(onlyUnique);
        }
        return movements
    }

    /**
     * Remove the successful movements of the board
     * @return array
     * @author Daniel Valencia <2020/06/09>
     */
    function removeSuccessfulMovementsOfBoard() {
        let removeCandies = getCandiesFromSuccessfulMovements()

        if (removeCandies.length > 0) {
            let removeCandy = null
            removeCandies.forEach(function (index) {
                index = parseInt(index)
                removeCandy = squares[index - 1]
                if (removeCandy && removeCandy.css("background-image") != 'none') {
                    removeCandy.css("background-image", "")
                }
            })
        }
    }

    /**
     * Reorder and create new candies
     * @return Boolean
     * @author Daniel Valencia <2020/06/09>
     */
    function reorderAndCreateNewCandies() {
        let deleteCandies = []
        let correctPositionCandies = []

        let amountDecrease = width - 1
        let withOutCandies = getCandiesFromSuccessfulMovements()

        if (withOutCandies.length == 0) return false

        for (let column = width; column > 0; column--) {
            let rows = []
            let rowWithCandies = []
            let rowWithOutCandies = []

            rows.push(column)
            for (let i = 1; i <= width - 1; i++) {
                rows.push(column + i * width)
            }

            rowWithOutCandies = rows.filter(row => withOutCandies.includes(row.toString()))

            if (rowWithOutCandies.length > 0) {

                rowWithOutCandies.sort(function (a, b) { return b - a });

                rowWithCandies = rows.filter(x => !rowWithOutCandies.includes(x))
                    .concat(rowWithOutCandies.filter(x => !rows.includes(x)));

                let newPositionCandies = rowWithOutCandies

                if (rowWithCandies.length > 0) newPositionCandies = newPositionCandies.concat(rowWithCandies)

                newPositionCandies = newPositionCandies.reverse()

                newPositionCandies.forEach(function (newPosition, idPosition) {

                    let positionWhereShouldBe = parseInt(rows[amountDecrease - idPosition])

                    if (squares[newPosition - 1].css("background-image") != 'none') {
                        if (newPosition != positionWhereShouldBe) {
                            correctPositionCandies.push({
                                shouldBe: positionWhereShouldBe,
                                candy: newPosition
                            })
                        }
                    } else {
                        deleteCandies.push({
                            column: column,
                            shouldBe: positionWhereShouldBe
                        })
                    }
                })

            }
        }

        if (correctPositionCandies.length > 0) {
            correctPositionCandies.forEach(function (positionCandy) {
                squares[positionCandy.shouldBe - 1].css(
                    "background-image",
                    squares[positionCandy.candy - 1].css("background-image")
                )
            })
        }
        if (deleteCandies.length > 0) {

            deleteCandies.forEach(deleteCandy => squares[deleteCandy.shouldBe - 1].css("background-image", ""))

            deleteCandies = deleteCandies.reduce(function (r, a) {
                r[a.column] = r[a.column] || [];
                r[a.column].push(a.shouldBe);
                return r;
            }, Object.create(null));

            deleteCandies = Object.values(deleteCandies)

            let newCandy
            deleteCandies.forEach(candy => {
                candy = candy.sort(function (a, b) { return a - b });

                for (let i = 0; i < candy.length; i++) {

                    newCandy = candies[getRandomInt(null, candies.length)]

                    squares[candy[i] - 1].css("background-image", "url('" + newCandy + "')")
                    // TODO: Down squares[candy[i] + width - 1].css("background-image")
                }
            })

        }
        return true
    }

    /**
     * Start the countdown timer.
     * @author Daniel Valencia <2020/06/07>
     */
    function startTimerGame() {
        timer.html('')

        TimerGame.myTimer = timer.startTimer({
            onComplete: function (e) {
                countTimer++
                if (countTimer == 1) timerComplete()
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
        clearInterval(checkSuccessfulMovements);
        setTimeout(calculateAndShowThreeBestScore, 1000);
        removeCandiesBoard()
        showResults()
    }

    /**
     * Calculate and show the three best scores in the game history
     * @author Daniel Valencia <2020/06/14>
     */
    function calculateAndShowThreeBestScore() {
        var threeBestScore = JSON.parse(localStorage.getItem("threeBestScore"))

        if (threeBestScore && threeBestScore.length > 0) {

            let newThreeBestScore = []

            threeBestScore = threeBestScore.sort(function (a, b) { return b - a });

            if (score > threeBestScore[0]) {
                newThreeBestScore = [
                    score,
                    threeBestScore[0],
                    threeBestScore[1]
                ]
            } else if (score > threeBestScore[1]) {
                newThreeBestScore = [
                    threeBestScore[0],
                    score,
                    threeBestScore[1]
                ]
            } else if (score > threeBestScore[2]) {
                newThreeBestScore = [
                    threeBestScore[0],
                    threeBestScore[1],
                    score
                ]
            } else {
                newThreeBestScore = threeBestScore
            }

            localStorage.setItem("threeBestScore", JSON.stringify(newThreeBestScore))
        } else {
            localStorage.setItem("threeBestScore", JSON.stringify([score, 0, 0]))
        }

        threeBestScore = JSON.parse(localStorage.getItem("threeBestScore"))

        first_score.html(threeBestScore[0])
        second_score.html(threeBestScore[1])
        third_score.html(threeBestScore[2])
    }

    /**
     * Show the results obtained
     * @author Daniel Valencia <2020/06/08>
     */
    function showResults() {
        grid.hide("slow")
        title.hide("slow")
        $("#time").hide("slow")
        $("#panel-score-and-best-scores").css("width", "100%")
        $("#panel-score").css("width", "70%")
        $("#panel-score").css("padding-right", "2em")
        $("#best-scores").removeClass("noShow")
        $("#end-game").removeClass("noShow")
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
    function changeScore(newValue = null) {
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
    function showScore() {
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
     * Remove all candies of the board
     * @author Daniel Valencia <2020/06/08>
     */
    function removeCandiesBoard() {
        grid.html('')
    }

    /**
     * Remove the session storage
     * @author Daniel Valencia <2020/06/06>
     */
    function removeSessionStorage() {
        if (sessionStorage.activeGame) sessionStorage.removeItem("activeGame")
    }

    /**
     * Return a random int between parameter min and parameter max
     * @param int min
     * @param int max
     */
    function getRandomInt(min = 1, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Compare two arrays with numbers inside
     * @param array array1
     * @param array array2
     * @return Boolean
     * @author Daniel Valencia <2020/06/09>
     */
    function compareTwoArrays(array1, array2) {
        let result = array1.concat(array2)
        result = result.filter(onlyUnique);
        result = result.sort(function (a, b) { return a - b });
        result = result.join("")

        return (array1.join("") === result)
    }

    /**
     * Get unique values in array
     * @param string value
     * @param int index
     * @param array self
     */
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
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