import { forEach } from 'lodash'
import './styles/app.scss'

const title = document.getElementById("title")
const button = document.getElementById("start")
const score = document.getElementById("score")
const cvs = document.getElementById("canvas")
const ctx = cvs.getContext("2d")

let game
let isCanStart = true
let scoreCount = 0
const box = 20

const renderBlock = (x, y) => {
    ctx.beginPath()
    ctx.rect(x, y, box, box)
    ctx.fillStyle = 'white'
    ctx.fill()
}

let food = {}

const changeFoodCoord = () => {
    food.x = Math.floor(Math.random() * (cvs.width / box)) * box
    food.y = Math.floor(Math.random() * (cvs.height / box)) * box
}

const renderFood = () => {
    ctx.beginPath()
    ctx.rect(food.x, food.y, box, box)
    ctx.fillStyle = 'red'
    ctx.fill()
}

let direction
const directionHandler = event => {
	if(event.keyCode == 37 && direction != "right")
		direction = "left"
	else if(event.keyCode == 38 && direction != "down")
		direction = "up"
	else if(event.keyCode == 39 && direction != "left")
		direction = "right"
	else if(event.keyCode == 40 && direction != "up")
		direction = "down"
}

const changeRectCoord = (snakeX, snakeY) => {
    let x = snakeX
    let y = snakeY

    switch(direction) {
        case 'left':
            x = snakeX - box >= 0
                ? snakeX - box
                : cvs.width - box
            break
        case 'right':
            x = snakeX + box <= cvs.width
                ? snakeX + box
                : 0
            break
        case 'up':
            y = snakeY - box >= 0
                ? snakeY - box
                : cvs.height - box
            break
        case 'down':
            y = snakeY + box <= cvs.height
                ? snakeY + box
                : 0
            break
    }

    return {
        x, y
    }
}

let snake = []
snake[0] = {
	x: cvs.width / 2 - 10,
	y: cvs.height / 2 - 10,
}

function eatTail(head) {
    snake.forEach(snakePart => {
        if(head.x == snakePart.x && head.y == snakePart.y) {
            clearInterval(game)
            score.innerHTML = scoreCount + '. You lose.'
        }
    })
}

const render = () => {
    ctx.clearRect(0, 0, cvs.width, cvs.height)

    renderFood()
    
    let snakeX = snake[0].x
	let snakeY = snake[0].y
    
    snake.forEach(snakePart => {
        renderBlock(snakePart.x, snakePart.y, box, box)
    })

    if (snake[0].x === food.x && snake[0].y === food.y) {
        score.innerHTML = ++scoreCount 
        changeFoodCoord()
    } else snake.pop()

    let newHead = changeRectCoord(snakeX, snakeY)

    eatTail(newHead)

    snake.unshift(newHead) 
}

const onStartHandler = () => {
    if (isCanStart) {
        isCanStart = false
        changeFoodCoord()
        render()
        game = setInterval(() => render(), 200)
    }
}

button.addEventListener('click', onStartHandler)
document.addEventListener('keydown', directionHandler)
