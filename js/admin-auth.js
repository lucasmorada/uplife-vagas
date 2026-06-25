const adminLoginScreen = document.getElementById("adminLoginScreen");
const adminProtectedContent = document.getElementById("adminProtectedContent");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginMessage = document.getElementById("adminLoginMessage");

function showLoginMessage(message, type) {
  adminLoginMessage.textContent = message;
  adminLoginMessage.className = `form-message ${type}`;
}

function showLoginScreen() {
  adminLoginScreen.classList.remove("hidden");
  adminProtectedContent.classList.add("hidden");
}

async function showAdminPanel() {
  adminLoginScreen.classList.add("hidden");
  adminProtectedContent.classList.remove("hidden");

  if (typeof loadAdminJobs === "function") {
    await loadAdminJobs();
  }
}

async function checkIfUserIsAdmin(userId) {
  const { data, error } = await window.supabaseClient
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar admin:", error);
    return false;
  }

  return Boolean(data);
}

async function checkAdminSession() {
  const { data, error } = await window.supabaseClient.auth.getSession();

  if (error || !data.session) {
    showLoginScreen();
    return;
  }

  const userId = data.session.user.id;
  const isAdmin = await checkIfUserIsAdmin(userId);

  if (!isAdmin) {
    await window.supabaseClient.auth.signOut();
    showLoginScreen();
    showLoginMessage("Sua conta não tem permissão para acessar o painel.", "error");
    return;
  }

  await showAdminPanel();
}

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!email || !password) {
    showLoginMessage("Preencha e-mail e senha para continuar.", "error");
    return;
  }

  showLoginMessage("Entrando...", "success");

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session) {
    console.error("Erro no login:", error);
    showLoginMessage("E-mail ou senha inválidos.", "error");
    return;
  }

  const isAdmin = await checkIfUserIsAdmin(data.session.user.id);

  if (!isAdmin) {
    await window.supabaseClient.auth.signOut();
    showLoginMessage("Sua conta não tem permissão para acessar o painel.", "error");
    return;
  }

  showLoginMessage("Acesso autorizado.", "success");
  await showAdminPanel();
});

document.addEventListener("DOMContentLoaded", checkAdminSession);