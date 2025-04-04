import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  setDoc, doc, getDocs, collection, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", email), { email });
      alert("Signup successful!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

// Dashboard Features
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("userEmail").innerText = `Welcome, ${user.email}`;
  } else if (window.location.pathname.includes("dashboard.html")) {
    window.location.href = "login.html";
  }
});

const showUsersBtn = document.getElementById("showUsersBtn");
if (showUsersBtn) {
  showUsersBtn.addEventListener("click", async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const list = document.getElementById("userList");
    list.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const li = document.createElement("li");
      li.textContent = doc.data().email;
      list.appendChild(li);
    });
  });
}

const changePasswordBtn = document.getElementById("changePasswordBtn");
if (changePasswordBtn) {
  changePasswordBtn.addEventListener("click", async () => {
    const newPassword = prompt("Enter new password:");
    if (newPassword && newPassword.length >= 6) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        alert("Password updated!");
      } catch (err) {
        alert("Error: " + err.message);
      }
    } else {
      alert("Password must be 6+ characters");
    }
  });
}

const deleteAccountBtn = document.getElementById("deleteAccountBtn");
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Delete your account?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.email));
        await deleteUser(auth.currentUser);
        alert("Account deleted.");
        window.location.href = "index.html";
      } catch (err) {
        alert("Error deleting account: " + err.message);
      }
    }
  });
}
