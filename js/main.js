let vagas = [];
let showingAllJobs = false;

const jobsList = document.getElementById("jobsList");
const loadingMessage = document.getElementById("loadingMessage");
const emptyMessage = document.getElementById("emptyMessage");
const jobsCounter = document.getElementById("jobsCounter");
const viewAllJobsButton = document.getElementById("viewAllJobsButton");

const searchInput = document.getElementById("searchInput");
const locationInput = document.getElementById("locationInput");
const modelInput = document.getElementById("modelInput");
const areaInput = document.getElementById("areaInput");
const clearFilters = document.getElementById("clearFilters");

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLabel(value) {
  if (!value) return "Não informado";

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

  return labels[value] || value;
}

async function loadJobsFromSupabase() {
  loadingMessage.classList.remove("hidden");
  emptyMessage.classList.add("hidden");
  jobsList.innerHTML = "";
  jobsCounter.textContent = "Carregando vagas...";

  const { data, error } = await window.supabaseClient
    .from("vagas")
    .select("*")
    .eq("ativa", true)
    .order("created_at", { ascending: false });

  loadingMessage.classList.add("hidden");

  if (error) {
    console.error("Erro ao buscar vagas:", error);
    jobsCounter.textContent = "Erro ao carregar vagas";
    emptyMessage.classList.remove("hidden");
    emptyMessage.innerHTML = `
      <h3>Não foi possível carregar as vagas.</h3>
      <p>Verifique a conexão com o Supabase e tente novamente.</p>
    `;
    return;
  }

  vagas = data || [];
  renderJobs();
}

function getFilteredJobs() {
  const search = normalizeText(searchInput.value);
  const location = normalizeText(locationInput.value);
  const model = modelInput.value;
  const area = areaInput.value;

  return vagas.filter((vaga) => {
    const fullText = normalizeText(`
      ${vaga.titulo}
      ${vaga.empresa}
      ${vaga.localizacao}
      ${vaga.area}
      ${vaga.resumo}
    `);

    const matchesSearch = !search || fullText.includes(search);
    const matchesLocation = !location || normalizeText(vaga.localizacao).includes(location);
    const matchesModel = !model || vaga.modelo_trabalho === model;
    const matchesArea = !area || vaga.area === area;

    return matchesSearch && matchesLocation && matchesModel && matchesArea;
  });
}

function hasActiveFilters() {
  return (
    searchInput.value.trim() ||
    locationInput.value.trim() ||
    modelInput.value ||
    areaInput.value
  );
}

function renderJobs() {
  const filteredJobs = getFilteredJobs();
  const filtersAreActive = hasActiveFilters();

  const jobsToRender =
    showingAllJobs || filtersAreActive
      ? filteredJobs
      : filteredJobs.slice(0, 3);

  jobsList.innerHTML = "";

  if (filteredJobs.length === 0) {
    jobsCounter.textContent = "0 vaga(s) encontrada(s)";
    viewAllJobsButton.classList.add("hidden");

    emptyMessage.classList.remove("hidden");
    emptyMessage.innerHTML = `
      <h3>Nenhuma vaga encontrada no momento.</h3>
      <p>Volte em breve para conferir novas oportunidades.</p>
    `;
    return;
  }

  emptyMessage.classList.add("hidden");

  if (!filtersAreActive && !showingAllJobs && filteredJobs.length > 3) {
    jobsCounter.textContent = `Mostrando 3 vagas recentes de ${filteredJobs.length} vaga(s) disponível(is)`;
  } else {
    jobsCounter.textContent = `${filteredJobs.length} vaga(s) encontrada(s)`;
  }

  if (!filtersAreActive && filteredJobs.length > 3) {
    viewAllJobsButton.classList.remove("hidden");
    viewAllJobsButton.textContent = showingAllJobs
      ? "Mostrar apenas recentes"
      : "Ver todas as vagas";
  } else {
    viewAllJobsButton.classList.add("hidden");
  }

  jobsToRender.forEach((vaga) => {
    const card = document.createElement("article");
    card.className = "job-card";

    card.innerHTML = `
      <div>
        <h3>${escapeHtml(vaga.titulo)}</h3>
        <p class="job-company">${escapeHtml(vaga.empresa || "Empresa não informada")}</p>
      </div>

      <div class="job-meta">
        <span class="badge">${escapeHtml(vaga.localizacao)}</span>
        <span class="badge">${escapeHtml(formatLabel(vaga.modelo_trabalho))}</span>
        <span class="badge">${escapeHtml(formatLabel(vaga.area))}</span>
      </div>

      <p class="job-summary">${escapeHtml(vaga.resumo)}</p>

      <strong>${escapeHtml(vaga.salario || "Salário não informado")}</strong>

      <a href="vaga.html?id=${vaga.id}" class="btn btn-primary">Ver detalhes</a>
    `;

    jobsList.appendChild(card);
  });
}

function setupFilters() {
  [searchInput, locationInput, modelInput, areaInput].forEach((input) => {
    input.addEventListener("input", () => {
      showingAllJobs = false;
      renderJobs();
    });

    input.addEventListener("change", () => {
      showingAllJobs = false;
      renderJobs();
    });
  });

  clearFilters.addEventListener("click", () => {
    searchInput.value = "";
    locationInput.value = "";
    modelInput.value = "";
    areaInput.value = "";
    showingAllJobs = false;
    renderJobs();
  });

  viewAllJobsButton.addEventListener("click", () => {
    showingAllJobs = !showingAllJobs;
    renderJobs();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  loadJobsFromSupabase();
});