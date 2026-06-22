const vagasMock = [
  {
    id: "1",
    titulo: "Auxiliar Administrativo",
    empresa: "Empresa parceira",
    localizacao: "Araucária, PR",
    area: "Administrativo",
    tipo_contrato: "CLT",
    modelo_trabalho: "Presencial",
    salario: "R$ 1.900,00",
    created_at: "2026-06-22",
    resumo: "Vaga para auxiliar em rotinas administrativas.",
    descricao: "Atuação com organização de documentos, apoio em processos internos, atendimento básico e suporte às rotinas administrativas da empresa.",
    requisitos: "Ensino médio completo.\nBoa comunicação.\nConhecimento básico em informática.\nOrganização e responsabilidade.",
    beneficios: "Vale transporte.\nVale alimentação.\nTreinamento interno.",
    horario: "Segunda a sexta, das 08h às 17h.",
    link_inscricao: "https://example.com",
    ativa: true
  },
  {
    id: "2",
    titulo: "Atendente Comercial",
    empresa: "UpLife Parceiros",
    localizacao: "Curitiba, PR",
    area: "Comercial",
    tipo_contrato: "CLT",
    modelo_trabalho: "Presencial",
    salario: "A combinar",
    created_at: "2026-06-22",
    resumo: "Atendimento ao cliente e suporte comercial.",
    descricao: "Atendimento presencial e online, acompanhamento de clientes, organização de informações comerciais e apoio ao time de vendas.",
    requisitos: "Boa comunicação.\nProatividade.\nInteresse pela área comercial.",
    beneficios: "Comissão.\nVale transporte.\nPlano de crescimento.",
    horario: "Horário comercial.",
    link_inscricao: "https://example.com",
    ativa: true
  },
  {
    id: "3",
    titulo: "Suporte de TI Júnior",
    empresa: "Tech Service",
    localizacao: "Curitiba, PR",
    area: "Tecnologia",
    tipo_contrato: "Estágio",
    modelo_trabalho: "Híbrido",
    salario: "R$ 1.400,00",
    created_at: "2026-06-22",
    resumo: "Suporte técnico e atendimento a usuários.",
    descricao: "Atuação com suporte a usuários, manutenção básica de computadores, instalação de sistemas e acompanhamento de chamados.",
    requisitos: "Cursando área de tecnologia.\nConhecimento básico em Windows.\nBoa comunicação.",
    beneficios: "Bolsa auxílio.\nVale transporte.\nPossibilidade de efetivação.",
    horario: "6 horas por dia.",
    link_inscricao: "https://example.com",
    ativa: true
  }
];

const jobDetails = document.getElementById("jobDetails");

function getJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
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
    <h1>${vaga.titulo}</h1>

    <p class="job-company">${vaga.empresa || "Empresa não informada"}</p>

    <div class="details-grid">
      <span class="badge">${vaga.localizacao || "Localização não informada"}</span>
      <span class="badge">${vaga.tipo_contrato || "Contrato não informado"}</span>
      <span class="badge">${vaga.modelo_trabalho || "Modelo não informado"}</span>
      <span class="badge">${vaga.area || "Área não informada"}</span>
      <span class="badge">${vaga.salario || "Salário não informado"}</span>
    </div>

    <p><strong>Publicada em:</strong> ${formatDate(vaga.created_at)}</p>

    <div class="details-section">
      <h2>Descrição da vaga</h2>
      <p>${vaga.descricao || "Descrição não informada."}</p>
    </div>

    <div class="details-section">
      <h2>Requisitos</h2>
      <p>${vaga.requisitos || "Requisitos não informados."}</p>
    </div>

    <div class="details-section">
      <h2>Benefícios</h2>
      <p>${vaga.beneficios || "Benefícios não informados."}</p>
    </div>

    <div class="details-section">
      <h2>Horário de trabalho</h2>
      <p>${vaga.horario || "Horário não informado."}</p>
    </div>

    <div class="details-section">
      <h2>Como se candidatar</h2>
      <p>Clique no botão abaixo para acessar o link de inscrição da vaga.</p>
      <a href="${vaga.link_inscricao}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        Quero me candidatar
      </a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const id = getJobIdFromUrl();

  const vaga = vagasMock.find((item) => item.id === id && item.ativa);

  if (!vaga) {
    renderUnavailableJob();
    return;
  }

  renderJobDetails(vaga);
});