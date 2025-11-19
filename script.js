
const WORK_TIME = 1*60;  // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

let remainingTime = WORK_TIME;
let timerInterval = null;
let isRunning = false;
let isBreak = false;

let completedSessions = parseInt(localStorage.getItem("sessions")) || 0;

const timerDisplay = document.getElementById("timer");
const modeText = document.getElementById("mode");
const countDisplay = document.getElementById("count");
const progressBar = document.getElementById("progress");

document.getElementById("startBtn").addEventListener("click", startTimer);
document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
document.getElementById("resetBtn").addEventListener("click", resetTimer);

const alarm = new Audio("./assets/alarm.wav");

updateDisplay();
countDisplay.textContent = completedSessions;

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timerInterval = setInterval(() => {
    remainingTime--;

    updateDisplay();
    updateProgress();

    // When timer ends
    if (remainingTime <= 0) {
      alarm.play();
      clearInterval(timerInterval);

      if (!isBreak) {
        completedSessions++;
        localStorage.setItem("sessions", completedSessions);
        countDisplay.textContent = completedSessions;
      }

      switchMode();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();

  isBreak = false;
  remainingTime = WORK_TIME;

  modeText.textContent = "Focus Mode";
  updateDisplay();
  updateProgress();
}


function switchMode() {
  isBreak = !isBreak;

  if (isBreak) {
    remainingTime = BREAK_TIME;
    modeText.textContent = "Break Time";
  } else {
    remainingTime = WORK_TIME;
    modeText.textContent = "Focus Mode";
  }

  updateDisplay();
  updateProgress();

  startTimer(); 
}


function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingTime % 60)
    .toString()
    .padStart(2, "0");

  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateProgress() {
  const total = isBreak ? BREAK_TIME : WORK_TIME;
  const percent = ((total - remainingTime) / total) * 100;

  progressBar.style.width = percent + "%";
}

