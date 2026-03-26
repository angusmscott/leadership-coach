const messagesContainer = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const newChatBtn = document.getElementById('new-chat-btn');
const modelSelect = document.getElementById('model-select');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

let conversationId = null;

// Variable definitions for info modals
const variableInfo = {
    context: {
        title: 'Context — The Surrounding System',
        body: `The relevant environment you're leading in. Context is not the immediate situation — a situation sits inside a context.\n\nContext includes four dimensions:\n• Power — how decisions really move\n• Pace — how fast things move\n• Norms — what gets rewarded, avoided, or left unsaid\n• Safety — what feels safe or unsafe to say, feel, or show\n\nContext shapes everything else in the equation. The same identity can work brilliantly in one context and quietly become a liability in another.`
    },
    i: {
        title: 'i — Leadership Identity',
        body: `The patterned way you've learned to be in order to succeed, belong, cope, or stay safe in leadership. i is the constructed self, not the whole self.\n\nThree forces shape a leader:\n• Personality (Can Do) — what comes naturally\n• i (Have To) — what was expected, reinforced, or needed\n• Spark (Love To) — what feels alive and true\n\ni develops through four stages (WPSi): Wired → Patterned → Shaped → i.\n\nThe equation is pattern-agnostic. Sarah's i was control. Yours may be people-pleasing, perfectionism, rescuing, conflict avoidance, or something else entirely.`
    },
    u: {
        title: 'U — Presence',
        body: `How your leadership is felt inwardly and expressed outwardly in real time. U has two dimensions:\n\n• Felt U — what is happening in you: emotion, body, inner state\n• Expressed U — tone, pace, posture, silence, interruption, pressure, spaciousness\n\nU is often the first doorway into awareness, because leadership is felt before it is fully understood. i is the inner game. x is the outer game. U is the bridge between them.`
    },
    x: {
        title: 'x — Impact',
        body: `How your leadership is received and what it creates — measured across two dimensions:\n\n• Results — what got done, and whether the system that produced it is resilient\n• Relationships — the relational climate created: trust, ownership, psychological safety, development\n\nx cannot be fully known from the inside. It requires feedback. The question x is always asking: what is your leadership actually creating around you?`
    },
    spark: {
        title: 'Spark — The Deeper Source',
        body: `The part of you that feels alive, meaningful, and true — sometimes called the true self.\n\nThree forces shape a leader:\n• Personality (Can Do) — what comes naturally\n• i (Have To) — what was expected or needed\n• Spark (Love To) — what feels alive, meaningful, and true\n\nSpark is often buried under i, dimmed by context, replaced by Have To — but never gone. When Spark goes quiet, leadership can still function. It just starts to feel flat.`
    }
};

// Message rendering
function addMessage(content, role, isWelcome = false) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}${isWelcome ? ' welcome' : ''}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    // Handle line breaks in content
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.trim() === '' && idx > 0) {
            bubble.appendChild(document.createElement('br'));
        } else {
            const p = document.createElement('span');
            p.textContent = line;
            bubble.appendChild(p);
            if (idx < lines.length - 1) {
                bubble.appendChild(document.createElement('br'));
            }
        }
    });

    messageEl.appendChild(bubble);
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// Chat functionality
async function sendMessage(message) {
    sendBtn.disabled = true;
    messageInput.disabled = true;

    addMessage(message, 'user');
    showTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                conversation_id: conversationId,
                model: modelSelect.value,
                welcome_message: conversationId ? undefined : welcomeText,
            }),
        });

        hideTypingIndicator();

        if (!response.ok) throw new Error('Failed to get response');

        const data = await response.json();
        conversationId = data.conversation_id;
        addMessage(data.response, 'assistant');
    } catch (error) {
        hideTypingIndicator();
        addMessage('Something went wrong. Please try again.', 'error');
        console.error('Chat error:', error);
    } finally {
        sendBtn.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

// Form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendMessage(message);
    }
});

// Auto-resize textarea
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 140) + 'px';
});

// Enter to send, Shift+Enter for new line
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Mobile sidebar toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// New chat
newChatBtn.addEventListener('click', () => {
    conversationId = null;
    messagesContainer.innerHTML = '';
    addWelcomeMessage();
});

// Variable info modals
document.querySelectorAll('.eq-var').forEach(btn => {
    btn.addEventListener('click', () => {
        const varKey = btn.dataset.var;
        const info = variableInfo[varKey];
        if (info) {
            modalTitle.textContent = info.title;
            modalBody.textContent = info.body;
            modalOverlay.classList.add('active');
        }
    });
});

// Scale level info modals
const scaleInfo = {
    reactive: {
        title: 'Level 1 — Reactive',
        body: `Inside the pattern. It runs before you notice it — like gravity, not a decision. Identity is automatic and unquestioned. Signals are faint or ignored.\n\n"I didn't realise I was doing it."\n\nMost early work with this tool is helping people move from here toward Level 2.`
    },
    reflective: {
        title: 'Level 2 — Reflective',
        body: `Can see the pattern after the fact. Recognising it with distance. The gap between action and awareness is closing but still present.\n\n"I can see what happened now."\n\nMost coaching work lives here. The pattern is visible — but usually in the rear-view mirror.`
    },
    responsive: {
        title: 'Level 3 — Responsive',
        body: `Aware in the moment. Can notice and choose in real time.\n\n"I felt the old pattern arrive — and I stayed still."\n\nThis is rare, intermittent, and worth noticing when it happens. People do not arrive at Level 3 and stay there. Awareness fluctuates.`
    }
};

document.querySelectorAll('.scale-level').forEach(btn => {
    btn.addEventListener('click', () => {
        const levelKey = btn.dataset.level;
        const info = scaleInfo[levelKey];
        if (info) {
            modalTitle.textContent = info.title;
            modalBody.textContent = info.body;
            modalOverlay.classList.add('active');
        }
    });
});

modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// Welcome message
const FALLBACK_WELCOME = `Welcome to the Your Leadership Equation companion — a reflective reading tool built around the book.

This isn't coaching, and it isn't advice. It's a space to explore how you lead — which patterns show up, what they create, and where your awareness is growing.

What's on your mind? A moment, a meeting, a pattern you've been sitting with — wherever you'd like to start.`;

let welcomeText = FALLBACK_WELCOME;

async function addWelcomeMessage() {
    try {
        const res = await fetch('/api/welcome');
        if (!res.ok) throw new Error('Failed to fetch welcome');
        const data = await res.json();
        welcomeText = data.message;
        addMessage(welcomeText, 'assistant', true);
    } catch (e) {
        addMessage(FALLBACK_WELCOME, 'assistant', true);
    }
}

addWelcomeMessage();
