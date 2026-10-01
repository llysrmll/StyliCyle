// auth.js - load on index.html (login) and signup.html, AFTER common.js

// ---------- Register ----------
document.getElementById("registerForm")?.addEventListener("submit", async function (e) {
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
  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
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

  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  const res = await api("auth/signup.php", {
    method: "POST",
    body: { firstName, middleName, lastName, age, email, password }
  });
  submitBtn.disabled = false;

  if (!res.success) {
    alert(res.error);
    return;
  }

  // dev_code only exists while DEV_MODE is true in config/app.php
  alert(res.dev_code
    ? "Dev mode - your verification code is " + res.dev_code
    : "Verification code sent to " + email);

  document.getElementById("registerForm").style.display = "none";
  document.getElementById("twoFactorSetup").style.display = "block";
});

document.getElementById("verifyCodeBtn")?.addEventListener("click", async function () {
  const code = document.getElementById("twoFactorCode").value.trim();
  if (!code) {
    alert("Enter the 6-digit code.");
    return;
  }
  const res = await api("auth/verify_signup.php", { method: "POST", body: { code } });
  if (res.success) {
    alert("Registration successful!");
    window.location.href = "home.html";
  } else {
    alert(res.error);
  }
});

document.getElementById("resendCodeBtn")?.addEventListener("click", async function () {
  const res = await api("auth/resend_code.php", { method: "POST" });
  if (!res.success) {
    alert(res.error);
    return;
  }
  alert(res.dev_code ? "Dev mode - your new code is " + res.dev_code : "Code resent.");
});

// ---------- Login ----------
document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const agreeTermsLogin = document.getElementById("agreeTermsLogin")?.checked;

  if (agreeTermsLogin === false) {
    alert("Please agree to the Terms and Conditions before logging in.");
    return;
  }

  const res = await api("auth/login.php", { method: "POST", body: { email, password } });
  if (res.success) {
    window.location.href = "home.html";
  } else {
    alert(res.error);
  }
});
