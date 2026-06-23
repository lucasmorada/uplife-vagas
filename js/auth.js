const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showMessage(message, type) {
  loginMessage.textContent = message;
  loginMessage.className = `form-message ${type}`;
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

  console.log("Resultado do login:", { data, error });

  if (error) {
    showMessage("E-mail ou senha inválidos. Verifique os dados e tente novamente.", "error");
    return;
  }

  if (!data.session) {
    showMessage("Login feito, mas a sessão não foi criada. Verifique as configurações do Supabase.", "error");
    return;
  }

  window.location.href = "admin.html";
});