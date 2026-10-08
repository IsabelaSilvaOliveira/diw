
/* FINDPRO - FUNCIONALIDADES */

/* 1. SOLICITAÇÃO DE ORÇAMENTO */

const formulario = document.getElementById("form-orcamento");

if (formulario) {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        const solicitacao = {
            id: Date.now(),
            descricao: document.getElementById("descricao").value,
            informacoes: document.getElementById("informacoes").value,
            cidade: document.getElementById("cidade").value,
            cep: document.getElementById("cep").value,
            data: document.getElementById("data").value,
            periodo: document.getElementById("periodo").value,
            telefone: document.getElementById("telefone").value,
            whatsapp: document.getElementById("whatsapp").checked,
            status: "Pendente"
        };

        const solicitacoes = JSON.parse(
            localStorage.getItem("solicitacoes") || "[]"
        );

        solicitacoes.push(solicitacao);

        localStorage.setItem(
            "solicitacoes",
            JSON.stringify(solicitacoes)
        );

        alert("Solicitação enviada com sucesso!");
        formulario.reset();
    });
}

/* 2. SOLICITAÇÕES RECEBIDAS */

const listaSolicitacoes = document.getElementById("lista-solicitacoes");
const filtroStatus = document.getElementById("filtro-status");

// Evita inserir texto do usuário diretamente como HTML.
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function(caractere) {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return entidades[caractere];
    });
}

function mostrarSolicitacoes() {
    if (!listaSolicitacoes) return;

    const solicitacoes = JSON.parse(
        localStorage.getItem("solicitacoes") || "[]"
    );

    const filtro = filtroStatus ? filtroStatus.value : "Todos";

    const filtradas = solicitacoes.filter(function(solicitacao) {
        return filtro === "Todos" || solicitacao.status === filtro;
    });

    listaSolicitacoes.innerHTML = "";

    if (filtradas.length === 0) {
        listaSolicitacoes.innerHTML =
            "<p>Nenhuma solicitação encontrada.</p>";
        return;
    }

    filtradas.forEach(function(solicitacao) {
        const card = document.createElement("article");
        card.className = "card-solicitacao";

        const status = solicitacao.status || "Pendente";
        const classeStatus = {
            "Pendente": "status-pendente",
            "Aceita": "status-aceita",
            "Recusada": "status-recusada"
        }[status] || "status-pendente";

        const botoes = status === "Pendente"
            ? `
                <div class="acoes-solicitacao">
                    <button class="btn-aceitar"
                        data-id="${solicitacao.id}"
                        data-status="Aceita">
                        Aceitar solicitação
                    </button>

                    <button class="btn-recusar"
                        data-id="${solicitacao.id}"
                        data-status="Recusada">
                        Recusar solicitação
                    </button>
                </div>
              `
            : "";

        card.innerHTML = `
            <h3>${escaparHTML(solicitacao.descricao)}</h3>

            <span class="status-solicitacao ${classeStatus}">
                ${escaparHTML(status)}
            </span>

            <p><strong>Informações adicionais:</strong>
                ${escaparHTML(solicitacao.informacoes || "Não informadas")}
            </p>

            <p><strong>Bairro / Cidade:</strong>
                ${escaparHTML(solicitacao.cidade)}
            </p>

            <p><strong>CEP:</strong>
                ${escaparHTML(solicitacao.cep)}
            </p>

            <p><strong>Data desejada:</strong>
                ${escaparHTML(solicitacao.data)}
            </p>

            <p><strong>Período:</strong>
                ${escaparHTML(solicitacao.periodo)}
            </p>

            <p><strong>Telefone:</strong>
                ${escaparHTML(solicitacao.telefone)}
            </p>

            <p><strong>Contato por WhatsApp:</strong>
                ${solicitacao.whatsapp ? "Sim" : "Não"}
            </p>

            ${botoes}
        `;

        listaSolicitacoes.appendChild(card);
    });
}

function atualizarStatus(id, novoStatus) {
    const solicitacoes = JSON.parse(
        localStorage.getItem("solicitacoes") || "[]"
    );

    const solicitacao = solicitacoes.find(function(item) {
        return String(item.id) === String(id);
    });

    if (!solicitacao || solicitacao.status !== "Pendente") return;

    solicitacao.status = novoStatus;

    localStorage.setItem(
        "solicitacoes",
        JSON.stringify(solicitacoes)
    );

    mostrarSolicitacoes();
}

if (listaSolicitacoes) {
    mostrarSolicitacoes();

    listaSolicitacoes.addEventListener("click", function(event) {
        const botao = event.target.closest("button[data-status]");

        if (!botao) return;

        atualizarStatus(
            botao.dataset.id,
            botao.dataset.status
        );
    });
}

if (filtroStatus) {
    filtroStatus.addEventListener("change", mostrarSolicitacoes);
}

/* 3. AVALIAÇÃO DE SERVIÇO */

const formAvaliacao = document.getElementById("form-avaliacao");

if (formAvaliacao) {
    formAvaliacao.addEventListener("submit", function(event) {
        event.preventDefault();

        const avaliacao = {
            id: Date.now(),
            profissional: document.getElementById("profissional").value,
            servico: document.getElementById("servico").value,
            nota: Number(document.getElementById("nota").value),
            comentario: document.getElementById("comentario").value,
            data: new Date().toISOString()
        };

        const avaliacoes = JSON.parse(
            localStorage.getItem("avaliacoes") || "[]"
        );

        avaliacoes.push(avaliacao);

        localStorage.setItem(
            "avaliacoes",
            JSON.stringify(avaliacoes)
        );

        document.getElementById("mensagem-avaliacao").textContent =
            "Avaliação enviada com sucesso!";

        formAvaliacao.reset();
    });
}
