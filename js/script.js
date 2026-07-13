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

}