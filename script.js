const url = "https://script.google.com/macros/s/AKfycbw7OPr15jjw_GsEJsI_djsW1U-Mzni0lF2waHlmU1SQ2DILil8QB_HyWiHTABNpMzSP/exec";

// ===============================
// LISTA DE CONVIDADOS (MANTÉM A SUA LISTA AQUI)
// ===============================
const CONVIDADOS = [
  "Geniel",
  "Maria do Rosario",
  "Alex",
  "Carol",
  "Caroline",
  "Maria Aparecida",
  "Maria",
  "Fabio",
  "Daniel",
  "Ana",
  "Rosa",
  "Patricia",
  "William",
  "Leticia",
  "Dija",
  "Edjane",
  "Marcos",
  "Marquinhos",
  "Leo",
  "Leonardo",
  "Tarini",
  "Carolinne Tarini",
  "Nenga",
  "Maria Jose",
  "Meg",
  "Edvane",
  "Ronilson",
  "Carolina",
  "Miguel",
  "Digna",
  "Peta",
  "Dody",
  "Adriana",
  "Paulo",
  "Helio",
  "Udi",
  "Messo",
  "Dani",
  "Daniela",
  "Daniele",
  "Thiago",
  "Selma",
  "Du",
  "Eduardo",
  "Matheus",
  "Lucinha",
  "Lucia",
  "Luciana",
  "Lu",
  "Luan",
  "Beto",
  "Wellington",
  "Keylla",
  "Lucas",
  "Ze",
  "Zé",
  "Dora",
  "Clerice",
  "Claudia",
  "Malu",
  "Clelia",
  "Samuel",
  "Beatriz",
  "Bia",
  "Elias",
  "Laura",
  "Diego",
  "Roberto",
  "Karina",
  "Danilo",
  "Larissa",
  "Guilherme",
  "Juka",
  "Arlindo",
  "Ricardo",
  "Ju",
  "Juliana",
  "Nat",
  "Nathalia",
  "Tania",
  "Nathalie Rueda",
  "Nath",
  "Mel",
  "Lula",
  "Nayara",
  "Ester",
  "Bianca",
  "Julia",
  "Isadora",
  "Gabriela",
  "Gabi",
  "Felipe",
  "Adriano"
];

// Mensagem delicada quando não estiver na lista
const MSG_NAO_ENCONTRADO =
  "Ops! Não encontramos esse nome na nossa lista de convidados. " +
  "Confira se foi digitado corretamente e tenta de novo.";

// ===============================
// NORMALIZAÇÃO E MATCH (tolerante a errinho)
// ===============================
function normalizarTexto(txt) {
  return (txt || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tira acento
    .replace(/\s+/g, " "); // normaliza espaços
}

function distanciaLevenshtein(a, b) {
  a = a || "";
  b = b || "";
  const m = a.length, n = b.length;

  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const custo = b[i - 1] === a[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + custo
      );
    }
  }
  return dp[n][m];
}

function nomeEstaNaLista(nomeDigitado) {
  const alvo = normalizarTexto(nomeDigitado);
  if (!alvo) return false;

  const limite = alvo.length <= 6 ? 1 : 2;

  return CONVIDADOS.some((nomeLista) => {
    const base = normalizarTexto(nomeLista);

    if (base === alvo) return true;

    if (alvo.length >= 4 && (base.includes(alvo) || alvo.includes(base))) return true;

    return distanciaLevenshtein(base, alvo) <= limite;
  });
}

// ===============================
// CONTADOR
// ===============================
function atualizarContador() {
  const dataCasamento = new Date("2026-04-19T12:30:00");
  const agora = new Date();
  const diferenca = dataCasamento - agora;

  if (diferenca <= 0) {
    document.getElementById("tempo").innerText = "Chegou o grande dia 💍";
    return;
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);

  document.getElementById("tempo").innerText =
    `Faltam ${dias} dias • ${horas} horas • ${minutos} minutos`;
}

setInterval(atualizarContador, 1000);
atualizarContador();

// ===============================
// FORM + validação antes de enviar (sem mudar seu HTML)
// ===============================
document.getElementById("formConfirmacao").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = this.querySelector("input").value;
  const presenca = this.querySelector("select").value;

  if (!nomeEstaNaLista(nome)) {
    document.getElementById("mensagem").innerText = MSG_NAO_ENCONTRADO;
    return;
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      nome: nome,
      presenca: presenca
    })
  })
    .then(() => {
      document.getElementById("mensagem").innerText =
        "Presença confirmada 🤍 Obrigada!";
      this.reset();
    })
    .catch(() => {
      document.getElementById("mensagem").innerText =
        "Erro ao enviar. Tente novamente.";
    });
});

// ===============================
// REVEAL ANIMATION (aparece suavemente ao rolar)
// ===============================
(function ativarReveal() {
  const elementos = [
    ...document.querySelectorAll(".secao"),
    ...document.querySelectorAll(".card"),
    ...document.querySelectorAll(".fotos-noivos img"),
    document.querySelector(".contador-fixo")
  ].filter(Boolean);

  elementos.forEach(el => el.classList.add("reveal"));

  // Se não suportar IntersectionObserver, mostra tudo
  if (!("IntersectionObserver" in window)) {
    elementos.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach(el => io.observe(el));
})();
