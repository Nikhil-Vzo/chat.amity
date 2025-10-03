const socket = io();
scrollBottom();
});


socket.on('system', (txt) => {
const el = document.createElement('li');
el.className = 'system';
el.textContent = txt;
messagesEl.appendChild(el);
scrollBottom();
});


socket.on('message', (m) => {
renderMessage(m);
scrollBottom();
});


form.addEventListener('submit', (e) => {
e.preventDefault();
const txt = input.value.trim();
if (!txt) return;


// set nick if first time
if (!meNick) {
meNick = nickInput.value.trim().slice(0,24) || 'Anon';
socket.emit('join', meNick);
}


socket.emit('message', txt);
input.value = '';
});


function renderMessage(m) {
const li = document.createElement('li');
const isMe = m.nick === meNick;
li.className = isMe ? 'me' : (m.nick ? 'other' : 'system');
const time = new Date(m.t).toLocaleTimeString();
if (m.nick) {
li.innerHTML = `<strong>${escapeHtml(m.nick)}</strong> <span class="time">${time}</span><div>${escapeHtml(m.text)}</div>`;
} else {
li.textContent = m.text;
}
messagesEl.appendChild(li);
}


function scrollBottom(){ messagesEl.scrollTop = messagesEl.scrollHeight; }


function escapeHtml(s){ return String(s)
.replace(/&/g,'&amp;')
.replace(/</g,'&lt;')
.replace(/>/g,'&gt;')
.replace(/"/g,'&quot;')
.replace(/'/g,'&#039;'); }


// Prevent Enter from refreshing page anywhere
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
    e.preventDefault();
    // Optionally, trigger your send message if focus is on message input
    if (document.activeElement === input) {
      form.dispatchEvent(new Event('submit', {cancelable: true}));
    }
  }
});

