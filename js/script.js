/* ==========================
   OPERAÇÃO PMESP
   VERSÃO 0.1
========================== */

const quotes = [
"Enquanto você pensa em desistir, alguém está estudando para conquistar a vaga.",
"A disciplina faz hoje o que o arrependimento tentará explicar amanhã.",
"O edital não sabe que você está cansado.",
"Você não precisa ser perfeito. Precisa ser constante.",
"Todo dia perdido aumenta o trabalho do dia seguinte.",
"A aprovação é construída nas pequenas escolhas repetidas diariamente.",
"Quem mantém a rotina quando ninguém está olhando chega mais longe.",
"Hoje é mais uma oportunidade para diminuir a distância até a farda."
];

const quote = document.getElementById("quote");
const tasks = document.querySelectorAll(".task input");
const fill = document.getElementById("fill");
const percent = document.getElementById("percent");

// Frase do dia
const dayIndex = new Date().getDay();
quote.textContent = quotes[dayIndex];

// Carregar progresso salvo
tasks.forEach((task, index) => {
    const saved = localStorage.getItem(`task_${index}`);
    if (saved === "true") {
        task.checked = true;
    }

    task.addEventListener("change", () => {
        localStorage.setItem(`task_${index}`, task.checked);
        updateProgress();
    });
});

function updateProgress() {
    let completed = 0;

    tasks.forEach(task => {
        if (task.checked) completed++;
    });

    const progress = Math.round((completed / tasks.length) * 100);

    fill.style.width = progress + "%";
    percent.textContent = progress + "%";
}

updateProgress();

// Contador de dias
const dayCounter = document.getElementById("dayCounter");

const startDateKey = "operationStartDate";

let startDate = localStorage.getItem(startDateKey);

if (!startDate) {
    startDate = new Date().toISOString();
    localStorage.setItem(startDateKey, startDate);
}

const diff = Math.floor(
    (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)
);

dayCounter.textContent =
    "DIA " + String(diff + 1).padStart(3, "0");