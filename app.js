// selectors
const window_div = document.querySelector('.window')
const ground = document.querySelector('.ground')


// variables
let bird = new Bird()
let mainInterval
let pipeInterval
let jumpInterval
let fallInterval
let pipeList = [new Pipe(500, 180, 500), new Pipe(50, 0, 250)]
let groundList = [new Ground(0)]
let isJumping
let isStarted = false
let isEnd = false

// constructors
function Bird() {
    this.left = 200
    this.bottom = 300
    this.htmlElement = document.createElement('div')

    let htmlElement = this.htmlElement
    htmlElement.classList.add('bird')
    htmlElement.style.left = `${this.left}px`
    htmlElement.style.bottom = `${this.bottom}px`
    window_div.appendChild(htmlElement)
}

function Pipe(bottom, direction, height) {
    this.bottom = bottom
    this.left = 700
    this.height = height
    this.direction = direction
    this.htmlElement = document.createElement('div')

    const htmlElement = this.htmlElement
    htmlElement.classList.add('pipe')
    htmlElement.style.bottom = `${this.bottom}px`
    htmlElement.style.left = `${this.left}px`
    htmlElement.style.height = `${this.height}px`
    htmlElement.style.transform = `rotate(${this.direction}deg)`
    window_div.appendChild(htmlElement)
}

function Ground(givenLeft) {
    this.bottom = 20
    this.left = givenLeft
    this.htmlElement = document.createElement('div')

    const htmlElement = this.htmlElement
    htmlElement.classList.add('ground')
    htmlElement.style.bottom = `${this.bottom}px`
    htmlElement.style.left = `${this.left}px`
    window_div.appendChild(htmlElement)
}

// functions
function moveGround() {
    for (let i of groundList) {
        // burası, zemin 0px'e ulaştıktan sonra arkasına yenisini ekliyor
        if (i.left >= -10 && i.left <= 0 && groundList.length < 2) {
            groundList.push(new Ground(650))
        }

        // bu kısım, zemin ekrandan tamamen kaybolduktan sonra onu siliyor
        if (i.left <= -650) {
            i.htmlElement.style.display = 'none'
            groundList.shift()
        }
        i.left -= 1
        i.htmlElement.style.left = `${i.left}px`
    }
}

function movePipe() {
    for (let i of pipeList) {
        i.left -= 1
        i.htmlElement.style.left = `${i.left}px`
    }
}

function runPipes() {
    pipeInterval = setInterval(function() {
        pushPipes()
    }, 2000)
}

function pushPipes() {
    const num = Math.random() * 100
    pipeList.push(new Pipe(50, 0, 200 + num))
    pipeList.push(new Pipe(500 + num, 180, 500))

    if (pipeList.length > 8) {
        pipeList.splice(0, 2)
    }
}

function runGame() {
    mainInterval = setInterval(function() {
        moveGround()
        movePipe()
        checkContact()
        if (!isJumping) fall()
    }, 5)
}

function checkContact() {
    for (let pipe of pipeList) {
        if (pipe.left == bird.left + 60 && pipe.bottom <= bird.bottom && pipe.bottom + pipe.height >= bird.bottom) {
            clearInterval(mainInterval)
            isEnd = true
            setTimeout(function() {
                location.reload()
            }, 1000)

        } //sol alt
        else if (bird.left >= pipe.left && bird.left <= pipe.left + 60 && bird.bottom >= pipe.bottom && bird.bottom <= pipe.bottom + pipe.height) {
            clearInterval(mainInterval)
            isEnd = true
            setTimeout(function() {
                location.reload()
            }, 1000)

        } // sağ alt 
        else if (bird.left + 45 >= pipe.left && bird.left + 45 <= pipe.left + 60 && bird.bottom >= pipe.bottom && bird.bottom <= pipe.bottom + pipe.height) {
            clearInterval(mainInterval)
            isEnd = true
            setTimeout(function() {
                location.reload()
            }, 1000)
        } //sol üst
        else if (bird.left >= pipe.left && bird.left <= pipe.left + 60 && bird.bottom + 45 >= pipe.bottom && bird.bottom + 45 <= pipe.bottom + pipe.height) {
            clearInterval(mainInterval)
            isEnd = true
            setTimeout(function() {
                location.reload()
            }, 1000)
        } //sağ üst
        else if (bird.left + 45 >= pipe.left && bird.left + 45 <= pipe.left + 60 && bird.bottom + 45 >= pipe.bottom && bird.bottom + 45 <= pipe.bottom + pipe.height) {
            clearInterval(mainInterval)
            isEnd = true
            setTimeout(function() {
                location.reload()
            }, 1000)
        } else if (bird.bottom <= 70) {
            clearInterval(mainInterval)
            isEnd = true
            setTimeout(function() {
                location.reload()
            }, 1000)
        }
    }
}

function fall() {
    // bird.htmlElement.classList.add('fall')
    bird.bottom -= 2
    bird.htmlElement.style.bottom = `${bird.bottom}px`
}

function jump() {
    isJumping = true
    clearInterval(fallInterval)
        // bird.htmlElement.classList.remove('fall')
        // bird.htmlElement.classList.add('jump')
    const jumpStartPoint = bird.bottom
    jumpInterval = setInterval(function() {
        bird.bottom += 3
        bird.htmlElement.style.bottom = `${bird.bottom}px`
        if (bird.bottom - jumpStartPoint > 125) {
            clearInterval(jumpInterval)
            setTimeout(function() {
                isJumping = false
            }, 100)
        }
    }, 1)
}
// event listeners
document.addEventListener('keyup', function(e) {
    if (e.key == 'ArrowUp') {
        if (!isStarted) {
            isStarted = true
            runGame()
            runPipes()
        } else if (!isJumping && !isEnd) {
            jump()
        }
    }
})