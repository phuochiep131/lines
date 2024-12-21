
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
    '../another/picture/white.png', 
    '../another/picture/kim.jpg',
    '../another/picture/red.jpg', 
    '../another/picture/pink.png', 
    '../another/picture/blue.jpg',
    '../another/picture/black.jpg'
]

var ValueColorBall = [1, 2, 3, 4, 5, 6]

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



let arr_pre=[]


function SetBall(){

    for(let i=0; i<arr_pre.length; i+=3){

        let index1 = arr_pre[i]
        let index2 = arr_pre[i+1]
        let rdc_index = arr_pre[i+2]        
    
        
        
        if(arr[index1][index2]!==-1 && arr[index1][index2]!==0){
            removeBalls_pre_notvalue(index1, index2)
        }        
        else{
            removeBalls_pre(index1, index2)
            const cells = document.getElementsByClassName('cell');
            const index = index1 * arr[0].length + index2;
        
                // Thêm bóng chính thức
            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.style.backgroundImage = `url(${ColorBall[rdc_index]})`;
            cells[index].appendChild(circle);

                // Cập nhật mảng chính thức
            arr[index1][index2] = ValueColorBall[rdc_index];
        }
    }
    arr_pre=[]
}

function SetBall_pre(index1, index2, rdc_index){
    if (arr[index1][index2] === 0) {
        const cells = document.getElementsByClassName('cell')
        const index = index1 * arr.length + index2
        const circle = document.createElement('div')
        circle.classList.add('circle-pre')

        circle.style.backgroundImage = `url(${ColorBall[rdc_index]})`

        cells[index].appendChild(circle)
        arr[index1][index2] = -1
    }
}

function CreateBall(){
    const ballCount = 3
    let createdBalls = 0


    while (createdBalls < ballCount) {
        const xball = Math.floor(Math.random() * 9)
        const yball = Math.floor(Math.random() * 9)
        const rdc_index = Math.floor(Math.random()*ColorBall.length)

        

        if(isBoardFull()){
            document.getElementById('gameOverModal').style.display = 'flex'
            return []
        }
        else{
            if (arr[xball][yball] === 0) {
                arr_pre.push(xball, yball, rdc_index)
                SetBall_pre(xball, yball, rdc_index)
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

        //them async
        await new Promise(resolve => setTimeout(resolve, 30));
    }
    selectedBall = null;
    selectedX = -1;
    selectedY = -1;
    if(checkAllForFiveBalls()){

    }
    else{        
        SetBall()
        checkAllForFiveBalls()
        CreateBall()
        console.log(arr)
    }
    if(isBoardFull()){
        document.getElementById('gameOverModal').style.display = 'flex'
        document.getElementById('scoreshow').textContent = score
        if(score > highscore){
            SaveHighscore()
        }
    }
}

function hasPath(startX, startY, targetX, targetY) {
    if (arr[targetX][targetY] !== 0 && arr[targetX][targetY] === -1) {
        
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
    let t = (x >= 0 && y >= 0 && x < arr.length && y < arr[0].length)
    return (t && arr[x][y] === 0) || (t && arr[x][y] === -1)
}

function selectOrMoveBall(index1, index2) {
    const cells = document.getElementsByClassName('cell');

    if (selectedBall === null && arr[index1][index2] !== 0) {
        selectedBall = cells[index1 * arr.length + index2].querySelector('.circle');
        selectedX = index1;
        selectedY = index2;
        selectedBall.classList.add('selected');
    } else if ((selectedBall !== null && arr[index1][index2] === 0) || (selectedBall !== null && arr[index1][index2] === -1)) {
        if (hasPath(selectedX, selectedY, index1, index2)) {
            moveBall(index1, index2);
        } else {
            //alert('Không có đường đi!');
            selectedBall.classList.remove('selected');
            selectedBall = null;
            selectedX = -1;
            selectedY = -1;
        }
    }
    else if (selectedBall !== null && arr[index1][index2] !== 0 && arr[index1][index2] !== -1 ) {
        // Hủy chọn bóng cũ và chọn bóng mới nếu nhấp vào quả bóng khác
        selectedBall.classList.remove('selected');
        selectedBall = cells[index1 * arr.length + index2].querySelector('.circle');
        selectedX = index1;
        selectedY = index2;
        selectedBall.classList.add('selected');
    }
}


function removeBalls(positions) {
    const cells = document.getElementsByClassName('cell');

    for (let i = 0; i < positions.length; i++) {
        const [x, y] = positions[i];
        arr[x][y] = 0;

        const index = x * arr[0].length + y;

        const cell = cells[index];
        if (cell) {
            const ball = cell.querySelector('.circle');
            if (ball) {
                ball.classList.add('fade-out');
            
                setTimeout(() => {
                    ball.remove();
                }, 500);  
            }
        }
    }
}

function removeBalls_pre(index1, index2) {
    const cells = document.getElementsByClassName('cell');

    let x = index1
    let y = index2
    arr[x][y] = 0

    const index = x * arr[0].length + y;

    const cell = cells[index];
    if (cell) {
        const ball = cell.querySelector('.circle-pre');
        if (ball) {
            ball.remove();
        }
    }
    
}

function removeBalls_pre_notvalue(index1, index2) {
    const cells = document.getElementsByClassName('cell');

    let x = index1
    let y = index2

    const index = x * arr[0].length + y;

    const cell = cells[index];
    if (cell) {
        const ball = cell.querySelector('.circle-pre');
        if (ball) {
            ball.remove();
        }
    }
    
}

function checkAllForFiveBalls() {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] !== 0) { 
                const positions = checkForFiveBalls(i, j);
                if (positions) {
                    removeBalls(positions); 
                    if(positions.length>5){
                        score = score + positions.length * 10
                        score += positions.length*2
                    }
                    else{
                        score = score + positions.length * 10
                    }
                    
                    document.getElementById('score').textContent = score
                    
                    Pluspoint(people)
                    people.sort((a, b) => b.point - a.point)
                    WriteScore('highscore', people)
                    
                    return true
                }
            }
        }
    }
    return false
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

function isBoardFull() {
    let countball = 0
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] != 0) {
                countball++
            }
        }
    }
    return countball==81
}

//-------------------------Diem--------------------------------

let score = 0
document.getElementById('score').textContent = score

let highscore = 0


// let temp_highscore = localStorage.getItem('highscore')
// if(temp_highscore == null || isNaN(parseInt(temp_highscore), 10)){
//     highscore = 0
// }
// else{
//     highscore = parseInt(temp_highscore, 10)
// }
// document.getElementById('highscore').textContent = highscore

// function ReadHighscore(){
//     let temp_highscore = localStorage.getItem('highscore')
//     if(temp_highscore == null || isNaN(parseInt(temp_highscore), 10)){
//         highscore = 0
//     }
//     else{
//         highscore = parseInt(temp_highscore, 10)
//     }
//     return highscore
// }


function GetName(){
    return localStorage.getItem('playerName')
}

function SaveHighscore(){
    localStorage.setItem('highscore', score);
}


//-------------------------------------------------------------------------------------------------------


function Player(id, name, point) {
    this.id = id;
    this.name = name;
    this.point = point;
}

function WriteScore(idtag, plr){
    document.getElementById(idtag).innerHTML = "";
    let scoreText = ''; 

    for(let i = 0; i < plr.length; i++){
        scoreText += plr[i].name + ": " + plr[i].point + "<br>"; 
    }
    document.getElementById(idtag).innerHTML = scoreText;
}

let people = [];
people.push(new Player(1, "John Doe", 1400));
people.push(new Player(2, "Jane Smith", 590));
people.push(new Player(3, "Sam Brown", 285));
people.push(new Player(4, "John", 85));
people.push(new Player(5, GetName(), score))

function Pluspoint(list){
    for(let i = 0; i < list.length; i++){
        if(list[i].name===GetName()){
            list[i].point=score
        }
    }
}



//-------------------------Nut--------------------------------

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
        arr_pre=[]   
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
        arr_pre=[]

        Playgame()
    });
}



function PlayMusic(){
    const music = document.getElementById('music');

    if (localStorage.getItem('playMusic') === 'true') {
        music.play();
        localStorage.removeItem('playMusic');
    }
}

//---------------------------------------------------------------------------------------


function Playgame(){
    Reset()
    Playagain()

    PlayMusic()
    



    CreateBroad()

    SetBall(CreateBall())
    SetBall(CreateBall())

    CreateBall()
    
    attachClickHandlers()

    people.sort((a, b) => b.point - a.point)
    WriteScore('highscore', people)
}

setupCustomCursor()
setupCamera()
Playgame()

