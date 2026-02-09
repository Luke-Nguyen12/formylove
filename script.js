const envelope = document.querySelector('.letter');
const line1 = "Will you be my";
const line2 = "Valentine?";
const buttons = document.querySelector('.response-buttons');

let isOpened = false;

envelope.addEventListener('click', () => {
    // 1. Open the Envelope
    if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');
    }

    // 2. Start Typing (Only once)
    if (!isOpened) {
        isOpened = true;
        
        // Wait 1.5s for fade out, then type Line 1
        setTimeout(() => {
            typeWriter(line1, 'line1', 100, () => {
                // Wait, then type Line 2
                typeWriter(line2, 'line2', 150, () => {
                    // Show the buttons!
                    setTimeout(() => {
                        buttons.style.display = 'flex';
                    }, 500);
                });
            });
        }, 1500); 
    }
});

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