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
    // Generate random X and Y positions
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);
    
    btn.style.position = 'fixed'; // Break it out of the layout
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
}

// Celebration when she clicks Yes
function celebrate() {
    alert("Yay! I'm looking foward to it, my pretty girl! ❤️");
}