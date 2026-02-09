// --- GLOBAL VARIABLES ---
const envelope = document.querySelector('.letter');
const letterContent = document.querySelector('.letter-content');
const line1Text = "Will you be my"; 
const line2Text = "Valentine?";
const buttons = document.querySelector('.response-buttons');
const noButton = document.getElementById('no-btn');
const music = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');

const pickupText = "You're the paw-fect match for me...";

// State Variables
let isOpened = false;
let petCount = 0;
let petCount2 = 0; // For Game 2
const maxPets = 10; 
let gameWon = false;
let game2Won = false;

// No Button Logic Variables
let noClickCount = 0; // Tracks how many times it moved
const maxMoves = 6;   // Moves 3 times, then stops

if (music) {
    music.volume = 0.5;
}

// --- 1. ENVELOPE CLICK LISTENER ---
envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');

        // --- MUSIC LOGIC STARTS HERE ---
        if (music) {
            music.volume = 0;
            music.play();

            let fadeAudio = setInterval(() => {
                if (music.volume < 0.9) {
                    music.volume += 0.1;
                } else {
                    music.volume = 1;
                    clearInterval(fadeAudio);
                }
            }, 200);
        }
        // --- MUSIC LOGIC ENDS HERE ---

        setTimeout(() => { 
            startGame(); 
        }, 1500);
    }
});

// --- 2. NO BUTTON LOGIC (The Prank) ---
// First Interaction: CLICK causes the first jump
noButton.addEventListener('click', (e) => {
    if (noClickCount === 0) {
        e.preventDefault(); // Stop click from doing anything
        moveNoButton();
        noClickCount++;
        
        // After first click, enable HOVER to run away
        noButton.addEventListener('mouseover', hoverHandler);
    } else if (noClickCount >= maxMoves) {
        // If it moved 3 times, this click triggers Game 2
        startSecondGame();
    }
});

// Subsequent Interactions: HOVER causes jumps
function hoverHandler() {
    if (noClickCount < maxMoves) {
        moveNoButton();
        noClickCount++;
    } else {
        // Stop moving after 3 jumps!
        // We remove the listener so the user can finally click it
        noButton.removeEventListener('mouseover', hoverHandler);
        noButton.style.cursor = "pointer"; // Show them it's clickable
    }
}

function moveNoButton() {
    // 1. Move to body so it can fly anywhere
    if (noButton.parentNode !== document.body) {
        document.body.appendChild(noButton);
        noButton.style.position = 'fixed'; 
        noButton.style.zIndex = '99999'; 
    }

    // 2. Define the "Exclusion Zone" (The Center Paper)
    // The paper is approx 500px wide x 350px tall. 
    // We add a buffer so the button doesn't even touch the edge.
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const buffer = 280; // 250px (half width) + 30px extra space
    const bufferY = 200; // 175px (half height) + 25px extra space

    let x, y;
    let safe = false;
    let attempts = 0;

    // 3. Keep trying random spots until one is safe (not in the center)
    while (!safe && attempts < 50) {
        x = Math.random() * (window.innerWidth - noButton.offsetWidth - 50);
        y = Math.random() * (window.innerHeight - noButton.offsetHeight - 50);

        // Check if the coordinates are inside the exclusion box
        const inX = x > (centerX - buffer) && x < (centerX + buffer);
        const inY = y > (centerY - bufferY) && y < (centerY + bufferY);

        // If it's NOT in X or NOT in Y, it's safe!
        if (!inX || !inY) {
            safe = true;
        }
        attempts++;
    }

    // 4. Apply the safe coordinates
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}

// --- 3. GAME 1 (The First Dog) ---
function startGame() {
    const gameScreen = document.getElementById('dog-game-container');
    const letterContainer = document.querySelector('.container');
    
    letterContainer.style.display = 'none';
    gameScreen.style.display = 'flex';
    setTimeout(() => { gameScreen.style.opacity = '1'; }, 50);
}

function petDog() {
    if (gameWon) return; 

    const dog = document.getElementById('dog-photo');
    const pinkStop = document.getElementById('fill-stop');
    const greyStop = document.getElementById('empty-stop');
    
    // Smush
    dog.style.transform = "scale(0.9)";
    setTimeout(() => { dog.style.transform = "scale(1)"; }, 100);

    // Math
    petCount++;
    const percentage = (petCount / maxPets) * 100;

    if (pinkStop && greyStop) {
        pinkStop.setAttribute('offset', `${percentage}%`);
        greyStop.setAttribute('offset', `${percentage}%`);
    }
    
    if (petCount >= maxPets) {
        gameWon = true;
        setTimeout(endGame, 500); 
    }
}

function endGame() {
    const gameScreen = document.getElementById('dog-game-container');
    const letterContainer = document.querySelector('.container');
    const letterHeader = document.querySelector('.letter-header');
    
    // 1. Hide the Heart Header immediately so it doesn't show up yet
    if (letterHeader) letterHeader.classList.add('hidden-header');
    
    // 2. Fade out game
    gameScreen.style.opacity = '0';
    
    setTimeout(() => {
        gameScreen.style.display = 'none';
        
        // 3. Prepare Letter
        letterContainer.style.display = 'flex'; 
        // Reset opacity to 0 first so we can fade it in
        letterContainer.style.opacity = '0'; 
        
        envelope.style.backgroundColor = 'transparent';
        envelope.style.boxShadow = 'none';
        
        if(letterContent) {
            letterContent.style.opacity = '1';
            letterContent.style.transform = 'translateY(-10px)';
        }
        
        // 4. Trigger the SLOW Fade In (Wait 50ms to ensure display:flex applies first)
        setTimeout(() => {
            letterContainer.classList.add('slow-fade-in');
            
            // 5. Start Pickup Line Sequence
            runPickupLineSequence(); 
        }, 50);
        
    }, 500);
}

// --- 4. GAME 2 (The Second Dog Screen) ---
function startSecondGame() {
    const letterContainer = document.querySelector('.container');
    const game2Screen = document.getElementById('second-game-container');
    
    // Hide the No Button if it's floating on the body
    noButton.style.display = 'none';

    // Hide Letter
    letterContainer.style.display = 'none';
    
    // Show Game 2
    game2Screen.style.display = 'flex';
    setTimeout(() => { game2Screen.style.opacity = '1'; }, 50);
}

function petDog2() {
    if (game2Won) return; 

    const dog = document.getElementById('dog-photo-2');
    const pinkStop = document.getElementById('fill-stop-2');
    const greyStop = document.getElementById('empty-stop-2');
    
    // Smush
    dog.style.transform = "scale(0.9)";
    setTimeout(() => { dog.style.transform = "scale(1)"; }, 100);

    // Math
    petCount2++;
    const percentage = (petCount2 / maxPets) * 100;

    if (pinkStop && greyStop) {
        pinkStop.setAttribute('offset', `${percentage}%`);
        greyStop.setAttribute('offset', `${percentage}%`);
    }
    
    if (petCount2 >= maxPets) {
        game2Won = true;
        setTimeout(endGame2, 500); 
    }
}

function endGame2() {
    const game2Screen = document.getElementById('second-game-container');
    const letterContainer = document.querySelector('.container');
    
    game2Screen.style.opacity = '0';
    setTimeout(() => {
        game2Screen.style.display = 'none';
        
        // Show Letter AGAIN
        letterContainer.style.display = 'flex'; 
        
        // Ensure buttons are visible immediately since text is typed
        buttons.style.display = 'flex';
        
        // BUT... Remove the No Button forever!
        // (If it's attached to body or container, remove it)
        if(noButton) noButton.remove(); 
        
    }, 500);
}


// --- 5. TYPING & CELEBRATION ---
function startTypingSequence() {
    buttons.style.display = 'none';
    typeWriter(line1Text, 'line1', 100, () => {
        typeWriter(line2Text, 'line2', 150, () => {
            setTimeout(() => { buttons.style.display = 'flex'; }, 500);
        });
    });
}

function typeWriter(text, elementId, speed, callback) {
    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;
    element.innerHTML = ""; // Clear previous text if any
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    type();
}

function celebrate() {
    const letterContainer = document.querySelector('.container');
    const celebrationScreen = document.getElementById('celebration');
    
    // Just in case noButton exists
    if (noButton) noButton.style.display = 'none';
    
    letterContainer.style.transition = "opacity 1s ease";
    letterContainer.style.opacity = "0";
    
    setTimeout(() => {
        letterContainer.style.display = "none"; 
        celebrationScreen.style.display = "flex"; 
        setTimeout(() => { celebrationScreen.style.opacity = "1"; }, 50);
    }, 1000);
}

function resetEverything() {
    location.reload();
}
function runPickupLineSequence() {
    const pickupEl = document.getElementById('pickup-line');
    const letterHeader = document.querySelector('.letter-header');
    
    // Set the text

    pickupEl.innerHTML = pickupText;
    
    // 1. Show Pickup Line (Wait 1s after letter fade starts)
    setTimeout(() => {
        pickupEl.style.opacity = '1';
    }, 1000);
    
    // 2. Wait 4 seconds for reading, then Fade Out Pickup
    setTimeout(() => {
        pickupEl.style.opacity = '0';
        
        // 3. Wait 1s for fade out, THEN Reveal Heart & Start Typing
        setTimeout(() => {
            // REVEAL THE HEART NOW!
            if (letterHeader) letterHeader.classList.remove('hidden-header');
            
            // Start Typing
            startTypingSequence();
        }, 1000);
        
    }, 3000); // 1s delay + 4s reading time
}

muteBtn.addEventListener('click', () => {
    if (music.muted) {
        music.muted = false;
        muteBtn.innerText = "🔊";
    } else {
        music.muted = true;
        muteBtn.innerText = "🔇";
    }
});