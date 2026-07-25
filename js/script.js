/* =====================================
   OPERAÇÃO PMESP - V1.0 (OFFICIAL JS)
===================================== */

const FRASES = [
    "Senta a porra da bunda na cadeira e estuda, caralho!",
    "Larga essa bosta de celular e vai ler o edital, bisonho!",
    "Tá com preguiça, seu arrombado? A concorrência tá te engolindo!",
    "Para de choro e paga essa porra dessa flexão!",
    "Quer farda ou quer continuar sendo essa vergonha aí?",
    "A prova caga pro seu cansaço, seu frouxo! Estuda!",
    "Levanta essa carcaça podre e vai pagar o TAF!",
    "Sei que tá doendo, porra! Faz mais uma e para de mimimi!",
    "Sua família tá esperando tua posse ou teu fracasso, caralho?",
    "Acha bonito ser um bosta sem futuro? Reage, porra!",
    "Caiu na questão? Burro! Anota e aprende essa bosta!",
    "Vai tomar no cu e vai estudar! O edital não espera!",
    "Para de dar desculpa de corno e bate a meta diária!",
    "O conforto é pra fraco! Aqui é faca na caveira, porra!",
    "Tá cansado? Danisse! Cansado e desempregado é pior!",
    "Sua preguiça é uma vergonha! Toma vergonha nessa cara!",
    "Quer moleza, seu frouxo? Vai mastigar água então!",
    "Mais um dia sendo medíocre? Muda essa merda hoje!",
    "Engole o choro, caralho! A rua não tem dó de bisonho!",
    "Tá olhando pro teto por quê? Abre a porra do livro!",
    "A concorrência comemora cada minuto que você caga pro estudo!",
    "Bate essa meta de hoje ou nem encosta na cama, porra!",
    "Mente fraca do caralho! Reage e faz acontecer!",
    "Vai esperar reprovar pra tomar tenência nessa vida?",
    "Ninguém vai te salvar, seu bosta! Faz o seu!",
    "Treina nessa porra pra não passar vergonha no TAF!",
    "Mantenha essa boca fechada e estuda em silêncio, caralho!",
    "Zero desculpas hoje! Executa a missão, seu bisonho!",
    "Você é fraco ou é polícia? Provoca essa porra hoje!",
    "Cada hora perdida é um tiro no teu próprio pé!",
    "Último dia do mês! Olhe no espelho e veja o bosta que foi ou o polícia que vai ser!"
];
  

document.addEventListener("DOMContentLoaded", () => {
    iniciarApp();
});

function iniciarApp() {
    esconderSplash();
    carregarFrase();
    configurarCards();
    verificarNovoDia();
    configurarCheckboxes();
    configurarCampos();
    configurarEstudo();
    configurarNavegacaoTabs();
    atualizarPainel();
}

function esconderSplash() {
    setTimeout(() => {
        const splash = document.getElementById("splash");
        if (splash) splash.style.display = "none";
    }, 2000);
}

function carregarFrase() {
    const quoteEl = document.getElementById("quote");
    if (quoteEl) {
        const fraseRandom = FRASES[Math.floor(Math.random() * FRASES.length)];
        quoteEl.innerText = fraseRandom;
    }
}

function configurarCards() {
    const headers = document.querySelectorAll(".mission-header");
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const card = header.closest(".mission-card");
            card.classList.toggle("open");
        });
    });
}

function verificarNovoDia() {
    const hoje = new Date().toLocaleDateString("pt-BR");
    const ultimoAcesso = localStorage.getItem("pmesp_data");

    if (!ultimoAcesso) {
        localStorage.setItem("pmesp_data", hoje);
        localStorage.setItem("pmesp_dia", "1");
    } else if (ultimoAcesso !== hoje) {
        let diaAtual = parseInt(localStorage.getItem("pmesp_dia") || "1", 10);
        diaAtual += 1;
        localStorage.setItem("pmesp_dia", diaAtual.toString());
        localStorage.setItem("pmesp_data", hoje);

        // Reseta as tarefas diárias no novo dia
        resetarDia();
    }

    const diaCounter = document.getElementById("dayCounter");
    if (diaCounter) {
        const dia = localStorage.getItem("pmesp_dia") || "1";
        diaCounter.innerText = `DIA ${dia.padStart(3, "0")}`;
    }
}

function resetarDia() {
    const checkboxes = document.querySelectorAll(".task");
    checkboxes.forEach(cb => {
        cb.checked = false;
    });

    const inputsHoras = document.querySelectorAll("#tab-study input");
    inputsHoras.forEach(inp => inp.value = "");

    const obs = document.getElementById("observacoes");
    if (obs) obs.value = "";

    localStorage.setItem("pmesp_tasks", JSON.stringify([]));
    localStorage.setItem("pmesp_horas", "0");
    localStorage.setItem("pmesp_questoes", "0");
}

function configurarCheckboxes() {
    const checkboxes = document.querySelectorAll(".task");
    const salvas = JSON.parse(localStorage.getItem("pmesp_tasks") || "[]");

    checkboxes.forEach((cb, index) => {
        if (salvas.includes(index)) {
            cb.checked = true;
        }

        cb.addEventListener("change", () => {
            salvarCheckboxes();
            atualizarProgresso();
            atualizarPainel();
        });
    });

    atualizarProgresso();
}

function salvarCheckboxes() {
    const checkboxes = document.querySelectorAll(".task");
    const marcadas = [];

    checkboxes.forEach((cb, index) => {
        if (cb.checked) {
            marcadas.push(index);
        }
    });

    localStorage.setItem("pmesp_tasks", JSON.stringify(marcadas));
}

function atualizarProgresso() {
    const checkboxes = document.querySelectorAll(".task");
    const total = checkboxes.length;
    let marcadas = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) marcadas++;
    });

    const porcentagem = total > 0 ? Math.round((marcadas / total) * 100) : 0;

    const fill = document.getElementById("progressFill");
    const text = document.getElementById("progressText");

    if (fill) fill.style.width = `${porcentagem}%`;
    if (text) text.innerText = `${porcentagem}%`;
}

function configurarCampos() {
    const inputs = document.querySelectorAll("#tab-study input, #tab-study textarea");
    inputs.forEach(input => {
        const valorSalvo = localStorage.getItem(`pmesp_input_${input.id}`);
        if (valorSalvo) input.value = valorSalvo;

        input.addEventListener("input", () => {
            localStorage.setItem(`pmesp_input_${input.id}`, input.value);
            calcularTotalEstudos();
        });
    });
}

function configurarEstudo() {
    const btnSalvar = document.getElementById("salvarEstudo");
    if (btnSalvar) {
        btnSalvar.addEventListener("click", () => {
            calcularTotalEstudos();
            atualizarPainel();
            alert("Progresso salvo com sucesso!");
        });
    }
    calcularTotalEstudos();
}

function calcularTotalEstudos() {
    const idsHoras = ["portugues", "matematica", "informatica", "constitucional", "legislacao"];
    let totalHoras = 0;

    idsHoras.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.value) {
            totalHoras += parseFloat(input.value) || 0;
        }
    });

    const totalEl = document.getElementById("totalHoras");
    if (totalEl) totalEl.innerText = `${totalHoras.toFixed(1)} horas`;

    const questoesInput = document.getElementById("questoes");
    const totalQuestoes = questoesInput ? (parseInt(questoesInput.value, 10) || 0) : 0;

    localStorage.setItem("pmesp_horas", totalHoras.toString());
    localStorage.setItem("pmesp_questoes", totalQuestoes.toString());
}

function configurarNavegacaoTabs() {
    const botoes = document.querySelectorAll(".nav-btn");
    const abas = document.querySelectorAll(".tab-content");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const tabAlvoId = botao.getAttribute("data-tab");

            botoes.forEach(b => b.classList.remove("active"));
            abas.forEach(a => a.classList.remove("active"));

            botao.classList.add("active");
            const abaAlvo = document.getElementById(tabAlvoId);
            if (abaAlvo) {
                abaAlvo.classList.add("active");
            }
        });
    });
}

function atualizarPainel() {
    const checkboxes = document.querySelectorAll(".task");
    let marcadas = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) marcadas++;
    });

    const missionsDone = document.getElementById("missionsDone");
    if (missionsDone) missionsDone.innerText = `${marcadas}/${checkboxes.length}`;

    const horas = parseFloat(localStorage.getItem("pmesp_horas") || "0");
    const questoes = parseInt(localStorage.getItem("pmesp_questoes") || "0", 10);

    const studyHours = document.getElementById("studyHours");
    if (studyHours) studyHours.innerText = `${horas.toFixed(1)}h`;

    const questionsDone = document.getElementById("questionsDone");
    if (questionsDone) questionsDone.innerText = `${questoes}`;

    // Cálculo de XP: 100 XP por missão + 50 XP por hora + 2 XP por questão
    const xpTotalCalculado = (marcadas * 100) + Math.round(horas * 50) + (questoes * 2);

    const xpTotal = document.getElementById("xpTotal");
    const xpValue = document.getElementById("xpValue");

    if (xpTotal) xpTotal.innerText = `${xpTotalCalculado}`;
    if (xpValue) xpValue.innerText = `${xpTotalCalculado}`;

    atualizarPatente(xpTotalCalculado);
}

function atualizarPatente(xp) {
    const rankEl = document.getElementById("userRank");
    const rankDesc = document.getElementById("rankDesc");

    if (!rankEl || !rankDesc) return;

    if (xp >= 3000) {
        rankEl.innerText = "Capitão";
        rankDesc.innerText = "Sua disciplina é impecável. A aprovação é certa.";
    } else if (xp >= 1500) {
        rankEl.innerText = "Tenente";
        rankDesc.innerText = "Excelente ritmo de preparação. Mantenha o foco!";
    } else if (xp >= 500) {
        rankEl.innerText = "Sargento";
        rankDesc.innerText = "Evolução constante. O topo está próximo.";
    } else if (xp >= 200) {
        rankEl.innerText = "Soldado Engajado";
        rankDesc.innerText = "Bom começo! A consistência traz a farda.";
    } else {
        rankEl.innerText = "Recruta";
        rankDesc.innerText = "Acumule XP para subir de patente na corporação.";
    }
}