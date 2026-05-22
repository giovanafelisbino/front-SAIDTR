// Carrega o menu lateral uma vez e guarda na página
async function loadMenu() {
    const res = await fetch('menu.html');
    const html = await res.text();
    const app = document.getElementById('app');
    app.innerHTML = `<div class="app-shell">${html}<main class="main-content" id="main-content"></main></div>`;
    attachMenuEvents();
    loadPage('chat'); // página inicial
}

function attachMenuEvents() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) loadPage(page);
            // atualiza classe active no menu
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

async function loadPage(pageName) {
    const mainContainer = document.getElementById('main-content');
    let htmlFile = '';
    switch (pageName) {
        case 'chat': htmlFile = 'chat-main.html'; break;
        case 'profile': htmlFile = 'profile-main.html'; break;
        case 'problems': htmlFile = 'problems-main.html'; break;
        default: return;
    }
    const res = await fetch(htmlFile);
    const html = await res.text();
    mainContainer.innerHTML = html;

    // Se for a página de chat, ativa os eventos do chat
    if (pageName === 'chat') initChat();
    if (pageName === 'profile') initPerfil();
    if (pageName === 'problems  ') initRelatar();
}

// --- Funções específicas de cada página (mesma lógica do seu código anterior) ---
function initChat() {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        const labelSpan = document.createElement('span');
        labelSpan.classList.add('message-label');
        labelSpan.innerText = sender === 'bot' ? 'TRANSFORBOT' : 'VOCÊ';
        const textSpan = document.createElement('span');
        textSpan.innerText = text;
        messageDiv.appendChild(labelSpan);
        messageDiv.appendChild(textSpan);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText) return;
        addMessage(messageText, 'user');
        userInput.value = '';
        setTimeout(() => {
            addMessage(`Você disse: "${messageText}". Como posso ajudar mais?`, 'bot');
        }, 500);
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

function initPerfil() {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const salvarBtn = document.getElementById('salvar-perfil');
    const feedback = document.getElementById('profile-feedback');

    if (localStorage.getItem('user_nome')) nomeInput.value = localStorage.getItem('user_nome');
    if (localStorage.getItem('user_email')) emailInput.value = localStorage.getItem('user_email');
    if (localStorage.getItem('user_telefone')) telefoneInput.value = localStorage.getItem('user_telefone');

    salvarBtn.addEventListener('click', () => {
        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        if (!nome || !email) {
            feedback.innerText = 'Preencha nome e e-mail.';
            return;
        }
        localStorage.setItem('user_nome', nome);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_telefone', telefoneInput.value.trim());
        feedback.innerText = '✅ Perfil salvo!';
        setTimeout(() => feedback.innerText = '', 2000);
    });
}

function initRelatar() {
    const assunto = document.getElementById('assunto');
    const descricao = document.getElementById('descricao');
    const enviar = document.getElementById('enviar-relato');
    const feedback = document.getElementById('report-feedback');

    enviar.addEventListener('click', () => {
        if (!assunto.value.trim() || !descricao.value.trim()) {
            feedback.innerText = 'Preencha todos os campos.';
            return;
        }
        console.log('Relato enviado:', { assunto: assunto.value, descricao: descricao.value });
        feedback.innerText = 'Relato enviado com sucesso!';
        assunto.value = '';
        descricao.value = '';
        setTimeout(() => feedback.innerText = '', 2000);
    });
}

// Inicia tudo
loadMenu();