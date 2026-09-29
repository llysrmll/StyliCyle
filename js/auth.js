// auth.js - load on index.html (login) and signup.html

// ---------- Register ----------
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const middleName = document.getElementById("middleName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const age = document.getElementById("age").value;
  const agreeTermsSignup = document.getElementById("agreeTermsSignup")?.checked;

  if (!agreeTermsSignup) {
    alert("You must agree to the Terms and Conditions to register.");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  if (isNaN(age) || age <= 0) {
    alert("Please enter a valid age.");
    return;
  }
  if (!firstName || !lastName || !email) {
    alert("Please fill in all required fields.");
    return;
  }

  // Simulate sending verification code
  alert("Verification code sent to " + email);

  // Hide form and show 2FA setup
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("twoFactorSetup").style.display = "block";

  // Store temp user data
  localStorage.setItem("tempUser", JSON.stringify({ firstName, middleName, lastName, email, password, age }));
});

document.getElementById("verifyCodeBtn")?.addEventListener("click", function() {
  const code = document.getElementById("twoFactorCode").value.trim();
  if (code === "123456") { // Simulate correct code
    const tempUser = JSON.parse(localStorage.getItem("tempUser"));
    // Save user with 2FA enabled
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ ...tempUser, twoFactorEnabled: true });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("tempUser");
    alert("Registration successful! 2FA enabled.");
    window.location.href = "home.html";
  } else {
    alert("Invalid code. Please try again.");
  }
});

document.getElementById("resendCodeBtn")?.addEventListener("click", function() {
  alert("Code resent.");
});

// ---------- Login ----------
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const agreeTermsLogin = document.getElementById("agreeTermsLogin")?.checked;

  if (agreeTermsLogin === false) {
    alert("Please agree to the Terms and Conditions before logging in.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  if (user.twoFactorEnabled) {
    // Show 2FA
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("twoFactorLogin").style.display = "block";
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Verification code sent to " + user.email);
  } else {
    alert("Login successful!");
    window.location.href = "home.html";
  }
});

document.getElementById("verifyLoginCodeBtn")?.addEventListener("click", function() {
  const code = document.getElementById("loginTwoFactorCode").value.trim();
  if (code === "123456") { // Simulate correct code
    alert("Login successful!");
    window.location.href = "home.html";
  } else {
    alert("Invalid code. Please try again.");
  }
});

document.getElementById("resendLoginCodeBtn")?.addEventListener("click", function() {
  alert("Code resent.");
});