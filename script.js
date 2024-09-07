let selectedColor = null;
let currentDifficulty = 'easy';  // Default difficulty

document.getElementById('color1').addEventListener('click', function() {
    selectColor(this, 'left');
});
document.getElementById('color2').addEventListener('click', function() {
    selectColor(this, 'right');
});

document.getElementById('submitGuess').addEventListener('click', function() {
    evaluateGuess();
    this.style.display = 'none';  // Hide the submit button after guessing
    document.getElementById('playAgain').style.display = 'inline'; // Show play again button after guess
});

document.getElementById('playAgain').addEventListener('click', function() {
    initGame();
    this.style.display = 'none';  // Hide play again button after clicking
    document.getElementById('submitGuess').style.display = 'inline'; // Show the submit button again
});

document.querySelectorAll('#difficulty button').forEach(button => {
    button.addEventListener('click', function() {
        currentDifficulty = this.id;
        document.querySelectorAll('#difficulty button').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        initGame();
    });
});

function randomColor() {
    let color1 = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    let color2 = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    let c1Luminance = getLuminance(color1);
    let c2Luminance = getLuminance(color2);
    let luminanceDiff = Math.abs(c1Luminance - c2Luminance);

    let difficultyTarget = 90;  // Target luminance difference

    switch (currentDifficulty) {
        case 'easy':
            difficultyTarget = 90;
            break;
        case 'medium':
            difficultyTarget = 45;
            break;
        case 'hard':
            difficultyTarget = 10;  // Make it harder
            break;
    }

    // Adjust colors until the luminance difference matches the difficulty
    while (luminanceDiff > difficultyTarget + 5 || luminanceDiff < difficultyTarget - 5) {
        color2 = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        c2Luminance = getLuminance(color2);
        luminanceDiff = Math.abs(c1Luminance - c2Luminance);
    }

    return [color1, color2];
}

function selectColor(button, position) {
    const arrow = document.getElementById('arrow');
    arrow.style.display = 'block';
    arrow.style.left = position === 'left' ? '75px' : '225px';
    selectedColor = button;
}

function evaluateGuess() {
    const color1 = document.getElementById('color1');
    const color2 = document.getElementById('color2');
    const c1Luminance = getLuminance(color1.style.backgroundColor);
    const c2Luminance = getLuminance(color2.style.backgroundColor);

    color1.style.backgroundColor = convertToGrayscale(color1.style.backgroundColor);
    color2.style.backgroundColor = convertToGrayscale(color2.style.backgroundColor);

    const correctGuess = (c1Luminance < c2Luminance && selectedColor === color1) ||
                         (c1Luminance > c2Luminance && selectedColor === color2);

    document.getElementById('result').textContent = correctGuess ? 'Correct!' : 'Incorrect!';
}

function getLuminance(rgb) {
    const values = rgb.match(/\d+/g).map(Number);
    return 0.299 * values[0] + 0.587 * values[1] + 0.114 * values[2]; // Standard luminance formula
}

function convertToGrayscale(rgb) {
    const luminance = getLuminance(rgb);
    return `rgb(${luminance}, ${luminance}, ${luminance})`;
}

function initGame() {
    const colors = randomColor();
    document.getElementById('color1').style.backgroundColor = colors[0];
    document.getElementById('color2').style.backgroundColor = colors[1];
    document.getElementById('result').textContent = '';
    document.getElementById('arrow').style.display = 'none';
    selectedColor = null;
}

window.onload = initGame;