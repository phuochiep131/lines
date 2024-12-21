
const playerNameInput = document.getElementById("playerName");
const errorMessage = document.getElementById("errorMessage");
const submitButton = document.getElementById("sub");

playerNameInput.addEventListener("input", function () {
    const playerName = playerNameInput.value.trim();

    if (playerName === "") {
        errorMessage.textContent = "Vui lòng nhập tên của bạn!";
        errorMessage.style.visibility = "visible";
        submitButton.disabled = true; 
    } else {
        // Ẩn thông báo lỗi nếu tên hợp lệ
        errorMessage.style.visibility = "hidden";
        submitButton.disabled = false;
    }
});


submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    const playerName = playerNameInput.value.trim();

    if (playerName === "") {
        errorMessage.textContent = "Vui lòng nhập tên của bạn!";
        errorMessage.style.visibility = "visible";
        return;
    }

    localStorage.setItem("playerName", playerName);
    localStorage.setItem('playMusic', 'true');
    
    window.location.href = "game/index.html";
});