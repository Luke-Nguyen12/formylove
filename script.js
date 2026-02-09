// --- GLOBAL VARIABLES ---
const envelope = document.querySelector('.letter');
const letterContent = document.querySelector('.letter-content');
const line1Text = "Will you be my"; 
const line2Text = "Valentine?";
const buttons = document.querySelector('.response-buttons');
const noButton = document.getElementById('no-btn');
const music = document.getElementById('bg-music');
const yesAudio = document.getElementById('yes-audio'); // Added this here
const muteBtn = document.getElementById('mute-btn');
const sadMusic = document.getElementById('sad-music');

const pickupText = "You're the paw-fect match for me...";

// State Variables
let noClickCount = 0; 
const maxMoves = 6; 
let petCount = 0;
let petCount2 = 0; 
const maxPets = 10; 
let gameWon = false;
let game2Won = false;

// Default Volume
if (music) { music.volume = 0.25; }
if (yesAudio) { yesAudio.volume = 0.35; }

// --- 1. ENVELOPE CLICK LISTENER ---
envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');

        if (music) {
            music.volume = 0;
            music.play();
            let fadeAudio = setInterval(() => {
                if (music.volume < 0.45) { // Fading to 50%
                    music.volume += 0.05;
                } else {
                    music.volume = 0.5;
                    clearInterval(fadeAudio);
                }
            }, 200);
        }

        setTimeout(() => { startGame(); }, 1500);
    }
});

// --- 2. MUTE BUTTON ---
if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        const isMuted = !music.muted;
        music.muted = isMuted;
        if (yesAudio) yesAudio.muted = isMuted;
        muteBtn.innerText = isMuted ? "🔇" : "🔊";
    });
}

// --- 3. NO BUTTON LOGIC ---
noButton.addEventListener('click', (e) => {
    if (noClickCount === 0) {
        e.preventDefault();
        moveNoButton();
        noClickCount++;
        noButton.addEventListener('mouseover', hoverHandler);
    } else if (noClickCount >= maxMoves) {
        startSecondGame();
    }
});

function hoverHandler() {
    if (noClickCount < maxMoves) {
        moveNoButton();
        noClickCount++;
    } else {
        noButton.removeEventListener('mouseover', hoverHandler);
        noButton.style.cursor = "pointer";
    }
}

function moveNoButton() {
    if (noButton.parentNode !== document.body) {
        document.body.appendChild(noButton);
        noButton.style.position = 'fixed'; 
        noButton.style.zIndex = '99999'; 
    }
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const buffer = 280; 
    const bufferY = 200; 

    let x, y;
    let safe = false;
    let attempts = 0;

    while (!safe && attempts < 50) {
        x = Math.random() * (window.innerWidth - noButton.offsetWidth - 50);
        y = Math.random() * (window.innerHeight - noButton.offsetHeight - 50);
        const inX = x > (centerX - buffer) && x < (centerX + buffer);
        const inY = y > (centerY - bufferY) && y < (centerY + bufferY);
        if (!inX || !inY) { safe = true; }
        attempts++;
    }
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}

// --- 4. GAMES ---
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
    dog.style.transform = "scale(0.9)";
    setTimeout(() => { dog.style.transform = "scale(1)"; }, 100);
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
    if (letterHeader) letterHeader.classList.add('hidden-header');
    gameScreen.style.opacity = '0';
    setTimeout(() => {
        gameScreen.style.display = 'none';
        letterContainer.style.display = 'flex'; 
        letterContainer.style.opacity = '0'; 
        envelope.style.backgroundColor = 'transparent';
        envelope.style.boxShadow = 'none';
        if(letterContent) {
            letterContent.style.opacity = '1';
            letterContent.style.transform = 'translateY(-10px)';
        }
        setTimeout(() => {
            letterContainer.classList.add('slow-fade-in');
            runPickupLineSequence(); 
        }, 50);
    }, 500);
}

function startSecondGame() {
    const letterContainer = document.querySelector('.container');
    const game2Screen = document.getElementById('second-game-container');
    
    // Smoothly swap BG music for Sad music over 1.5 seconds
    crossfade(music, sadMusic, 1500);

    noButton.style.display = 'none';
    letterContainer.style.display = 'none';
    game2Screen.style.display = 'flex';
    setTimeout(() => { game2Screen.style.opacity = '1'; }, 50);
}

function petDog2() {
    if (game2Won) return; 
    const dog = document.getElementById('dog-photo-2');
    const pinkStop = document.getElementById('fill-stop-2');
    const greyStop = document.getElementById('empty-stop-2');
    dog.style.transform = "scale(0.9)";
    setTimeout(() => { dog.style.transform = "scale(1)"; }, 100);
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
    
    // Smoothly swap Sad music back to BG music
    crossfade(sadMusic, music, 1500);

    game2Screen.style.opacity = '0';
    setTimeout(() => {
        game2Screen.style.display = 'none';
        letterContainer.style.display = 'flex'; 
        buttons.style.display = 'flex';
        if(noButton) noButton.remove(); 
    }, 500);
}

// --- 5. CELEBRATION & TYPING ---
function celebrate() {
    const letterContainer = document.querySelector('.container');
    const celebrationScreen = document.getElementById('celebration');

    const currentActive = (sadMusic && !sadMusic.paused) ? sadMusic : music;

    if (currentActive) {
        let quickFade = setInterval(() => {
            if (currentActive.volume > 0.1) {
                currentActive.volume -= 0.1;
            } else {
                currentActive.pause();
                clearInterval(quickFade);
                if (yesAudio) yesAudio.play(); // Start the celebration!
            }
        }, 50);
    } else {
        if (yesAudio) yesAudio.play();
    }
    
    if (noButton) noButton.style.display = 'none';
    letterContainer.style.transition = "opacity 1s ease";
    letterContainer.style.opacity = "0";
    
    setTimeout(() => {
        letterContainer.style.display = "none"; 
        celebrationScreen.style.display = "flex"; 
        setTimeout(() => { celebrationScreen.style.opacity = "1"; }, 50);
    }, 1000);
}

function runPickupLineSequence() {
    const pickupEl = document.getElementById('pickup-line');
    const letterHeader = document.querySelector('.letter-header');
    pickupEl.innerHTML = pickupText;
    setTimeout(() => { pickupEl.style.opacity = '1'; }, 1000);
    setTimeout(() => {
        pickupEl.style.opacity = '0';
        setTimeout(() => {
            if (letterHeader) letterHeader.classList.remove('hidden-header');
            startTypingSequence();
        }, 1000);
    }, 3000);
}

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
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function resetEverything() { location.reload(); }

function crossfade(fromAudio, toAudio, duration = 2000) {
    const steps = 20;
    const intervalTime = duration / steps;
    const volumeStep = 0.05; // Adjusting by 5% each step

    let fadeInterval = setInterval(() => {
        // Lower the "from" audio
        if (fromAudio && fromAudio.volume > 0.05) {
            fromAudio.volume -= volumeStep;
        } else if (fromAudio) {
            fromAudio.pause();
            fromAudio.volume = 0;
        }

        // Raise the "to" audio
        if (toAudio) {
            if (toAudio.paused) {
                toAudio.volume = 0;
                toAudio.play();
            }
            if (toAudio.volume < 0.45) {
                toAudio.volume += volumeStep;
            } else {
                toAudio.volume = 0.5;
                clearInterval(fadeInterval); // Transition complete
            }
        }
        
        // If 'from' is done and 'to' is at target, stop
        if ((!fromAudio || fromAudio.paused) && (!toAudio || toAudio.volume >= 0.5)) {
            clearInterval(fadeInterval);
        }
    }, intervalTime);
}