// ===== Floating Hearts Background =====
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['❤️', '💕', '💗', '💖', '💘', '🩷', '🤍'];

    function spawnHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        const duration = Math.random() * 8 + 6;
        heart.style.animationDuration = duration + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }

    // Spawn hearts periodically
    setInterval(spawnHeart, 800);
    // Initial batch
    for (let i = 0; i < 8; i++) {
        setTimeout(spawnHeart, i * 300);
    }
}

// ===== Step Navigation =====
function goToStep(stepId) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(stepId);
    target.classList.add('active');
}

// ===== Step 1: Envelope =====
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    envelope.addEventListener('click', function () {
        this.classList.add('opened');
        setTimeout(() => {
            goToStep('step-reasons');
            initReasons();
        }, 800);
    });
}

// ===== Step 2: Reasons Slideshow =====
const reasons = [
    "Your smile lights up my entire day, even the worst ones.",
    "The way you laugh at my terrible jokes makes me feel like a comedian.",
    "You always know exactly what to say when I need it most.",
    "Every moment with you feels like an adventure I never want to end.",
    "You make me want to be a better person, just by being you."
];

let currentReason = 0;

function initReasons() {
    const dotsContainer = document.getElementById('reason-dots');
    dotsContainer.innerHTML = '';
    reasons.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('reason-dot');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    showReason(0);

    document.getElementById('btn-next-reason').addEventListener('click', nextReason);
}

function showReason(index) {
    const numberEl = document.getElementById('reason-number');
    const textEl = document.getElementById('reason-text');

    numberEl.textContent = '#' + (index + 1);
    textEl.textContent = reasons[index];

    // Update dots
    document.querySelectorAll('.reason-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextReason() {
    const card = document.getElementById('reason-card');

    // Swipe out animation
    card.classList.add('swipe-out');

    setTimeout(() => {
        currentReason++;

        if (currentReason >= reasons.length) {
            // Done with reasons, go to question
            goToStep('step-question');
            initQuestion();
            return;
        }

        showReason(currentReason);
        card.classList.remove('swipe-out');
        card.classList.add('swipe-in');

        // Force reflow then remove class for transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.classList.remove('swipe-in');
            });
        });
    }, 400);
}

// ===== Step 3: The Big Question =====
let noCount = 0;
let yesBtnScale = 1;

const noMessages = [
    "Are you sure? 🥺",
    "Really?? Think again! 😢",
    "You're breaking my heart! 💔",
    "I'll cry... 😭",
    "Please reconsider! 🙏",
    "My heart can't take this! 😩",
    "NOOO don't do this! 😫",
    "I'll give you chocolate! 🍫",
    "What about puppies?? 🐶",
    "Last chance... pretty please? 🥹"
];

function initQuestion() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    yesBtn.addEventListener('click', function () {
        goToStep('step-celebration');
        startMassiveConfetti();
    });

    noBtn.addEventListener('mouseover', handleNoHover);
    noBtn.addEventListener('click', handleNoHover);
}

function handleNoHover() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const counter = document.getElementById('no-counter');

    noCount++;

    // Move the No button to a random spot
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    noBtn.style.position = 'fixed';
    noBtn.style.top = Math.random() * maxY + 'px';
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.zIndex = '10';

    // Shrink the No button
    const noScale = Math.max(0.3, 1 - noCount * 0.08);
    noBtn.style.transform = 'scale(' + noScale + ')';

    // Grow the Yes button
    yesBtnScale += 0.15;
    yesBtn.style.transform = 'scale(' + Math.min(yesBtnScale, 2.5) + ')';
    yesBtn.style.boxShadow = '0 ' + (6 + noCount * 2) + 'px ' + (25 + noCount * 3) + 'px rgba(255, 71, 87, ' + Math.min(0.5 + noCount * 0.05, 0.9) + ')';

    // Show funny message
    const msg = noMessages[Math.min(noCount - 1, noMessages.length - 1)];
    counter.textContent = msg;
    counter.classList.remove('hidden');

    // Laughing confetti burst
    spawnLaughConfetti();
}

function spawnLaughConfetti() {
    const container = document.getElementById('confetti');
    const emojis = ['😂', '🤣', '😹', '💀'];
    for (let i = 0; i < 5; i++) {
        const el = document.createElement('div');
        el.classList.add('laughing-confetti');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * window.innerWidth + 'px';
        el.style.top = Math.random() * window.innerHeight * 0.6 + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }
}

// ===== Step 4: Celebration Confetti =====
function startMassiveConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const emojis = ['❤️', '💖', '💕', '🎉', '✨', '🥰', '💗', '🩷', '🌹', '💘'];

    function burst(count, delay) {
        setTimeout(() => {
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                el.classList.add('confetti-piece');
                el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.left = Math.random() * 100 + '%';
                const duration = Math.random() * 2 + 2;
                el.style.animationDuration = duration + 's';
                el.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(el);
                setTimeout(() => el.remove(), (duration + 1) * 1000);
            }
        }, delay);
    }

    // Multiple bursts for a massive effect
    burst(50, 0);
    burst(40, 500);
    burst(30, 1200);
    burst(20, 2000);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function () {
    createFloatingHearts();
    initEnvelope();
});
