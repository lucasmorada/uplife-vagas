const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showMessage(message, type) {
  loginMessage.textContent = message;
  loginMessage.className = `form-message ${type}`;
}

async function checkExistingSession() {
  const { data } = await window.supabaseClient.auth.getSession();

  if (data.session) {
    window.location.href = "admin.html";
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Preencha e-mail e senha para continuar.", "error");
    return;
  }

  showMessage("Entrando...", "success");

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Erro no login:", error);
    showMessage("E-mail ou senha inválidos. Verifique os dados e tente novamente.", "error");
    return;
  }

  if (!data.session) {
    showMessage("Não foi possível iniciar a sessão. Tente novamente.", "error");
    return;
  }

  window.location.href = "admin.html";
});

document.addEventListener("DOMContentLoaded", checkExistingSession);