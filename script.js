// ===== Background Music (Toosii - Favorite Song) =====
let musicPlaying = false;
let audio = null;

function initMusic() {
    // We'll use an Audio element - user needs to add the mp3 file
    audio = new Audio('assets/favorite-song.mp3');
    audio.loop = true;
    audio.volume = 0.4;

    const btn = document.getElementById('music-toggle');
    btn.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    const btn = document.getElementById('music-toggle');
    if (!audio) return;

    if (musicPlaying) {
        audio.pause();
        btn.textContent = '🔇';
        btn.classList.remove('playing');
        musicPlaying = false;
    } else {
        audio.play().catch(() => {});
        btn.textContent = '🎵';
        btn.classList.add('playing');
        musicPlaying = true;
    }
}

function startMusicOnInteraction() {
    if (!musicPlaying && audio) {
        audio.play().then(() => {
            musicPlaying = true;
            const btn = document.getElementById('music-toggle');
            btn.textContent = '🎵';
            btn.classList.add('playing');
        }).catch(() => {});
    }
}

// ===== Countdown to Valentine's Day =====
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    const valentinesDay = new Date('2026-02-14T00:00:00');

    function update() {
        const now = new Date();
        const diff = valentinesDay - now;

        if (diff <= 0) {
            countdownEl.innerHTML = '<span class="countdown-label">It\'s Valentine\'s Day! 💕</span>';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.innerHTML =
            '<span class="countdown-label">Valentine\'s Day in</span>' +
            '<div class="countdown-timer">' +
                '<div class="countdown-block"><span class="countdown-num">' + days + '</span><span class="countdown-unit">days</span></div>' +
                '<div class="countdown-block"><span class="countdown-num">' + hours + '</span><span class="countdown-unit">hrs</span></div>' +
                '<div class="countdown-block"><span class="countdown-num">' + minutes + '</span><span class="countdown-unit">min</span></div>' +
                '<div class="countdown-block"><span class="countdown-num">' + seconds + '</span><span class="countdown-unit">sec</span></div>' +
            '</div>';
    }

    update();
    setInterval(update, 1000);
}

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

    setInterval(spawnHeart, 800);
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
        startMusicOnInteraction();
        this.classList.add('opened');
        setTimeout(() => {
            goToStep('step-reasons');
            initReasons();
        }, 800);
    });
}

// ===== Step 2: Reasons Slideshow with Typing Effect =====
const reasons = [
    "Hode, your smile lights up my entire day — even the worst ones become beautiful because of you.",
    "Nayo, the way you laugh at my terrible jokes makes me feel like I'm the funniest person alive.",
    "Fikre, you always know exactly what to say when I need it most. You're my peace.",
    "Every moment with you, Nahomie, feels like an adventure I never want to end.",
    "You make me want to be a better man, Hode. Just by being you.",
    "I thank God every day for putting you in my life, Nayo. You're my blessing. 🙏"
];

let currentReason = 0;
let typingTimer = null;

function initReasons() {
    const dotsContainer = document.getElementById('reason-dots');
    dotsContainer.innerHTML = '';
    reasons.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('reason-dot');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    typeReason(0);

    document.getElementById('btn-next-reason').addEventListener('click', nextReason);
}

function typeReason(index) {
    const numberEl = document.getElementById('reason-number');
    const textEl = document.getElementById('reason-text');
    const cursor = document.getElementById('typing-cursor');
    const nextBtn = document.getElementById('btn-next-reason');

    numberEl.textContent = '#' + (index + 1);
    textEl.textContent = '';
    cursor.classList.add('blinking');
    nextBtn.classList.add('hidden');

    // Update dots
    document.querySelectorAll('.reason-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    const text = reasons[index];
    let charIndex = 0;

    if (typingTimer) clearInterval(typingTimer);

    typingTimer = setInterval(() => {
        if (charIndex < text.length) {
            textEl.textContent += text[charIndex];
            charIndex++;
        } else {
            clearInterval(typingTimer);
            cursor.classList.remove('blinking');
            cursor.style.display = 'none';
            nextBtn.classList.remove('hidden');
            nextBtn.style.animation = 'fadeInUp 0.4s ease';
        }
    }, 35);
}

function nextReason() {
    const card = document.getElementById('reason-card');
    const cursor = document.getElementById('typing-cursor');

    card.classList.add('swipe-out');

    setTimeout(() => {
        currentReason++;

        if (currentReason >= reasons.length) {
            goToStep('step-question');
            initQuestion();
            return;
        }

        cursor.style.display = 'inline';
        card.classList.remove('swipe-out');
        card.classList.add('swipe-in');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.classList.remove('swipe-in');
                typeReason(currentReason);
            });
        });
    }, 400);
}

// ===== Step 3: The Big Question =====
let noCount = 0;
let yesBtnScale = 1;

const noMessages = [
    "Are you sure, Hode? 🥺",
    "Really, Nayo?? Think again! 😢",
    "You're breaking my heart, Fikre! 💔",
    "I'll cry, Nahomie... 😭",
    "Please reconsider, Hode! 🙏",
    "My heart can't take this, Nayo! 😩",
    "NOOO Fikre, don't do this! 😫",
    "I'll give you chocolate, Hode! 🍫",
    "What about puppies, Nayo?? 🐶",
    "Last chance... pretty please, Fikre? 🥹"
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

    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    noBtn.style.position = 'fixed';
    noBtn.style.top = Math.random() * maxY + 'px';
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.zIndex = '10';

    const noScale = Math.max(0.3, 1 - noCount * 0.08);
    noBtn.style.transform = 'scale(' + noScale + ')';

    yesBtnScale += 0.15;
    yesBtn.style.transform = 'scale(' + Math.min(yesBtnScale, 2.5) + ')';
    yesBtn.style.boxShadow = '0 ' + (6 + noCount * 2) + 'px ' + (25 + noCount * 3) + 'px rgba(255, 71, 87, ' + Math.min(0.5 + noCount * 0.05, 0.9) + ')';

    const msg = noMessages[Math.min(noCount - 1, noMessages.length - 1)];
    counter.textContent = msg;
    counter.classList.remove('hidden');

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

    burst(50, 0);
    burst(40, 500);
    burst(30, 1200);
    burst(20, 2000);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function () {
    createFloatingHearts();
    initEnvelope();
    initCountdown();
    initMusic();
});
