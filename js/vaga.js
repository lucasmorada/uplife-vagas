const jobDetails = document.getElementById("jobDetails");

function getJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {
  if (!dateString) return "Data não informada";

  const date = new Date(dateString);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatLabel(value) {
  const labels = {
    presencial: "Presencial",
    remoto: "Remoto",
    hibrido: "Híbrido",
    mecanica: "Mecânica",
    edificacoes: "Edificações",
    eletrotecnica: "Eletrotécnica",
    seguranca: "Segurança do Trabalho",
    planejador: "Planejamento",
    logistica: "Logística",
    outros: "Outros"
  };

  return labels[value] || value || "Não informado";
}

function renderUnavailableJob() {
  jobDetails.innerHTML = `
    <div class="empty-state">
      <h1>Essa vaga não está mais disponível.</h1>
      <p>Ela pode ter sido encerrada ou removida pela equipe da UpLife.</p>
      <a href="index.html" class="btn btn-primary">Voltar para vagas</a>
    </div>
  `;
}

function renderJobDetails(vaga) {
  jobDetails.innerHTML = `
    <p class="tag">Detalhes da vaga</p>

    <h1>${escapeHtml(vaga.titulo)}</h1>

    <p class="job-company">${escapeHtml(vaga.empresa || "Empresa não informada")}</p>

    <div class="details-grid">
      <span class="badge">${escapeHtml(vaga.localizacao || "Localização não informada")}</span>
      <span class="badge">${escapeHtml(vaga.tipo_contrato || "Contrato não informado")}</span>
      <span class="badge">${escapeHtml(formatLabel(vaga.modelo_trabalho))}</span>
      <span class="badge">${escapeHtml(formatLabel(vaga.area))}</span>
      <span class="badge">${escapeHtml(vaga.salario || "Salário não informado")}</span>
    </div>

    <p><strong>Publicada em:</strong> ${formatDate(vaga.created_at)}</p>

    <div class="details-section">
      <h2>Descrição da vaga</h2>
      <p>${escapeHtml(vaga.descricao || "Descrição não informada.")}</p>
    </div>

    <div class="details-section">
      <h2>Requisitos</h2>
      <p>${escapeHtml(vaga.requisitos || "Requisitos não informados.")}</p>
    </div>

    <div class="details-section">
      <h2>Benefícios</h2>
      <p>${escapeHtml(vaga.beneficios || "Benefícios não informados.")}</p>
    </div>

    <div class="details-section">
      <h2>Horário de trabalho</h2>
      <p>${escapeHtml(vaga.horario || "Horário não informado.")}</p>
    </div>

    <div class="details-section">
      <h2>Como se candidatar</h2>
      <p>Clique no botão abaixo para acessar o link de inscrição da vaga.</p>

      <a href="${escapeHtml(vaga.link_inscricao)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        Quero me candidatar
      </a>
    </div>
  `;
}

async function loadJobDetails() {
  const id = getJobIdFromUrl();

  if (!id) {
    renderUnavailableJob();
    return;
  }

  const { data, error } = await window.supabaseClient
    .from("vagas")
    .select("*")
    .eq("id", id)
    .eq("ativa", true)
    .single();

  if (error || !data) {
    console.error("Erro ao buscar detalhes da vaga:", error);
    renderUnavailableJob();
    return;
  }

  renderJobDetails(data);
}

document.addEventListener("DOMContentLoaded", () => {
  loadJobDetails();
});