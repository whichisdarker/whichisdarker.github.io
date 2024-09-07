let selectedColor = null;
let currentDifficulty = 'easy';
let numColors = 2; // Default to two colors
let colorButtons = []; // Store color buttons

// Manual brightness and paleness adjustment factors for each color family
const adjustments = {
    red: { brightness: 0.8, paleness: 0.65 },   // Red: Paleness at 0.7 (more pale)
    green: { brightness: 0.8, paleness: 0.5 }, // Green: Paleness at 0.8 (slightly pale)
    blue: { brightness: 0.9, paleness: 0.37 },  // Blue: Bright with paleness at 0.5 (vibrant)
    yellow: { brightness: 0.7, paleness: 0.37 } // Yellow: Less bright, but quite pale
};

document.addEventListener('DOMContentLoaded', () => {
    loadTwoColors(); // Default game mode is two colors
    setEventListeners();
});

function setEventListeners() {
    document.getElementById('twoColors').addEventListener('click', function() {
        loadTwoColors(); // Load two colors game
    });

    document.getElementById('threeColors').addEventListener('click', function() {
        loadThreeColors(); // Load three colors game
    });

    document.getElementById('fourColors').addEventListener('click', function() {
        loadFourColors(); // Load four colors game
    });

    // Set event listeners for the difficulty buttons
    document.querySelectorAll('.diffBtn').forEach(button => {
        button.addEventListener('click', function() {
            currentDifficulty = this.id;
            document.querySelectorAll('.diffBtn').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            if (numColors === 2) {
                loadTwoColors(); // Reload two colors game with new difficulty
            } else if (numColors === 3) {
                loadThreeColors(); // Reload three colors game with new difficulty
            } else if (numColors === 4) {
                loadFourColors(); // Reload four colors game with new difficulty
            }
        });
    });
}

// Highlight the correct button based on numColors
function highlightActiveButton() {
    document.querySelectorAll('.colorChoice').forEach(btn => btn.classList.remove('selected'));
    if (numColors === 2) {
        document.getElementById('twoColors').classList.add('selected');
    } else if (numColors === 3) {
        document.getElementById('threeColors').classList.add('selected');
    } else if (numColors === 4) {
        document.getElementById('fourColors').classList.add('selected');
    }
}

// Function to generate random colors from distinct families (red, green, blue, yellow) and apply brightness and paleness adjustments
function randomColorDifferentFamilies(numColors) {
    // Predefine four color families with manual brightness and paleness adjustments applied
    const families = [
        applyAdjustments({ r: 255, g: Math.random() * 128, b: Math.random() * 128 }, adjustments.red), // Reds
        applyAdjustments({ r: Math.random() * 128, g: 255, b: Math.random() * 128 }, adjustments.green), // Greens
        applyAdjustments({ r: 128 + Math.random() * 127, g: 128 + Math.random() * 127, b: 255 }, adjustments.blue), // Blues
        applyAdjustments({ r: 255, g: 255, b: Math.random() * 128 }, adjustments.yellow)  // Yellows
    ];

    // Shuffle the families to randomize the selection and limit the result to numColors
    let selectedFamilies = shuffleArray(families).slice(0, numColors);

    // Adjust colors based on difficulty
    let colorDiff = 10; // Default medium difference
    // if (currentDifficulty === 'easy') {
    //     colorDiff = 80; // Easy mode has a bigger difference
    // } else if (currentDifficulty === 'hard') {
    //     colorDiff = 10; // Hard mode has a very small difference
    // }

    const adjustColor = (family) => ({
        r: Math.min(Math.max(family.r + (Math.random() * colorDiff - colorDiff / 2), 0), 255),
        g: Math.min(Math.max(family.g + (Math.random() * colorDiff - colorDiff / 2), 0), 255),
        b: Math.min(Math.max(family.b + (Math.random() * colorDiff - colorDiff / 2), 0), 255)
    });

    // Return adjusted colors for each selected family
    return selectedFamilies.map(family => {
        const adjustedColor = adjustColor(family);
        return `rgb(${Math.floor(adjustedColor.r)}, ${Math.floor(adjustedColor.g)}, ${Math.floor(adjustedColor.b)})`;
    });
}

// Function to apply brightness and paleness adjustments to a color
function applyAdjustments(color, adjustments) {
    const { brightness, paleness } = adjustments;

    // Adjust brightness (make the color brighter or darker)
    let r = color.r * brightness;
    let g = color.g * brightness;
    let b = color.b * brightness;

    // Apply paleness by mixing the color with white (blend with 255 for paleness)
    r = r + (255 - r) * paleness;
    g = g + (255 - g) * paleness;
    b = b + (255 - b) * paleness;

    return { r, g, b };
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load two colors game
function loadTwoColors() {
    numColors = 2;
    createColorButtons(2);
    highlightActiveButton(); // Highlight the correct button
}

// Load three colors game
function loadThreeColors() {
    numColors = 3;
    createColorButtons(3);
    highlightActiveButton(); // Highlight the correct button
}

// Load four colors game
function loadFourColors() {
    numColors = 4;
    createColorButtons(4);
    highlightActiveButton(); // Highlight the correct button
}

// Function to create color buttons dynamically based on the number of colors
function createColorButtons(numColors) {
    const container = document.getElementById('colorContainer');
    container.innerHTML = ''; // Clear existing buttons
    colorButtons = [];

    // Generate colors from different families
    let colors = randomColorDifferentFamilies(numColors);

    for (let i = 0; i < numColors; i++) {
        let btn = document.createElement('button');
        btn.className = 'colorButton';
        btn.style.backgroundColor = colors[i]; // Assign colors from different families
        btn.addEventListener('click', function() {
            selectColor(this); // Handle selection
        });
        container.appendChild(btn);
        colorButtons.push(btn); // Add to the color buttons array
    }

    // Reset the game state and make sure the result and buttons are reset
    document.getElementById('result').textContent = ''; // Clear result
    document.getElementById('submitGuess').style.display = 'inline'; // Ensure submit button is visible
    document.getElementById('playAgain').style.display = 'none'; // Ensure play again button is hidden
    selectedColor = null; // Clear selected color
}

// Function to select a color
function selectColor(button) {
    // Remove existing selection state
    colorButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected'); // Mark the selected button
    selectedColor = button; // Store the selected color button
}

// Function to evaluate the user's guess
document.getElementById('submitGuess').addEventListener('click', function() {
    evaluateGuess();
    this.style.display = 'none'; // Hide "Submit Guess"
    document.getElementById('playAgain').style.display = 'inline'; // Show "Play Again"
});
// Function to evaluate the user's guess and handle color highlights
function evaluateGuess() {
    let luminances = colorButtons.map(btn => getLuminance(btn.style.backgroundColor));
    let minLum = Math.min(...luminances); // Find the minimum luminance (darker color)

    const correctGuess = selectedColor && luminances[colorButtons.indexOf(selectedColor)] === minLum;

    if (correctGuess) {
        selectedColor.style.border = '5px solid limegreen'; // Brighter green for correct selection
        document.getElementById('result').textContent = 'Correct!';
    } else {
        selectedColor.style.border = '5px solid red'; // Red for wrong selection
        const correctColor = colorButtons[luminances.indexOf(minLum)];
        correctColor.style.border = '5px solid limegreen'; // Brighter green for correct color
        document.getElementById('result').textContent = 'Incorrect!';
    }

    // Convert all colors to grayscale
    colorButtons.forEach(btn => {
        btn.style.backgroundColor = convertToGrayscale(btn.style.backgroundColor);
    });
}

// Function to calculate luminance of an RGB color
function getLuminance(rgb) {
    const values = rgb.match(/\d+/g).map(Number);
    return 0.299 * values[0] + 0.587 * values[1] + 0.114 * values[2];
}

// Function to convert RGB color to grayscale
function convertToGrayscale(rgb) {
    const luminance = getLuminance(rgb);
    return `rgb(${luminance}, ${luminance}, ${luminance})`;
}

// Play again functionality
document.getElementById('playAgain').addEventListener('click', function() {
    if (numColors === 2) {
        loadTwoColors();
    } else if (numColors === 3) {
        loadThreeColors();
        } else if (numColors === 4) {
        loadFourColors();
        }
        });