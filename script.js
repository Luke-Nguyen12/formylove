// --- GLOBAL VARIABLES ---
const envelope = document.querySelector('.letter');
const letterContent = document.querySelector('.letter-content');
// These are the strings we want to type:
const line1Text = "Will you be my"; 
const line2Text = "Valentine?";
const buttons = document.querySelector('.response-buttons');

let isOpened = false;
let petCount = 0;
const maxPets = 10; // Number of clicks required to win
let gameWon = false;

// --- 1. ENVELOPE CLICK LISTENER ---
envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');
        
        // Wait 1.5s for envelope to open, THEN start game
        setTimeout(() => {
            startGame(); 
        }, 1500);
    }
});

// --- 2. START DOG GAME ---
function startGame() {
    const gameScreen = document.getElementById('dog-game-container');
    const letterContainer = document.querySelector('.container');
    
    // Hide envelope
    letterContainer.style.display = 'none';

    // Show Game
    gameScreen.style.display = 'flex';
    setTimeout(() => {
        gameScreen.style.opacity = '1';
    }, 50);
}

// --- 3. PET THE DOG LOGIC ---
function petDog() {
    if (gameWon) return; 

    const dog = document.getElementById('dog-photo');
    const pinkStop = document.getElementById('fill-stop');
    const greyStop = document.getElementById('empty-stop');
    
    // Smush Effect
    dog.style.transform = "scale(0.9)";
    setTimeout(() => { dog.style.transform = "scale(1)"; }, 100);

    // Increment Counter
    petCount++;

    // [FIXED] You were missing this math line!
    const percentage = (petCount / maxPets) * 100;

    // Update the SVG Gradient Offsets
    if (pinkStop && greyStop) {
        pinkStop.setAttribute('offset', `${percentage}%`);
        greyStop.setAttribute('offset', `${percentage}%`);
    }
    
    // Check for Win
    if (petCount >= maxPets) {
        gameWon = true;
        setTimeout(endGame, 500); 
    }
}

// --- 4. END GAME & START TYPING ---
function endGame() {
    const gameScreen = document.getElementById('dog-game-container');
    const letterContainer = document.querySelector('.container');
    
    // Fade out game
    gameScreen.style.opacity = '0';
    
    setTimeout(() => {
        gameScreen.style.display = 'none';
        
        // Bring back the letter container
        letterContainer.style.display = 'flex'; 
        
        // Make envelope transparent so we just see text
        envelope.style.backgroundColor = 'transparent';
        envelope.style.boxShadow = 'none';
        
        // Ensure content is visible
        if(letterContent) {
            letterContent.style.opacity = '1';
            letterContent.style.transform = 'translateY(-10px)';
        }
        
        // Start typing
        startTypingSequence();
    }, 500);
}

// --- 5. TYPING SEQUENCE ---
function startTypingSequence() {
    // Hide buttons initially
    buttons.style.display = 'none';

    typeWriter(line1Text, 'line1', 100, () => {
        typeWriter(line2Text, 'line2', 150, () => {
            setTimeout(() => {
                buttons.style.display = 'flex';
            }, 500);
        });
    });
}

function typeWriter(text, elementId, speed, callback) {
    let i = 0;
    const element = document.getElementById(elementId);
    
    // Safety check
    if (!element) return;
    
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

/* --- FUN FUNCTIONS --- */

function moveButton(btn) {
    if (btn.parentNode !== document.body) {
        document.body.appendChild(btn);
        btn.style.position = 'fixed'; 
        btn.style.zIndex = '99999'; 
    }

    const x = Math.random() * (window.innerWidth - btn.offsetWidth - 50);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight - 50);

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
}

function celebrate() {
    const letterContainer = document.querySelector('.container');
    const celebrationScreen = document.getElementById('celebration');
    const noButton = document.querySelector('.btn-no');

    if (noButton) noButton.style.display = 'none';
    
    letterContainer.style.transition = "opacity 1s ease";
    letterContainer.style.opacity = "0";
    
    setTimeout(() => {
        letterContainer.style.display = "none"; 
        celebrationScreen.style.display = "flex"; 
        setTimeout(() => {
            celebrationScreen.style.opacity = "1";
        }, 50);
    }, 1000);
}

// --- RESET FUNCTION ---
function resetEverything() {
    // The cleanest way to reset animations, text, and moved buttons
    // is to simply reload the page!
    location.reload();
}