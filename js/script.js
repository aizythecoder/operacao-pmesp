/*==================================================
 OPERAÇÃO PMESP - VERSÃO 1.0 (DESBUGADO)
==================================================*/

document.addEventListener("DOMContentLoaded", iniciarApp);

function iniciarApp(){
    esconderSplash();
    carregarFrase();
    configurarCards();
    verificarNovoDia();
    configurarCheckboxes();
    configurarCampos();
    configurarEstudo();
    atualizarPainel();
}

/*==================================================
 SPLASH
==================================================*/
function esconderSplash(){
    const splash = document.getElementById("splash");
    if(!splash) return;
    setTimeout(() => {
        splash.style.display = "none";
    }, 2000);
}

/*==================================================
 FRASES MOTIVACIONAIS
==================================================*/
const frases = [
    "O conforto é o inimigo da aprovação.",
    "Enquanto você descansa alguém resolve mais 100 questões.",
    "Dor é temporária. A farda é permanente.",
    "Você pediu uma vida diferente. Trabalhe por ela.",
    "Disciplina vence talento.",
    "Sem desculpas.",
    "Hoje é obrigatório evoluir.",
    "Seu concorrente estudou enquanto você pensava em desistir.",
    "Não negocie com a preguiça.",
    "Você só perde quando para."
];

function carregarFrase(){
    const quote = document.getElementById("quote");
    if(!quote) return;
    const dia = new Date().getDate();
    quote.textContent = frases[dia % frases.length];
}

/*==================================================
 ABRIR E FECHAR CARD DE MISSÕES
==================================================*/
function configurarCards(){
    const cards = document.querySelectorAll(".mission-card");
    cards.forEach(card => {
        const botao = card.querySelector(".mission-header");
        if(botao){
            botao.addEventListener("click", () => {
                card.classList.toggle("open");
            });
        }
    });
}

/*==================================================
 SISTEMA DE DIAS E RESET DIÁRIO
==================================================*/
const DATA_KEY = "operacao-pmesp-data";
const DIA_INICIO_KEY = "operacao-pmesp-dia-inicio";

function dataHoje(){
    return new Date().toISOString().split("T")[0];
}

function verificarNovoDia(){
    const ultimaData = localStorage.getItem(DATA_KEY);
    const hoje = dataHoje();

    // Se é a primeira vez rodando o app
    if(!localStorage.getItem(DIA_INICIO_KEY)){
        localStorage.setItem(DIA_INICIO_KEY, hoje);
    }

    if(!ultimaData){
        localStorage.setItem(DATA_KEY, hoje);
    } else if(ultimaData !== hoje){
        localStorage.setItem(DATA_KEY, hoje);
        resetarDia(); // Reseta os checkboxes para o novo dia
    }

    atualizarContadorDias();
}

function atualizarContadorDias(){
    const inicioStr = localStorage.getItem(DIA_INICIO_KEY) || dataHoje();
    const inicio = new Date(inicioStr);
    const hoje = new Date(dataHoje());

    const diferenca = hoje - inicio;
    const dias = Math.floor(diferenca / 86400000) + 1; // 1 dia em ms = 86400000

    const contador = document.getElementById("dayCounter");
    if(contador){
        contador.textContent = "DIA " + String(dias).padStart(3, "0");
    }
}

function resetarDia(){
    document.querySelectorAll(".task").forEach(check => {
        check.checked = false;
    });
    salvar();
    atualizarPainel();
}

/*==================================================
 LOCAL STORAGE (SALVAR E CARREGAR ESTADOS)
==================================================*/
function salvar(){
    const dados = {
        checks: {},
        inputs: {}
    };

    document.querySelectorAll(".task").forEach((check, index) => {
        dados.checks[index] = check.checked;
    });

    document.querySelectorAll("input[type='time'], input[type='number'], input[type='text'], textarea").forEach((campo, index) => {
        dados.inputs[index] = campo.value;
    });

    localStorage.setItem("operacao-pmesp", JSON.stringify(dados));
}

function carregar(){
    const dados = JSON.parse(localStorage.getItem("operacao-pmesp"));
    if(!dados) return;

    document.querySelectorAll(".task").forEach((check, index) => {
        if(dados.checks[index] !== undefined){
            check.checked = dados.checks[index];
        }
    });

    document.querySelectorAll("input[type='time'], input[type='number'], input[type='text'], textarea").forEach((campo, index) => {
        if(dados.inputs[index] !== undefined){
            campo.value = dados.inputs[index];
        }
    });
}

/*==================================================
 CONFIGURAÇÃO DE LISTENERS (CHECKBOXES E INPUTS)
==================================================*/
function configurarCheckboxes(){
    carregar();
    document.querySelectorAll(".task").forEach(check => {
        check.addEventListener("change", () => {
            salvar();
            atualizarPainel();
            verificarConclusao();
        });
    });
}

function configurarCampos(){
    carregar();
    document.querySelectorAll("input[type='time'], input[type='number'], input[type='text'], textarea").forEach(campo => {
        campo.addEventListener("input", () => {
            salvar();
            atualizarPainel();
        });
    });
}

/*==================================================
 ESTUDOS DA MANHÃ
==================================================*/
const materias = [
    "portugues",
    "matematica",
    "informatica",
    "constitucional",
    "legislacao"
];

function configurarEstudo(){
    materias.forEach(id => {
        const campo = document.getElementById(id);
        if(campo){
            campo.addEventListener("input", () => {
                atualizarHoras();
                atualizarPainel();
            });
        }
    });

    const botao = document.getElementById("salvarEstudo");
    if(botao){
        botao.addEventListener("click", () => {
            salvar();
            alert("Progresso de estudo salvo com sucesso!");
        });
    }
}

function calcularHoras(){
    let total = 0;
    materias.forEach(id => {
        const valor = Number(document.getElementById(id)?.value || 0);
        total += valor;
    });
    return total;
}

function atualizarHoras(){
    const total = calcularHoras();
    const totalHoras = document.getElementById("totalHoras");
    if(totalHoras){
        totalHoras.textContent = total.toFixed(1) + " horas";
    }
}

/*==================================================
 PAINEL PRINCIPAL & ATUALIZAÇÃO DE MÉTRICAS / XP
==================================================*/
function atualizarPainel(){
    const checks = document.querySelectorAll(".task");
    const feitas = document.querySelectorAll(".task:checked").length;
    const totalChecks = checks.length;

    // 1. Atualizar Barra de Progresso
    const porcentagem = totalChecks > 0 ? Math.round((feitas / totalChecks) * 100) : 0;
    const barraFill = document.getElementById("progressFill");
    if(barraFill){
        barraFill.style.width = porcentagem + "%";
    }

    const textoProgresso = document.getElementById("progressText");
    if(textoProgresso){
        textoProgresso.textContent = porcentagem + "%";
    }

    // 2. Atualizar Relatório
    const campoMissoes = document.getElementById("missionsDone");
    if(campoMissoes){
        campoMissoes.textContent = `${feitas}/${totalChecks}`;
    }

    const horasTotais = calcularHoras();
    const campoHoras = document.getElementById("studyHours");
    if(campoHoras){
        campoHoras.textContent = horasTotais.toFixed(1) + "h";
    }

    const campoQuestoesVal = document.getElementById("questoes")?.value || 0;
    const campoQuestoes = document.getElementById("questionsDone");
    if(campoQuestoes){
        campoQuestoes.textContent = campoQuestoesVal;
    }

    // 3. Cálculo Unificado de XP
    let xpCalculado = 0;
    xpCalculado += feitas * 10; // 10 XP por missão
    xpCalculado += Math.floor(horasTotais * 25); // 25 XP por hora de estudo
    xpCalculado += Math.floor(Number(campoQuestoesVal) / 10) * 5; // 5 XP a cada 10 questões

    // 4. Exibir XP no Topo e no Relatório
    const xpTopo = document.getElementById("xpValue");
    if(xpTopo){
        xpTopo.textContent = xpCalculado;
    }

    const xpRelatorio = document.getElementById("xpTotal");
    if(xpRelatorio){
        xpRelatorio.textContent = xpCalculado;
    }
}

/*==================================================
 CONQUISTA DO DIA
==================================================*/
function verificarConclusao(){
    const total = document.querySelectorAll(".task").length;
    const feitas = document.querySelectorAll(".task:checked").length;

    if(total === 0) return;

    if(feitas === total){
        if(localStorage.getItem("missao-concluida") === dataHoje()){
            return;
        }
        localStorage.setItem("missao-concluida", dataHoje());
        setTimeout(() => {
            alert(
`🚔 MISSÃO CONCLUÍDA!

Você cumpriu 100% das tarefas de hoje.

A farda é questão de tempo.
Amanhã a batalha continua.`
            );
        }, 400);
    }
}