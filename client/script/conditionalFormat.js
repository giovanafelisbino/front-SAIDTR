/*
  FORMATAÇÃO CONDICIONAL DAS BUBBLES (.priority e .step)
  =======================================================

  Como adicionar uma PRIORIDADE nova:
    1. Vá até o objeto PRIORITY_STYLES abaixo.
    2. Adicione uma chave com o texto em MAIÚSCULO e SEM ACENTO
       (o script normaliza automaticamente, então "Média", "média",
       " Média " tudo cai na chave "MEDIA").
    3. Defina bg (fundo), border (borda) e color (texto).

  Como adicionar uma ETAPA nova:
    1. Vá até o objeto STEP_STYLES abaixo.
    2. Mesma lógica: chave em MAIÚSCULO/SEM ACENTO, com bg/border/color.

  Não precisa mexer no HTML nem no CSS pra isso — só neste arquivo.
*/

const PRIORITY_STYLES = {
    "URGENTE": { bg: "#ffd2d2", border: "#ff4d4d", color: "#7a0000" },
    "ALTA":    { bg: "#ffe1c2", border: "#ff9a3c", color: "#7a3d00" },
    "MEDIA":   { bg: "#fef251", border: "#fef251", color: "#784600" },
    "BAIXA":   { bg: "#d7f5df", border: "#5ec97b", color: "#0b5c26" },
};

const STEP_STYLES = {
    "ARQUITETURA DE SOLUCOES":  { bg: "#a1dff9", border: "#a1dff9", color: "#240078" },
    "APROVACAO DE ORCAMENTO":   { bg: "#d8c2ff", border: "#d8c2ff", color: "#3d0078" },

    // Vá adicionando as próximas etapas aqui, seguindo o mesmo padrão:
    // "NOME DA ETAPA EM MAIUSCULO SEM ACENTO": { bg: "#hex", border: "#hex", color: "#hex" },
};

// Estilo aplicado quando o texto não é encontrado em nenhum dos objetos acima
// (evita bubble "quebrada"/sem cor caso alguém digite um texto novo antes
// de você cadastrar o estilo dele aqui).
const FALLBACK_STYLE = { bg: "#e0e0e0", border: "#e0e0e0", color: "#4a4a4a" };

function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .trim()
        .toUpperCase();
}

function applyBubbleStyle(element, style) {
    element.style.backgroundColor = style.bg;
    element.style.borderColor = style.border;
    element.style.color = style.color;
}

function formatBubbles(selector, stylesMap, labelForLog) {
    document.querySelectorAll(selector).forEach((el) => {
        const rawText = el.textContent;
        const key = normalizeText(rawText);
        const style = stylesMap[key];

        if (style) {
            applyBubbleStyle(el, style);
        } else {
            applyBubbleStyle(el, FALLBACK_STYLE);
            console.warn(
                `[Formatação condicional] ${labelForLog} não cadastrado(a): "${rawText.trim()}". ` +
                `Adicione essa chave em conditional-formatting.js.`
            );
        }
    });
}

function applyAllConditionalFormatting() {
    formatBubbles(".priority", PRIORITY_STYLES, "Prioridade");
    formatBubbles(".step", STEP_STYLES, "Etapa");
}

// Roda quando a página carrega
document.addEventListener("DOMContentLoaded", applyAllConditionalFormatting);

// Se as demandas forem carregadas dinamicamente depois (ex: via fetch/API),
// basta chamar applyAllConditionalFormatting() de novo após inserir o novo
// HTML no DOM.

