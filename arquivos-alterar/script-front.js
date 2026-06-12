const PAGE_STYLES = {
  chat: "../chat/chat-style.css",
  profile: "profile-style.css",
  problems: "problems-style.css",
};
let currentStyleLink = null;

function injectPageStyle(pageName) {
  if (currentStyleLink) {
    currentStyleLink.remove();
    currentStyleLink = null;
  }
  const cssFile = PAGE_STYLES[pageName];
  if (!cssFile) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssFile;
  document.head.appendChild(link);
  currentStyleLink = link;
}

// ── Monta o shell: header já está no index.html ──
async function loadMenu() {
  try {
    const res = await fetch("menu.html");
    if (!res.ok) throw new Error(`menu.html não encontrado: ${res.status}`);
    const html = await res.text();

    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="app-shell">
                ${html}
                <main class="main-content" id="main-content"></main>
            </div>
        `;

    attachMenuEvents();

    // Carrega a página inicial (chat) automaticamente
    loadPage("chat");
    const firstItem = document.querySelector('[data-page="chat"]');
    if (firstItem) firstItem.classList.add("active");
  } catch (err) {
    console.error("Erro ao carregar menu:", err);
    // Fallback: monta o menu inline sem fetch
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="app-shell">
                <aside class="side-menu">
                    <nav>
                        <div class="menu-items">
                            <a href="#" class="menu-item active" data-page="chat">
                                <i class="bi bi-chat-dots"></i>
                                <span>Abertura de demanda</span>
                            </a>
                            <a href="#" class="menu-item" data-page="profile">
                                <i class="bi bi-person"></i>
                                <span>Perfil</span>
                            </a>
                        </div>
                    </nav>
                    <div class="problems-area">
                        <a href="#" class="menu-item" data-page="problems">
                            <i class="bi bi-exclamation-triangle"></i>
                            <span>Relatar problema</span>
                        </a>
                    </div>
                </aside>
                <main class="main-content" id="main-content"></main>
            </div>
        `;
    attachMenuEvents();
    loadPage("chat");
  }
}

function attachMenuEvents() {
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const page = item.getAttribute("data-page");
      if (!page) return;
      document
        .querySelectorAll(".menu-item")
        .forEach((m) => m.classList.remove("active"));
      item.classList.add("active");
      loadPage(page);
    });
  });
}

async function loadPage(pageName) {
  const mainContainer = document.getElementById("main-content");
  const pageFiles = {
    chat: "../chat/chat-main.html",
    profile: "profile-main.html",
    problems: "problems-main.html",
  };
  const htmlFile = pageFiles[pageName];
  if (!htmlFile) return;

  injectPageStyle(pageName);

  try {
    const res = await fetch(htmlFile);
    if (!res.ok) throw new Error(`${htmlFile} não encontrado: ${res.status}`);
    const html = await res.text();
    mainContainer.innerHTML = html;
  } catch (err) {
    console.error("Erro ao carregar página:", err);
    mainContainer.innerHTML = `<p style="padding:20px;color:#999;">Página não encontrada: ${htmlFile}</p>`;
    return;
  }

  if (pageName === "chat") initChat();
  if (pageName === "profile") initPerfil();
  if (pageName === "problems") initRelatar();
}
function initPerfil() {
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const telefoneInput = document.getElementById("telefone");
  const salvarBtn = document.getElementById("salvar-perfil");
  const feedback = document.getElementById("profile-feedback");

  if (localStorage.getItem("user_nome"))
    nomeInput.value = localStorage.getItem("user_nome");
  if (localStorage.getItem("user_email"))
    emailInput.value = localStorage.getItem("user_email");
  if (localStorage.getItem("user_telefone"))
    telefoneInput.value = localStorage.getItem("user_telefone");

  salvarBtn.addEventListener("click", () => {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    if (!nome || !email) {
      feedback.innerText = "Preencha nome e e-mail.";
      return;
    }
    localStorage.setItem("user_nome", nome);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_telefone", telefoneInput.value.trim());
    feedback.innerText = "Perfil salvo!";
    setTimeout(() => (feedback.innerText = ""), 2000);
  });
}

// ── Relatar problema ──
function initRelatar() {
  const assunto = document.getElementById("assunto");
  const descricao = document.getElementById("descricao");
  const enviar = document.getElementById("enviar-relato");
  const feedback = document.getElementById("report-feedback");

  enviar.addEventListener("click", () => {
    if (!assunto.value.trim() || !descricao.value.trim()) {
      feedback.innerText = "Preencha todos os campos.";
      return;
    }
    console.log("Relato:", {
      assunto: assunto.value,
      descricao: descricao.value,
    });
    feedback.innerText = "Relato enviado com sucesso!";
    assunto.value = "";
    descricao.value = "";
    setTimeout(() => (feedback.innerText = ""), 2000);
  });
}
// Inicia
loadMenu();
