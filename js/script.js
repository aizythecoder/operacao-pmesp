/*==================================================
 OPERAÇÃO PMESP
 VERSÃO 1.0
==================================================*/

document.addEventListener("DOMContentLoaded", iniciarApp);

function iniciarApp(){

    esconderSplash();

    carregarFrase();

    configurarCards();

    configurarCheckboxes();

    configurarCampos();

    configurarEstudo();

    atualizarProgresso();

}
/*==================================================
 SPLASH
==================================================*/

function esconderSplash(){

    const splash = document.getElementById("splash");

    if(!splash) return;

    setTimeout(()=>{

        splash.style.display="none";

    },3000);

}

/*==================================================
 FRASES
==================================================*/

const frases=[

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

    const quote=document.getElementById("quote");

    if(!quote) return;

    const dia=new Date().getDate();

    quote.textContent=frases[dia % frases.length];

}

/*==================================================
 ABRIR E FECHAR MISSÕES
==================================================*/

function configurarCards(){

    const cards=document.querySelectorAll(".mission-card");

    cards.forEach(card=>{

        const botao=card.querySelector(".mission-header");

        botao.addEventListener("click",()=>{

            card.classList.toggle("open");

        });

    });

}

/*==================================================
 LOCAL STORAGE
==================================================*/

function salvar(){

    const dados={

        checks:{},

        inputs:{}

    };

    document.querySelectorAll(".task").forEach((check,index)=>{

        dados.checks[index]=check.checked;

    });

    document.querySelectorAll("input[type='time'],input[type='number'],input[type='text'],textarea").forEach((campo,index)=>{

        dados.inputs[index]=campo.value;

    });

    localStorage.setItem("operacao-pmesp",JSON.stringify(dados));

}

function carregar(){

    const dados=JSON.parse(localStorage.getItem("operacao-pmesp"));

    if(!dados) return;

    document.querySelectorAll(".task").forEach((check,index)=>{

        if(dados.checks[index]!==undefined){

            check.checked=dados.checks[index];

        }

    });

    document.querySelectorAll("input[type='time'],input[type='number'],input[type='text'],textarea").forEach((campo,index)=>{

        if(dados.inputs[index]!==undefined){

            campo.value=dados.inputs[index];

        }

    });

}/*==================================================
CHECKBOXES + XP + PROGRESSO
==================================================*/

function configurarCheckboxes(){

    carregar();

    const checks=document.querySelectorAll(".task");

    checks.forEach(check=>{

        check.addEventListener("change",()=>{

            salvar();

            atualizarProgresso();

        });

    });

}

function configurarCampos(){

    carregar();

    const campos=document.querySelectorAll("input[type='time'],input[type='number'],input[type='text'],textarea");

    campos.forEach(campo=>{

        campo.addEventListener("input",()=>{

            salvar();

        });

    });

}

function atualizarProgresso(){

    const checks=document.querySelectorAll(".task");

    if(checks.length===0) return;

    let feitos=0;

    checks.forEach(check=>{

        if(check.checked){

            feitos++;

        }

    });

    const porcentagem=Math.round((feitos/checks.length)*100);

    const barra=document.getElementById("progress");

    if(barra){

        barra.style.width=porcentagem+"%";

    }

    const texto=document.getElementById("progressText");

    if(texto){

        texto.textContent=porcentagem+"%";

    }

    const xp=document.getElementById("xp");

    if(xp){

        xp.textContent=feitos*10;

    }

}/*==================================================
ESTUDO DA MANHÃ
==================================================*/

const materias = [
    "portugues",
    "matematica",
    "informatica",
    "constitucional",
    "legislacao"
];

function configurarEstudo(){

    carregarEstudo();

    materias.forEach(id=>{

        const campo=document.getElementById(id);

        if(!campo) return;

        campo.addEventListener("input",()=>{

            salvarEstudo();

            atualizarHoras();

        });

    });

    const questoes=document.getElementById("questoes");

    if(questoes){

        questoes.addEventListener("input",salvarEstudo);

    }

    const observacoes=document.getElementById("observacoes");

    if(observacoes){

        observacoes.addEventListener("input",salvarEstudo);

    }

    const botao=document.getElementById("salvarEstudo");

    if(botao){

        botao.addEventListener("click",()=>{

            salvarEstudo();

            alert("Progresso salvo.");

        });

    }

    atualizarHoras();

}

function salvarEstudo(){

    materias.forEach(id=>{

        const campo=document.getElementById(id);

        if(campo){

            localStorage.setItem(id,campo.value);

        }

    });

    const questoes=document.getElementById("questoes");

    if(questoes){

        localStorage.setItem("questoes",questoes.value);

    }

    const observacoes=document.getElementById("observacoes");

    if(observacoes){

        localStorage.setItem("observacoes",observacoes.value);

    }

}function carregarEstudo(){

    materias.forEach(id=>{

        const campo=document.getElementById(id);

        if(!campo) return;

        const valor=localStorage.getItem(id);

        if(valor!==null){

            campo.value=valor;

        }

    });

    const questoes=document.getElementById("questoes");

    if(questoes){

        const valor=localStorage.getItem("questoes");

        if(valor!==null){

            questoes.value=valor;

        }

    }

    const observacoes=document.getElementById("observacoes");

    if(observacoes){

        const valor=localStorage.getItem("observacoes");

        if(valor!==null){

            observacoes.value=valor;

        }

    }

}

function atualizarHoras(){

    let total=0;

    materias.forEach(id=>{

        const campo=document.getElementById(id);

        if(!campo) return;

        total+=Number(campo.value||0);

    });

    const totalHoras=document.getElementById("totalHoras");

    if(totalHoras){

        totalHoras.textContent=total.toFixed(1)+" horas";

    }

    atualizarEstatisticasEstudo(total);

}

function atualizarEstatisticasEstudo(totalHoras){

    const horas=document.getElementById("studyHours");

    if(horas){

        horas.textContent=totalHoras.toFixed(1)+"h";

    }

    const questoes=document.getElementById("questionsDone");

    if(questoes){

        const valor=document.getElementById("questoes");

        questoes.textContent=valor ? (valor.value || 0) : 0;

    }

}/*==================================================
PAINEL PRINCIPAL
==================================================*/

function atualizarPainel(){

    atualizarProgresso();

    atualizarHoras();

    atualizarMissoes();

    atualizarXP();

}

function atualizarMissoes(){

    const total=document.querySelectorAll(".task").length;

    const feitas=document.querySelectorAll(".task:checked").length;

    const campo=document.getElementById("missionsDone");

    if(campo){

        campo.textContent=`${feitas}/${total}`;

    }

}

function atualizarXP(){

    const checks=document.querySelectorAll(".task:checked").length;

    const horas=calcularHoras();

    const questoes=Number(document.getElementById("questoes")?.value||0);

    let xp=0;

    xp+=checks*10;

    xp+=Math.floor(horas*25);

    xp+=Math.floor(questoes/10);

    const campo=document.getElementById("xpTotal");

    if(campo){

        campo.textContent=xp;

    }

    const topo=document.getElementById("xp");

    if(topo){

        topo.textContent=xp;

    }

}

function calcularHoras(){

    let total=0;

    materias.forEach(id=>{

        const valor=Number(document.getElementById(id)?.value||0);

        total+=valor;

    });

    return total;

}

/*==================================================
ATUALIZAÇÃO AUTOMÁTICA
==================================================*/

document.addEventListener("input",()=>{

    atualizarPainel();

});

document.addEventListener("change",()=>{

    atualizarPainel();

});

window.addEventListener("load",()=>{

    atualizarPainel();

});/*==================================================
 SISTEMA DE DIAS E SEQUÊNCIA
==================================================*/

const DATA_KEY = "operacao-pmesp-data";

function dataHoje(){

    const hoje = new Date();

    return hoje.toISOString().split("T")[0];

}

function verificarNovoDia(){

    const ultimaData = localStorage.getItem(DATA_KEY);

    const hoje = dataHoje();

    if(!ultimaData){

        localStorage.setItem(DATA_KEY, hoje);

        atualizarContadorDias();

        return;

    }

    if(ultimaData !== hoje){

        localStorage.setItem(DATA_KEY, hoje);

        resetarDia();

    }

    atualizarContadorDias();

}

function atualizarContadorDias(){

    const inicio = new Date("2026-01-01");

    const hoje = new Date();

    const diferenca = hoje - inicio;

    const dias = Math.floor(diferenca / 86400000) + 1;

    const contador = document.getElementById("dayCounter");

    if(contador){

        contador.textContent =
        "DIA " + String(dias).padStart(3,"0");

    }

}

function resetarDia(){

    document.querySelectorAll(".task").forEach(check=>{

        check.checked=false;

    });

    salvar();

    atualizarPainel();

}

/*==================================================
 CONQUISTA DO DIA
==================================================*/

function verificarConclusao(){

    const total=document.querySelectorAll(".task").length;

    const feitas=document.querySelectorAll(".task:checked").length;

    if(total===0) return;

    if(feitas===total){

        mostrarMensagemConclusao();

    }

}

function mostrarMensagemConclusao(){

    if(localStorage.getItem("missao-concluida")==dataHoje()){

        return;

    }

    localStorage.setItem("missao-concluida",dataHoje());

    setTimeout(()=>{

        alert(
`MISSÃO CONCLUÍDA!

Você cumpriu todas as tarefas de hoje.

Continue assim.

Amanhã começa outra batalha.`
        );

    },400);

}

/*==================================================
 EVENTOS
==================================================*/

document.addEventListener("change",()=>{

    verificarConclusao();

});

window.addEventListener("load",()=>{

    verificarNovoDia();

});/*==================================================
 SISTEMA DE XP, NÍVEL E PATENTES
==================================================*/

const PATENTES = [
    { nome: "Recruta", xp: 0 },
    { nome: "Soldado", xp: 250 },
    { nome: "Cabo", xp: 600 },
    { nome: "3º Sargento", xp: 1000 },
    { nome: "2º Sargento", xp: 1500 },
    { nome: "1º Sargento", xp: 2200 },
    { nome: "Subtenente", xp: 3000 },
    { nome: "Aspirante", xp: 4000 },
    { nome: "Tenente", xp: 5500 },
    { nome: "Capitão", xp: 7000 },
    { nome: "Major", xp: 9000 },
    { nome: "Coronel", xp: 12000 }
];

function obterXP(){

    return Number(localStorage.getItem("xp-total") || 0);

}

function definirXP(valor){

    localStorage.setItem("xp-total", valor);

}

function adicionarXP(valor){

    const atual = obterXP();

    definirXP(atual + valor);

    atualizarPatente();

}

function calcularPatente(xp){

    let atual = PATENTES[0];

    PATENTES.forEach(p=>{

        if(xp >= p.xp){

            atual = p;

        }

    });

    return atual;

}

function atualizarPatente(){

    const xp = obterXP();

    const patente = calcularPatente(xp);

    const xpTopo = document.getElementById("xp");

    if(xpTopo){

        xpTopo.textContent = xp;

    }

    const xpRelatorio = document.getElementById("xpTotal");

    if(xpRelatorio){

        xpRelatorio.textContent = xp;

    }

    console.log("Patente:", patente.nome);

}

/*==================================================
 GANHAR XP
==================================================*/

function premiarDia(){

    const total=document.querySelectorAll(".task").length;

    const feitas=document.querySelectorAll(".task:checked").length;

    if(total===0) return;

    if(feitas===total){

        if(localStorage.getItem("xp-dia")==dataHoje()){

            return;

        }

        localStorage.setItem("xp-dia",dataHoje());

        adicionarXP(100);

    }

}

document.addEventListener("change",()=>{

    premiarDia();

});

window.addEventListener("load",()=>{

    atualizarPatente();

});