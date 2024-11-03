
var arr = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

var ColorBall = [
    'another/picture/white.png', 
    'another/picture/kim.jpg',
    'another/picture/red.jpg', 
    'another/picture/pink.png', 
    'another/picture/blue.jpg',
    'another/picture/black.jpg'
]

var ValueColorBall = [1, 2, 3, 4, 5, 6]

let score = 0
document.getElementById('score').textContent = score

let highscore
//localStorage.setItem('highscore', score);
let temp_highscore = localStorage.getItem('highscore')
if(temp_highscore == null || isNaN(parseInt(temp_highscore), 10)){
    highscore = 0
}
else{
    highscore = parseInt(temp_highscore, 10)
}
document.getElementById('highscore').textContent = highscore

function ReadHighscore(){
    let temp_highscore = localStorage.getItem('highscore')
    if(temp_highscore == null || isNaN(parseInt(temp_highscore), 10)){
        highscore = 0
    }
    else{
        highscore = parseInt(temp_highscore, 10)
    }
    document.getElementById('highscore').textContent = highscore
}

function CreateBroad(){
    const matrixContainer = document.getElementById('Board')

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            matrixContainer.appendChild(cell)
        }
    }
}


function SetBall(index1, index2){
    const rdc_index = Math.floor(Math.random()*ColorBall.length)    

    if (arr[index1][index2] === 0) {
        const cells = document.getElementsByClassName('cell')
        const index = index1 * arr.length + index2
        const circle = document.createElement('div')
        circle.classList.add('circle')

        circle.style.backgroundImage = `url(${ColorBall[rdc_index]})`

        cells[index].appendChild(circle)
        arr[index1][index2] = ValueColorBall[rdc_index]

    }
}

function CreateBall(){
    const ballCount = 3
    let createdBalls = 0

    while (createdBalls < ballCount) {
        const xball = Math.floor(Math.random() * 9)
        const yball = Math.floor(Math.random() * 9)

        if(isBoardFull()){
            document.getElementById('gameOverModal').style.display = 'flex'
            return
        }
        else{
            if (arr[xball][yball] == 0) {
                SetBall(xball, yball)
                createdBalls++
            }
        }
    }
}




let selectedBall = null;
let selectedX = -1;
let selectedY = -1;

async function moveBall(index1, index2) {
    const cells = document.getElementsByClassName('cell');
    const path = hasPath(selectedX, selectedY, index1, index2);

    if (!path) {
        alert('Không có đường đi!');
        return;
    }

    if (selectedBall) {
        selectedBall.classList.remove('selected');
    }

    const ballToMove = cells[selectedX * arr.length + selectedY].querySelector('.circle');

    for (let step of path) {
        const [nextX, nextY] = step;
        const nextCell = cells[nextX * arr.length + nextY];

        nextCell.appendChild(ballToMove);

        arr[nextX][nextY] = arr[selectedX][selectedY];
        arr[selectedX][selectedY] = 0;

        selectedX = nextX;
        selectedY = nextY;

        await new Promise(resolve => setTimeout(resolve, 30));
    }
    selectedBall = null;
    selectedX = -1;
    selectedY = -1;
    if(checkAllForFiveBalls()){

    }
    else{
        CreateBall()
    }
    if(isBoardFull()){
        document.getElementById('gameOverModal').style.display = 'flex'
        document.getElementById('scoreshow').textContent = score
        if(score > highscore){
            SaveHighscore()
        }
        return
    }
}


function SaveHighscore(){
    localStorage.setItem('highscore', score);
}


function attachClickHandlers() {
    const cells = document.getElementsByClassName('cell');

    for (let i = 0; i < cells.length; i++) {
        const rowIndex = Math.floor(i / arr.length);
        const colIndex = i % arr.length;

        cells[i].addEventListener('click', () => {
            selectOrMoveBall(rowIndex, colIndex);
        });
    }
}

function isValid(x, y) {
    return x >= 0 && y >= 0 && x < arr.length && y < arr[0].length && arr[x][y] === 0;
}

function hasPath(startX, startY, targetX, targetY) {
    if (arr[targetX][targetY] !== 0) {
        return null;
    }

    const directions = [
        [-1, 0], // Lên
        [1, 0],  // Xuống
        [0, -1], // Trái
        [0, 1]   // Phải
    ];

    const queue = [[startX, startY]];
    const visited = Array.from({ length: arr.length }, () => Array(arr[0].length).fill(false));
    visited[startX][startY] = true;
    const path = Array.from({ length: arr.length }, () => Array(arr[0].length).fill(null));

    while (queue.length > 0) {
        const [currentX, currentY] = queue.shift();

        if (currentX === targetX && currentY === targetY) {
            const steps = [];
            let x = targetX;
            let y = targetY;
            while (x !== startX || y !== startY) {
                steps.push([x, y]);
                [x, y] = path[x][y];
            }
            steps.reverse();
            return steps;
        }

        for (let i = 0; i < directions.length; i++) {
            const [dx, dy] = directions[i];
            const newX = currentX + dx;
            const newY = currentY + dy;

            if (isValid(newX, newY) && !visited[newX][newY]) {
                queue.push([newX, newY]);
                visited[newX][newY] = true;
                path[newX][newY] = [currentX, currentY];
            }
        }
    }
    return null;
}

function selectOrMoveBall(index1, index2) {
    const cells = document.getElementsByClassName('cell');

    if (selectedBall === null && arr[index1][index2] !== 0) {
        selectedBall = cells[index1 * arr.length + index2].querySelector('.circle');
        selectedX = index1;
        selectedY = index2;
        selectedBall.classList.add('selected');
    } else if (selectedBall !== null && arr[index1][index2] === 0) {
        if (hasPath(selectedX, selectedY, index1, index2)) {
            moveBall(index1, index2);
        } else {
            alert('Không có đường đi!');
            selectedBall.classList.remove('selected');
            selectedBall = null;
            selectedX = -1;
            selectedY = -1;
        }
    }
    else if (selectedBall !== null && arr[index1][index2] !== 0) {
        // Hủy chọn bóng cũ và chọn bóng mới nếu nhấp vào quả bóng khác
        selectedBall.classList.remove('selected');
        selectedBall = cells[index1 * arr.length + index2].querySelector('.circle');
        selectedX = index1;
        selectedY = index2;
        selectedBall.classList.add('selected');
    }
}

function checkDirection(startX, startY, dx, dy) {
    const color = arr[startX][startY]; 
    let count = 0;
    let positions = []; 

    for (let i = 0; i < 9; i++) {
        const x = startX + i * dx;
        const y = startY + i * dy;

        if (x >= 0 && y >= 0 && x < arr.length && y < arr[0].length && arr[x][y] === color) {
            count++;
            positions.push([x, y]); 
        } else {
            break;
        }
    }

    if (count >= 5) {
        return positions;
    }
    return null;
}

function checkForFiveBalls(x, y) {
    const directions = [
        [0, 1],  // Ngang
        [1, 0],  // Dọc
        [1, 1],  // Chéo chính 
        [1, -1]  // Chéo phụ 
    ];

    for (let i = 0; i < directions.length; i++) {
        const [dx, dy] = directions[i];
        const positions = checkDirection(x, y, dx, dy);

        if (positions) {
            return positions; 
        }
    }
    return null;
}

function removeBalls(positions) {
    positions.forEach(([x, y]) => {
        arr[x][y] = 0;
        const index = x * arr.length + y;
        const cells = document.getElementsByClassName('cell');
        const ball = cells[index].querySelector('.circle');
        if (ball) {
            ball.remove(); 
        }
    });
}

function checkAllForFiveBalls() {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] !== 0) { 
                const positions = checkForFiveBalls(i, j);
                if (positions) {
                    removeBalls(positions); 
                    score = score + positions.length * 10
                    document.getElementById('score').textContent = score
                    return true
                }
            }
        }
    }
    return false
}

function isBoardFull() {
    let dem = 0
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] != 0) {
                dem++
            }
        }
    }
    return dem==81?true:false
}

function Playgame(){
    Reset()
    Playagain()
    CreateBroad()
    CreateBall()
    CreateBall()
    attachClickHandlers()
    ReadHighscore()
}

function Reset() {
    document.getElementById("reset-btn").addEventListener("click", function() {
        document.getElementById('Board').innerHTML = "";
        score = 0;
        document.getElementById('score').textContent = score;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                arr[i][j] = 0;
            }
        }
        Playgame()
    });
}

function Playagain() {
    document.getElementById("playagain").addEventListener("click", function() {
        document.getElementById('gameOverModal').style.display = 'none'
        document.getElementById('Board').innerHTML = "";
        score = 0;
        document.getElementById('score').textContent = score;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                arr[i][j] = 0;
            }
        }
        Playgame();
    });
}

Playgame()

