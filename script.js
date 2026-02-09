const envelope = document.querySelector('.letter');
const letterContent = document.querySelector('.letter-content');
const line1 = "Will you be my";
const line2 = "Valentine?";
const buttons = document.querySelector('.response-buttons');

let isOpened = false;
let petCount = 0;
const maxPets = 10; // Number of clicks required to win
let gameWon = false;

// 1. Updated Envelope Click Listener
envelope.addEventListener('click', () => {
    // Only run this logic if it hasn't been opened yet
    if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');

        // Wait 1.5s for envelope to open/fade, THEN start game
        setTimeout(() => {
            startGame(); 
        }, 1500);
    }
});

// 2. Function to Start the Game
function startGame() {
    const gameScreen = document.getElementById('dog-game-container');
    const letterContainer = document.querySelector('.container');
    
    // Hide the envelope completely so it doesn't interfere
    letterContainer.style.display = 'none';

    // Show the Game
    gameScreen.style.display = 'flex';
    // Small delay to trigger fade in
    setTimeout(() => {
        gameScreen.style.opacity = '1';
    }, 50);
}

// 3. Function to Pet the Dog
function petDog() {
    if (gameWon) return; // Stop if already won

    const dog = document.getElementById('dog-photo');
    const heartWrapper = document.getElementById('heart-fill-wrapper');
    
    // Add Smush Effect (Visual only, CSS :active handles most of it)
    dog.style.transform = "scale(0.9)";
    setTimeout(() => { dog.style.transform = "scale(1)"; }, 100);

    // Increment Counter
    petCount++;
    
    // Calculate Percentage (e.g., 5 pets / 10 max = 50%)
    const percentage = (petCount / maxPets) * 100;
    heartWrapper.style.height = `${percentage}%`;

    // Check for Win
    if (petCount >= maxPets) {
        gameWon = true;
        setTimeout(endGame, 500); // Wait half a second after filling heart
    }
}

// 4. Function to End Game and Start Typing
function endGame() {
    const gameScreen = document.getElementById('dog-game-container');
    const letterContainer = document.querySelector('.container');
    
    // Fade out game
    gameScreen.style.opacity = '0';
    
    setTimeout(() => {
        gameScreen.style.display = 'none';
        
        // Bring back the letter container (but transparent background)
        letterContainer.style.display = 'flex'; 
        envelope.style.backgroundColor = 'transparent';
        envelope.style.boxShadow = 'none';
        
        // NOW we start the typewriter effect!
        // (Paste your original TypeWriter sequence here)
        startTypingSequence();
    }, 500);
}

// 5. Your Original Typing Sequence (Moved into a function)
function startTypingSequence() {
    typeWriter(line1, 'line1', 100, () => {
        typeWriter(line2, 'line2', 150, () => {
            setTimeout(() => {
                // Show Buttons
                const buttons = document.querySelector('.response-buttons');
                buttons.style.display = 'flex';
            }, 500);
        });
    });
}
function typeWriter(text, elementId, speed, callback) {
    let i = 0;
    const element = document.getElementById(elementId);
    
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

// Make the "No" button run away!
function moveButton(btn) {
    // [FIX] If the button is still inside the letter container,
    // move it to the main document body so it can run anywhere.
    if (btn.parentNode !== document.body) {
        document.body.appendChild(btn);
        
        // Force it to use screen coordinates
        btn.style.position = 'fixed'; 
        
        // Ensure it stays on top of everything
        btn.style.zIndex = '99999'; 
    }

    // Generate random X and Y positions within the screen
    // We substract 100px to ensure it doesn't go too close to the edge
    const x = Math.random() * (window.innerWidth - btn.offsetWidth - 50);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight - 50);

    // Apply new positions
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
}

// Celebration when she clicks Yes
function celebrate() {
    // 1. Select elements
    const letterContainer = document.querySelector('.container');
    const celebrationScreen = document.getElementById('celebration');
    const noButton = document.querySelector('.btn-no');
    if (noButton) {
        noButton.style.display = 'none';
    }
    
    // 2. Fade out the letter
    letterContainer.style.transition = "opacity 1s ease";
    letterContainer.style.opacity = "0";
    
    // 3. Wait 1s, then swap
    setTimeout(() => {
        letterContainer.style.display = "none"; 
        celebrationScreen.style.display = "flex"; // Show new screen
        
        // Trigger fade-in
        setTimeout(() => {
            celebrationScreen.style.opacity = "1";
        }, 50);
    }, 1000);
}
function resetEverything() {
    // 1. Get all elements
    const letterContainer = document.querySelector('.container');
    const envelope = document.querySelector('.letter');
    const celebrationScreen = document.getElementById('celebration');
    const gameScreen = document.getElementById('dog-game-container');
    const heartFill = document.getElementById('heart-fill-wrapper');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const buttons = document.querySelector('.response-buttons');
    const noButton = document.querySelector('.btn-no');

    // 2. Reset Variables
    isOpened = false;
    petCount = 0;
    gameWon = false;

    // 3. Hide Celebration Screen
    celebrationScreen.style.opacity = '0';
    setTimeout(() => {
        celebrationScreen.style.display = 'none';

        // 4. Reset Envelope State
        letterContainer.style.display = 'flex';
        letterContainer.style.opacity = '1';
        envelope.classList.remove('opened');
        
        // Reset Envelope Styles (that were changed by transitions)
        envelope.style.backgroundColor = ''; 
        envelope.style.boxShadow = '';

        // 5. Reset Dog Game
        gameScreen.style.display = 'none';
        gameScreen.style.opacity = '0';
        heartFill.style.height = '0%'; // Empty heart

        // 6. Reset Text (Clear the typewriter text)
        line1.innerHTML = '';
        line2.innerHTML = '';
        
        // 7. Reset Buttons
        buttons.style.display = 'none';
        
        // Bring the "No" button back if it ran away
        if (noButton) {
            noButton.style.position = ''; // Clear fixed position
            noButton.style.left = '';
            noButton.style.top = '';
            document.querySelector('.response-buttons').appendChild(noButton); // Put it back in container
            noButton.style.display = ''; // Make visible again
        }

    }, 500);
} 