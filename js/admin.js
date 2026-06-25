let vagasAdmin = [];

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

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLabel(value) {
  const labels = {
    presencial: "Presencial",
    remoto: "Remoto",
    hibrido: "Híbrido",
    administrativo: "Administrativo",
    comercial: "Comercial",
    operacional: "Operacional",
    tecnologia: "Tecnologia",
    atendimento: "Atendimento",
    logistica: "Logística",
    outros: "Outros"
  };

  return labels[value] || value || "Não informado";
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

async function loadAdminJobs() {
  adminJobsList.innerHTML = `
    <tr>
      <td colspan="5">Carregando vagas...</td>
    </tr>
  `;

  const { data, error } = await window.supabaseClient
    .from("vagas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar vagas:", error);

    adminJobsList.innerHTML = `
      <tr>
        <td colspan="5">Erro ao carregar vagas. Verifique o Console.</td>
      </tr>
    `;

    return;
  }

  vagasAdmin = data || [];
  renderAdminJobs();
}

function renderAdminJobs() {
  adminJobsList.innerHTML = "";

  if (vagasAdmin.length === 0) {
    adminJobsList.innerHTML = `
      <tr>
        <td colspan="5">Nenhuma vaga cadastrada ainda.</td>
      </tr>
    `;

    updateStats();
    return;
  }

  vagasAdmin.forEach((vaga) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <strong>${escapeHtml(vaga.titulo)}</strong><br>
        <small>${escapeHtml(vaga.empresa || "Empresa não informada")}</small>
      </td>

      <td>${escapeHtml(vaga.localizacao)}</td>

      <td>${escapeHtml(formatLabel(vaga.modelo_trabalho))}</td>

      <td>
        <span class="${vaga.ativa ? "status-active" : "status-inactive"}">
          ${vaga.ativa ? "Ativa" : "Inativa"}
        </span>
      </td>

      <td>
        <div class="action-buttons">
          <button class="small-btn edit" onclick="editJob('${vaga.id}')">Editar</button>

          <button class="small-btn status" onclick="toggleJobStatus('${vaga.id}', ${vaga.ativa})">
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
  document.getElementById("ativa").checked = true;
  formTitle.textContent = "Cadastrar vaga";
  adminMessage.textContent = "";
}

function getFormData() {
  return {
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
  return (
    vaga.titulo &&
    vaga.localizacao &&
    vaga.area &&
    vaga.modelo_trabalho &&
    vaga.resumo &&
    vaga.descricao &&
    vaga.link_inscricao
  );
}

function fillForm(vaga) {
  document.getElementById("jobId").value = vaga.id;
  document.getElementById("titulo").value = vaga.titulo || "";
  document.getElementById("empresa").value = vaga.empresa || "";
  document.getElementById("localizacao").value = vaga.localizacao || "";
  document.getElementById("area").value = vaga.area || "";
  document.getElementById("tipo_contrato").value = vaga.tipo_contrato || "";
  document.getElementById("modelo_trabalho").value = vaga.modelo_trabalho || "";
  document.getElementById("salario").value = vaga.salario || "";
  document.getElementById("resumo").value = vaga.resumo || "";
  document.getElementById("descricao").value = vaga.descricao || "";
  document.getElementById("requisitos").value = vaga.requisitos || "";
  document.getElementById("beneficios").value = vaga.beneficios || "";
  document.getElementById("horario").value = vaga.horario || "";
  document.getElementById("link_inscricao").value = vaga.link_inscricao || "";
  document.getElementById("ativa").checked = Boolean(vaga.ativa);
}

function editJob(id) {
  const vaga = vagasAdmin.find((item) => item.id === id);

  if (!vaga) return;

  formTitle.textContent = "Editar vaga";
  fillForm(vaga);
  openForm();
}

async function toggleJobStatus(id, currentStatus) {
  const { error } = await window.supabaseClient
    .from("vagas")
    .update({ ativa: !currentStatus })
    .eq("id", id);

  if (error) {
    console.error("Erro ao alterar status:", error);
    alert("Erro ao alterar status da vaga. Veja o Console.");
    return;
  }

  await loadAdminJobs();
}

async function deleteJob(id) {
  const confirmed = confirm("Tem certeza que deseja excluir esta vaga?");

  if (!confirmed) return;

  const { error } = await window.supabaseClient
    .from("vagas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir vaga:", error);
    alert("Erro ao excluir vaga. Veja o Console.");
    return;
  }

  await loadAdminJobs();
}

jobForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const jobId = document.getElementById("jobId").value;
  const vaga = getFormData();

  if (!validateJob(vaga)) {
    showAdminMessage("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  showAdminMessage("Salvando vaga...", "success");

  if (jobId) {
    const { data, error } = await window.supabaseClient
      .from("vagas")
      .update(vaga)
      .eq("id", jobId)
      .select();

    if (error) {
      console.error("Erro ao atualizar vaga:", error);
      showAdminMessage("Erro ao atualizar vaga. Veja o Console.", "error");
      return;
    }

    console.log("Vaga atualizada:", data);
    showAdminMessage("Vaga atualizada com sucesso.", "success");
  } else {
    const { data, error } = await window.supabaseClient
      .from("vagas")
      .insert([vaga])
      .select();

    if (error) {
      console.error("Erro ao cadastrar vaga:", error);
      showAdminMessage("Erro ao cadastrar vaga. Veja o Console.", "error");
      return;
    }

    console.log("Vaga cadastrada:", data);
    showAdminMessage("Vaga cadastrada com sucesso.", "success");
  }

  await loadAdminJobs();

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

logoutButton.addEventListener("click", async () => {
  await window.supabaseClient.auth.signOut();
  window.location.reload();
});

window.loadAdminJobs = loadAdminJobs;