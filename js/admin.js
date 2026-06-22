let vagasAdmin = [
  {
    id: "1",
    titulo: "Auxiliar Administrativo",
    empresa: "Empresa parceira",
    localizacao: "Araucária, PR",
    area: "administrativo",
    tipo_contrato: "CLT",
    modelo_trabalho: "presencial",
    salario: "R$ 1.900,00",
    resumo: "Vaga para auxiliar em rotinas administrativas.",
    descricao: "Atuação com organização de documentos e apoio administrativo.",
    requisitos: "Ensino médio completo.",
    beneficios: "Vale transporte.",
    horario: "Segunda a sexta.",
    link_inscricao: "https://example.com",
    ativa: true
  },
  {
    id: "2",
    titulo: "Atendente Comercial",
    empresa: "UpLife Parceiros",
    localizacao: "Curitiba, PR",
    area: "comercial",
    tipo_contrato: "CLT",
    modelo_trabalho: "presencial",
    salario: "A combinar",
    resumo: "Atendimento ao cliente e suporte comercial.",
    descricao: "Atendimento e acompanhamento de clientes.",
    requisitos: "Boa comunicação.",
    beneficios: "Comissão.",
    horario: "Horário comercial.",
    link_inscricao: "https://example.com",
    ativa: true
  }
];

const totalJobs = document.getElementById("totalJobs");
const activeJobs = document.getElementById("activeJobs");
const inactiveJobs = document.getElementById("inactiveJobs");
const adminJobsList = document.getElementById("adminJobsList");

const newJobButton = document.getElementById("newJobButton");
const formPanel = document.getElementById("formPanel");
const closeFormButton = document.getElementById("closeFormButton");
const jobForm = document.getElementById("jobForm");
const formTitle = document.getElementById("formTitle");
const adminMessage = document.getElementById("adminMessage");
const logoutButton = document.getElementById("logoutButton");

function formatLabel(value) {
  const labels = {
    presencial: "Presencial",
    remoto: "Remoto",
    hibrido: "Híbrido"
  };

  return labels[value] || value;
}

function showAdminMessage(message, type) {
  adminMessage.textContent = message;
  adminMessage.className = `form-message ${type}`;
}

function updateStats() {
  const total = vagasAdmin.length;
  const active = vagasAdmin.filter((vaga) => vaga.ativa).length;
  const inactive = total - active;

  totalJobs.textContent = total;
  activeJobs.textContent = active;
  inactiveJobs.textContent = inactive;
}

function renderAdminJobs() {
  adminJobsList.innerHTML = "";

  vagasAdmin.forEach((vaga) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <strong>${vaga.titulo}</strong><br>
        <small>${vaga.empresa || "Empresa não informada"}</small>
      </td>
      <td>${vaga.localizacao}</td>
      <td>${formatLabel(vaga.modelo_trabalho)}</td>
      <td>
        <span class="${vaga.ativa ? "status-active" : "status-inactive"}">
          ${vaga.ativa ? "Ativa" : "Inativa"}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="small-btn edit" onclick="editJob('${vaga.id}')">Editar</button>
          <button class="small-btn status" onclick="toggleJobStatus('${vaga.id}')">
            ${vaga.ativa ? "Desativar" : "Ativar"}
          </button>
          <button class="small-btn delete" onclick="deleteJob('${vaga.id}')">Excluir</button>
        </div>
      </td>
    `;

    adminJobsList.appendChild(row);
  });

  updateStats();
}

function openForm() {
  formPanel.classList.remove("hidden");
  formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeForm() {
  formPanel.classList.add("hidden");
  jobForm.reset();
  document.getElementById("jobId").value = "";
  formTitle.textContent = "Cadastrar vaga";
  adminMessage.textContent = "";
}

function getFormData() {
  return {
    id: document.getElementById("jobId").value || crypto.randomUUID(),
    titulo: document.getElementById("titulo").value.trim(),
    empresa: document.getElementById("empresa").value.trim(),
    localizacao: document.getElementById("localizacao").value.trim(),
    area: document.getElementById("area").value,
    tipo_contrato: document.getElementById("tipo_contrato").value.trim(),
    modelo_trabalho: document.getElementById("modelo_trabalho").value,
    salario: document.getElementById("salario").value.trim(),
    resumo: document.getElementById("resumo").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    requisitos: document.getElementById("requisitos").value.trim(),
    beneficios: document.getElementById("beneficios").value.trim(),
    horario: document.getElementById("horario").value.trim(),
    link_inscricao: document.getElementById("link_inscricao").value.trim(),
    ativa: document.getElementById("ativa").checked
  };
}

function validateJob(vaga) {
  if (!vaga.titulo || !vaga.localizacao || !vaga.area || !vaga.modelo_trabalho || !vaga.resumo || !vaga.descricao || !vaga.link_inscricao) {
    return false;
  }

  return true;
}

function fillForm(vaga) {
  document.getElementById("jobId").value = vaga.id;
  document.getElementById("titulo").value = vaga.titulo;
  document.getElementById("empresa").value = vaga.empresa;
  document.getElementById("localizacao").value = vaga.localizacao;
  document.getElementById("area").value = vaga.area;
  document.getElementById("tipo_contrato").value = vaga.tipo_contrato;
  document.getElementById("modelo_trabalho").value = vaga.modelo_trabalho;
  document.getElementById("salario").value = vaga.salario;
  document.getElementById("resumo").value = vaga.resumo;
  document.getElementById("descricao").value = vaga.descricao;
  document.getElementById("requisitos").value = vaga.requisitos;
  document.getElementById("beneficios").value = vaga.beneficios;
  document.getElementById("horario").value = vaga.horario;
  document.getElementById("link_inscricao").value = vaga.link_inscricao;
  document.getElementById("ativa").checked = vaga.ativa;
}

function editJob(id) {
  const vaga = vagasAdmin.find((item) => item.id === id);

  if (!vaga) return;

  formTitle.textContent = "Editar vaga";
  fillForm(vaga);
  openForm();
}

function toggleJobStatus(id) {
  vagasAdmin = vagasAdmin.map((vaga) => {
    if (vaga.id === id) {
      return {
        ...vaga,
        ativa: !vaga.ativa
      };
    }

    return vaga;
  });

  renderAdminJobs();
}

function deleteJob(id) {
  const confirmed = confirm("Tem certeza que deseja excluir esta vaga?");

  if (!confirmed) return;

  vagasAdmin = vagasAdmin.filter((vaga) => vaga.id !== id);
  renderAdminJobs();
}

jobForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const vaga = getFormData();

  if (!validateJob(vaga)) {
    showAdminMessage("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  const existingIndex = vagasAdmin.findIndex((item) => item.id === vaga.id);

  if (existingIndex >= 0) {
    vagasAdmin[existingIndex] = vaga;
    showAdminMessage("Vaga atualizada com sucesso.", "success");
  } else {
    vagasAdmin.unshift(vaga);
    showAdminMessage("Vaga cadastrada com sucesso.", "success");
  }

  renderAdminJobs();

  setTimeout(() => {
    closeForm();
  }, 800);
});

newJobButton.addEventListener("click", () => {
  jobForm.reset();
  document.getElementById("jobId").value = "";
  document.getElementById("ativa").checked = true;
  formTitle.textContent = "Cadastrar vaga";
  openForm();
});

closeFormButton.addEventListener("click", closeForm);

logoutButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  renderAdminJobs();
});