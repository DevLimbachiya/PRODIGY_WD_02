let timer;
let running = false;
let elapsedTime = 0;

const display = document.querySelector('.display');
const startStopBtn = document.getElementById('start-stop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const lapList = document.getElementById('lap-list');
const themeToggle = document.getElementById('theme-toggle');


function loadLaps() {
    const storedLaps = JSON.parse(localStorage.getItem('laps')) || [];
    storedLaps.forEach((lap, index) => {
        addLapToList(`Lap ${index + 1}: ${lap}`);
    });
}


function saveLap(lapTime) {
    const storedLaps = JSON.parse(localStorage.getItem('laps')) || [];
    storedLaps.push(lapTime);
    localStorage.setItem('laps', JSON.stringify(storedLaps));
}


function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(Math.floor(ms % 1000 / 10)).padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
}


function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}


function startStop() {
    if (!running) {
        running = true;
        startStopBtn.textContent = 'Pause';
        const startTime = Date.now() - elapsedTime;
        timer = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
    } else {
        running = false;
        startStopBtn.textContent = 'Start';
        clearInterval(timer);
    }
}


function reset() {
    running = false;
    clearInterval(timer);
    elapsedTime = 0;
    updateDisplay();
    startStopBtn.textContent = 'Start';
    lapList.innerHTML = '';
    localStorage.removeItem('laps');
}


function recordLap() {
    if (running) {
        const lapTime = formatTime(elapsedTime);
        addLapToList(`Lap ${lapList.children.length + 1}: ${lapTime}`);
        saveLap(lapTime);
    }
}


function addLapToList(text) {
    const lapItem = document.createElement('li');
    lapItem.textContent = text;
    lapList.appendChild(lapItem);
}


function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}


function handleKeydown(event) {
    if (event.key === 's' || event.key === 'S') startStop();
    if (event.key === 'r' || event.key === 'R') reset();
    if (event.key === 'l' || event.key === 'L') recordLap();
}


startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);
themeToggle.addEventListener('click', toggleTheme);
window.addEventListener('keydown', handleKeydown);


loadLaps();
