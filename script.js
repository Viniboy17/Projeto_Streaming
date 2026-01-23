/*================================= Funçoes de Funcionamentodo site ==============================*/


//Botao para rolar para o lado nos filmes

function rolar(id, direcao) {
    const container = document.querySelector(`#${id} .classconteudo`);

    container.scrollBy({
        left: direcao * container.clientWidth * 0.5,
        behavior: 'smooth'
    });
}


/*-----------------------Funcionalidade para aparecer e fechar a pagina de login e singup----------------*/
const pagsingup = document.getElementById("pagsingup");
const paglogin = document.getElementById("paglogin");
const xfechar = document.getElementById("xfechar");

//aparecer pagina de singup
function clicksingup() {

    if (pagsingup.style.display === 'block') {
        pagsingup.style.display = 'none';
    } 
    else {
        pagsingup.style.display = 'block';
        paglogin.style.display = 'none';
    }
}

//aparecer pagina de login
function clicklogin() {

    if (paglogin.style.display === 'block') {
        paglogin.style.display = 'none';
    } else {
        paglogin.style.display = 'block';
        pagsingup.style.display = 'none';
    }
}

//botao de x para fechar pagina flutuante
function fechar() {
    pagsingup.style.display = 'none';
    paglogin.style.display = 'none';
}

/* ------------------------------Exibir categorias------------------------------------------- */
const icategorias = document.getElementById("icategorias");
function categorias() {
    if(icategorias.style.display === 'flex'){
        icategorias.style.display = 'none';
    }
    else{
        icategorias.style.display = 'flex';
        icategorias.style.margin='10px 0px 0px 0px'
    }
}
















/*============================== Daqui para baixo é sobre consumo e leitura da lista M3U ========================*/




let m3uItens = [];

/* ================= LEITURA M3U ================= */

const statusDiv = document.getElementById("status");
const NOME_DO_ARQUIVO = "http://streams4k.xyz/get.php?username=gold07920&password=89853504&type=m3u_plus&output=mpegts";

/* ================= CARREGAR M3U ================= */
function normalizarTexto(texto) {
    return texto
        .replace(/[^\w\s]/g, "")
        .toLowerCase()
        .trim();
}

function embaralharArray(array) {
    return array
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
}

async function carregarListaM3U() {
    try {
        const response = await fetch(NOME_DO_ARQUIVO);
        if (!response.ok) throw new Error("Arquivo não encontrado");

        const texto = await response.text();

        processarM3U(texto);
        processarCinema(texto);
        processartopfilmes(texto);
        processartop_series(texto);
        processaranimes_populares(texto);
        processarPesquisaM3U(texto);


        if (bannerItens.length > 0) iniciarBanner();

        carregarCinema();
        carregartopfilmes();
        carregartopseries();
        carregaranimespopulares();
        

        statusDiv.innerText =
            `Banner: ${bannerItens.length} | Cinema: ${cinemaItens.length} | Top Filmes: ${top_filmesItens.length} | Top Animes:${animes_popularesItens.length} | Top series:${top_seriesItens.length}`;

    } catch (erro) {
        statusDiv.innerText = "Erro ao carregar a lista M3U.";
        console.error(erro);
    }
}


/* ================= BANNER ================= */

const CATEGORIA_BANNER = "Cinema";
const banner = document.getElementById("banner");

let bannerItens = [];
let bannerIndex = 0;

/* ================= PROCESSAR BANNER ================= */

function processarM3U(texto) {
    const linhas = texto.split("\n");

    for (const linha of linhas) {
        if (!linha.startsWith("#EXTINF")) continue;

        const grupo = extrair(linha, 'group-title="');
        const logo = extrair(linha, 'tvg-logo="');
        const nome = extrair(linha, 'tvg-name="');

        if (grupo.includes(CATEGORIA_BANNER) && logo) {
            bannerItens.push({ nome, logo });
        }
    }

    bannerItens = bannerItens.slice(0, 5);
}

/* ================= BANNER LOOP ================= */

function iniciarBanner() {
    banner.style.backgroundImage = `url(${bannerItens[0].logo})`;

    setInterval(() => {
        bannerIndex = (bannerIndex + 1) % bannerItens.length;
        banner.style.backgroundImage = `url(${bannerItens[bannerIndex].logo})`;
    }, 3000);
}

/* ================= CINEMA ================= */

const NO_CINEMA = "Cinema";
const cinemaContainer = document.querySelector("#no_cinema .classconteudo");
let cinemaItens = [];

/* ================= PROCESSAR CINEMA ================= */

function processarCinema(texto) {
    const linhas = texto.split("\n");

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        if (!linha.startsWith("#EXTINF")) continue;

        const grupo = extrair(linha, 'group-title="');
        const logo = extrair(linha, 'tvg-logo="');
        const nome = extrair(linha, 'tvg-name="');
        const url = linhas[i + 1]?.trim();

        if (grupo.includes(NO_CINEMA) && logo && url) {
            cinemaItens.push({ nome, logo, url });
        }
    }
}

/* ================= APLICAR CINEMA ================= */

function carregarCinema() {
    if (!cinemaContainer) return;

    const cards = cinemaContainer.querySelectorAll(".conteudo");

    cards.forEach((card, index) => {
        if (!cinemaItens[index]) return;
        aplicarCard(card, cinemaItens[index]);
    });
}


/* ================= TOP FILMES ================= */

const TOP_FILMES = "Lançamentos";
const top_filmesContainer = document.querySelector("#top_filmes .classconteudo");
let top_filmesItens = [];

/* ================= PROCESSAR TOP FILMES ================= */

function processartopfilmes(texto) {
    const linhas = texto.split("\n");

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        if (!linha.startsWith("#EXTINF")) continue;

        const grupo = extrair(linha, 'group-title="');
        const logo = extrair(linha, 'tvg-logo="');
        const nome = extrair(linha, 'tvg-name="');
        const url = linhas[i + 1]?.trim();

        if (grupo.includes(TOP_FILMES) && logo && url) {
            top_filmesItens.push({ nome, logo, url });
        }
    }
}

/* ================= APLICAR TOP FILMES ================= */

function carregartopfilmes() {
    if (!top_filmesContainer) return;

    const cards = top_filmesContainer.querySelectorAll(".conteudo");

    cards.forEach((card, index) => {
        if (!top_filmesItens[index]) return;
        aplicarCard(card, top_filmesItens[index]);
    });
}


/* ================= TOP SERIES ================= */

const top_series = "prime video";
const top_seriesContainer = document.querySelector("#top_series .classconteudo");
let top_seriesItens = [];

/* ================= PROCESSAR TOP SERIES ================= */

function processartop_series(texto) {
    const linhas = texto.split("\n");
    const seriesMap = {};

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        if (!linha.startsWith("#EXTINF")) continue;

        const grupoBruto = extrair(linha, 'group-title="');
        const grupo = normalizarTexto(grupoBruto);

        if (!grupo.includes("prime video")) continue;

        const logo = extrair(linha, 'tvg-logo="');
        const nomeCompleto = extrair(linha, 'tvg-name="');
        const url = linhas[i + 1]?.trim(); // 👈 URL do episódio

        if (!logo || !nomeCompleto || !url) continue;

        // Remove S01E01, S02E03 etc
        const nomeSerie = nomeCompleto
            .replace(/\s*S\d{2}E\d{2}.*/i, "")
            .trim();

        // Só adiciona o PRIMEIRO episódio da série
        if (!seriesMap[nomeSerie]) {
            seriesMap[nomeSerie] = {
                nome: nomeSerie,
                logo: logo,
                url: url // 👈 AGORA TEM URL
            };
        }
    }

    // Converte para array
    top_seriesItens = Object.values(seriesMap);
}


/* ================= APLICAR TOP SERIES ================= */

function carregartopseries() {
    if (!top_seriesContainer) return;

    const cards = top_seriesContainer.querySelectorAll(".conteudo");

    cards.forEach((card, index) => {
        if (!top_seriesItens[index]) return;
        aplicarCard(card, top_seriesItens[index]);
    });
}



/* ================= ANIMES POPULARES ================= */

const animes_populares = "Funimation";
const animes_popularesContainer = document.querySelector("#top_animes .classconteudo");
let animes_popularesItens = [];

/* ================= PROCESSAR ANIMES POPULARES ================= */

function processaranimes_populares(texto) {
    const linhas = texto.split("\n");
    const seriesMap = {};

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        if (!linha.startsWith("#EXTINF")) continue;

        const grupoBruto = extrair(linha, 'group-title="');
        const grupo = normalizarTexto(grupoBruto);

        if (!grupo.includes("funimation")) continue;

        const logo = extrair(linha, 'tvg-logo="');
        const nomeCompleto = extrair(linha, 'tvg-name="');
        const url = linhas[i + 1]?.trim(); // 👈 URL do episódio

        if (!logo || !nomeCompleto || !url) continue;

        // Remove S01E01, S02E03 etc
        const nomeSerie = nomeCompleto
            .replace(/\s*S\d{2}E\d{2}.*/i, "")
            .trim();

        // Só adiciona o PRIMEIRO episódio do anime
        if (!seriesMap[nomeSerie]) {
            seriesMap[nomeSerie] = {
                nome: nomeSerie,
                logo: logo,
                url: url // 👈 AGORA TEM URL
            };
        }
    }

    // Converte para array
    animes_popularesItens = Object.values(seriesMap);
}


/* ================= APLICAR ANIMES POPULARES ================= */

function carregaranimespopulares() {
    if (!animes_popularesContainer) return;

    const cards = animes_popularesContainer.querySelectorAll(".conteudo");

    cards.forEach((card, index) => {
        if (!animes_popularesItens[index]) return;
        aplicarCard(card, animes_popularesItens[index]);
    });
}



/* ============================ carregar em outra pagina ao clicar ================ */

function aplicarCard(card, item) {
    card.style.backgroundImage = `url(${item.logo})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.title = item.nome;

    card.addEventListener("click", () => {
        const url = encodeURIComponent(item.url);
        const nome = encodeURIComponent(item.nome);

        window.location.href = `paginadoplay.html?url=${url}&nome=${nome}`;
    });
}


/* ================= UTIL ================= */

function extrair(texto, chave) {
    const inicio = texto.indexOf(chave);
    if (inicio === -1) return "";
    const fim = texto.indexOf('"', inicio + chave.length);
    return texto.substring(inicio + chave.length, fim);
}

/* ================= INICIAR ================= */


function processarPesquisaM3U(texto) {
    const linhas = texto.split("\n");

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        if (!linha.startsWith("#EXTINF")) continue;

        const nome = extrair(linha, 'tvg-name="');
        const logo = extrair(linha, 'tvg-logo="');
        const grupo = extrair(linha, 'group-title="');
        const url = linhas[i + 1]?.trim(); // 👈 URL do vídeo

        if (!nome || !logo || !url) continue;

        m3uItens.push({
            nome,
            logo,
            grupo,
            url
        });
    }
}










/* ------------------------------Pesquisa na M3U------------------------------------------- */

const frmpesquisa = document.getElementById("pesquisa");

frmpesquisa.onsubmit = (ev) => {
    ev.preventDefault();

    const termo = ev.target.pesquisar.value.trim().toLowerCase();
    ev.target.pesquisar.blur();

    if (termo === "") {
        alert("Preencha o campo!");
        return;
    }

    pesquisarNaM3U(termo);
};


function pesquisarNaM3U(termo) {
    const lista = document.getElementById("contpesquisado");
    const main = document.querySelector("main");

    main.style.display = "none";
    lista.innerHTML = "";

    const resultados = m3uItens.filter(item =>
        normalizarTexto(item.nome).includes(normalizarTexto(termo))
    );

    if (resultados.length === 0) {
        lista.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    resultados.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("conteudo");

    card.style.backgroundImage = `url(${item.logo})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.title = item.nome;

    card.innerHTML = `
        <div class="overlay">
            <h2>${item.nome}</h2>
        </div>
    `;

    // 👇 CLIQUE PARA ABRIR A PAGINA DE PLAY
    card.addEventListener("click", () => {
        const url = encodeURIComponent(item.url);
        const nome = encodeURIComponent(item.nome);

        window.location.href = `paginadoplay.html?url=${url}&nome=${nome}`;
    });

    lista.appendChild(card);
});

}


carregarListaM3U();