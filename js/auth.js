const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showMessage(message, type) {
  loginMessage.textContent = message;
  loginMessage.className = `form-message ${type}`;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Preencha e-mail e senha para continuar.", "error");
    return;
  }

  showMessage("Login será conectado ao Supabase na próxima etapa.", "success");

  setTimeout(() => {
    window.location.href = "admin.html";
  }, 700);
});