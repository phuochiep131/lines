
let delay = 0
let cursorX=0
let cursorY=0

async function setupCamera() {
    const video = document.createElement('video');

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
    });

    video.srcObject = stream;

    await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(video);
    });

    video.play();

    const canvas = document.getElementById('cameraCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;

    //flip
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        ctx.restore();

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            const thumbTip = landmarks[4];
            const thumbIp = landmarks[3];

            const indexFingerTip = landmarks[8];
            const indexFingerPip = landmarks[6];

            const middleFingerTip = landmarks[12];
            const middleFingerPip = landmarks[10];

            const ringFingerTip = landmarks[16];
            const ringFingerPip = landmarks[14];

            const pinkyFingerTip = landmarks[20];
            const pinkyFingerPip = landmarks[18];

            const x = (1-indexFingerTip.x) * window.innerWidth;
            const y = indexFingerTip.y * window.innerHeight;

            ctx.beginPath();
                ctx.arc(indexFingerTip.x * canvas.width, indexFingerTip.y * canvas.height, 10, 0, Math.PI * 2);
                ctx.fillStyle = 'red';
                ctx.fill();

            if (indexFingerTip.y < indexFingerPip.y && middleFingerTip.y > middleFingerPip.y &&
                ringFingerTip.y > ringFingerPip.y && pinkyFingerTip.y > pinkyFingerPip.y &&
                (   
                    calculateDistance(thumbIp, middleFingerPip) < 0.04 ||
                    calculateDistance(thumbIp, landmarks[5]) < 0.04 ||
                    calculateDistance(thumbTip, middleFingerPip) < 0.04
                )
            ) 
            {
                cursorX = x + canvas.offsetLeft;
                cursorY = y + canvas.offsetTop;

                // console.log(cursorX + "       y: "+cursorY)
                moveCursor(cursorX, cursorY);      
            }
            
            if (indexFingerTip.y > indexFingerPip.y && calculateDistance(thumbTip, landmarks[5]) > 0.04) {
                //console.log(delay)
                const cell = getCellFromPosition(cursorX, cursorY);
                
                if (cell && (delay % 12 === 0)) {
                    delay++;
                    cell.click(); 
                } else {
                    delay++;
                }
            }
        }
    });

    const camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({ image: video });
        },
        width: 640,
        height: 480,
    });
    camera.start();
}

function getCellFromPosition(x, y) {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const rect = cell.getBoundingClientRect();

        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            return cell;
        }
    }
    return null;
}

function calculateDistance(Tip1, Tip2) {
    let dx = Tip1.x - Tip2.x;
    let dy = Tip1.y - Tip2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function moveCursor(x, y) {
    const cursor = document.getElementById('customCursor');
    cursor.style.left = `${x-10}px`;
    cursor.style.top = `${y}px`;
}

function setupCustomCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'customCursor';
    cursor.style.position = 'absolute';
    cursor.style.width = '20px'; // Kích thước của ảnh PNG
    cursor.style.height = '20px';
    cursor.style.backgroundImage = 'url("../another/picture/handup.png")'; 
    cursor.style.backgroundSize = 'contain';
    cursor.style.backgroundRepeat = 'no-repeat';
    cursor.style.backgroundPosition = 'center';
    cursor.style.pointerEvents = 'none'; // Bỏ qua sự kiện chuột
    document.body.appendChild(cursor);
}

