document.write(`
    <style>
        .grid {
            display: grid;
            grid-template-columns: repeat(16, 40px);
            gap: 5px;
        }
        .cell {
            width: 40px;    
            height: 40px;
            background-color: lightgray;
            border: 1px solid gray;
            cursor: pointer;
        }
        .active {
            background-color: green;
        }
    </style>
    <div id="gameContainer"></div>
    <button onclick="play()">Play</button>
`);

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const grid = Array(notes.length).fill().map(() => Array(16).fill(false));
const audioContext = new AudioContext();

function toggleCell(noteIndex, cellIndex) {
    grid[noteIndex][cellIndex] = !grid[noteIndex][cellIndex];
    renderGrid();
}

async function play() {
    for (let cellIndex = 0; cellIndex < 16; cellIndex++) {
        for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
            if (grid[noteIndex][cellIndex]) {
                playNote(notes[noteIndex]);
            }
        }
        await delay(125);
    }
}

function playNote(note) {
    const frequencies = {
        C: 261.63,
        D: 293.66,
        E: 329.63,
        F: 349.23,
        G: 392,
        A: 440,
        B: 493.88
    };
    const frequency = frequencies[note];
    if (frequency) {
        createOscillator(frequency);
    }
}

function createOscillator(frequency) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.exponentialRampToValueAtTime(1e-5, audioContext.currentTime + 1);
    oscillator.frequency.value = frequency;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function renderGrid() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = '';
    notes.forEach((note, noteIndex) => {
        const row = document.createElement('div');
        row.classList.add('grid');
        grid[noteIndex].forEach((isActive, cellIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (isActive) {
                cell.classList.add('active');
            }
            cell.onclick = () => toggleCell(noteIndex, cellIndex);
            row.appendChild(cell);
        });
        gameContainer.appendChild(row);
    });
}

renderGrid();
