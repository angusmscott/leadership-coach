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
        body: `Complexity, uncertainty, structure, expectations, history, incentives, culture. Context does not excuse leadership — but it does shape what is triggered, rewarded, or required.\n\nThe same identity can work brilliantly in one context and quietly become a liability in another.\n\nEvery context carries power (where influence sits), pace (how decisions get made), and norms (what counts as "good leadership," spoken or not).`
    },
    i: {
        title: 'i — Leadership Identity',
        body: `The internal map you lead from. Your beliefs, patterns, assumptions, and protective strategies — the shaped self at work.\n\nThe part of you that says, often silently: "this is who I need to be to succeed, belong, stay safe, or matter here."\n\nIdentity forms at the intersection of internal wiring, external reinforcement, and repeated experience inside a context.`
    },
    u: {
        title: 'U — Presence',
        body: `The expression of identity. U is what your internal world looks like as behaviour, tone, pace, energy, and attention.\n\nIt is the bridge between your inner experience and everyone else's experience of you.\n\nPresence moves before awareness — when identity is activated, it shows up in the body first: tightness, urgency, narrowing of attention.`
    },
    x: {
        title: 'x — Impact',
        body: `What your leadership creates in others and in the work. Not just what gets done — but what it feels like to work around you while it gets done.\n\nThe quality of decisions, trust, ownership, energy, and culture that forms in your wake.\n\nImpact includes relationships and results — together.`
    },
    spark: {
        title: 'Spark — The Deeper Source',
        body: `The part of you that gives leadership meaning — purpose, values, conviction, care.\n\nSpark is what you want to contribute, build, and serve in a way that feels deeply true. It is what gives you something more powerful than habit to lead from.\n\nSpark is not happiness. It's the inner signal of meaning, aliveness, care, and direction.`
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

modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// Welcome message
function addWelcomeMessage() {
    const welcome = `Welcome to the Leadership Equation companion — a space to reflect on your leadership in the moments that matter.

This isn't coaching, and it isn't advice. It's a place to notice — what's happening in your leadership, which patterns are showing up, and where your awareness is growing.

What's on your mind? A recent moment, a meeting, a pattern you've been noticing — wherever you'd like to start.`;

    addMessage(welcome, 'assistant', true);
}

addWelcomeMessage();
