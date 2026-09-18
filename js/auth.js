/* ==========================================================
   Anna University, Trichy Alumni Portal
   Authentication Script

   Handles:
   - Password visibility
   - Login validation
   - Demo login against locally-stored accounts
     (created via the registration wizard)

   Register wizard / OTP logic is handled separately
   in register.js

   NOTE — DEMO ONLY:
   There is no real backend here. Accounts created on
   register.html are saved to localStorage, and this file
   checks against that same storage to "log in". Replace
   this section with real API/session calls once a backend
   is available.
   ========================================================== */

const AU_USERS_KEY = "auAlumniUsers";
const AU_SESSION_KEY = "auAlumniSession";


/* ==========================================================
   LOCAL "DATABASE" HELPERS
   ========================================================== */

function getStoredUsers() {

    try {

        const raw =
            localStorage.getItem(AU_USERS_KEY);

        const users =
            raw ? JSON.parse(raw) : [];

        return Array.isArray(users) ? users : [];

    } catch (err) {

        return [];

    }

}


function findUserByLoginId(loginId) {

    const value =
        loginId.trim().toLowerCase();

    return getStoredUsers().find(user => {

        const email =
            (user.email || "").toLowerCase();

        const mobile =
            (user.mobile || "").toLowerCase();

        return email === value || mobile === value;

    });

}


function startSession(user) {

    const session = {
        name: [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" "),
        email: user.email,
        loggedInAt: new Date().toISOString()
    };

    try {

        localStorage.setItem(
            AU_SESSION_KEY,
            JSON.stringify(session)
        );

    } catch (err) {

        /* localStorage unavailable — ignore for demo */

    }

}


/* ==========================================================
   LOGIN ALERT
   ========================================================== */

function showLoginAlert(message, type) {

    const alertBox =
        document.getElementById("loginAlert");

    if (!alertBox) return;

    alertBox.textContent = message;

    alertBox.className =
        "auth-alert is-visible " + type;

}


function hideLoginAlert() {

    const alertBox =
        document.getElementById("loginAlert");

    if (!alertBox) return;

    alertBox.textContent = "";

    alertBox.className = "auth-alert";

}


document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       SHOW "REGISTRATION SUCCESSFUL" MESSAGE
       Triggered by a ?registered=1 redirect from register.js
       ====================================================== */

    const params =
        new URLSearchParams(window.location.search);

    if (params.get("registered") === "1") {

        showLoginAlert(
            "Registration successful! Please log in with your new account.",
            "success"
        );

        const prefillEmail =
            params.get("email");

        const loginIdField =
            document.getElementById("loginId");

        if (prefillEmail && loginIdField) {

            loginIdField.value =
                decodeURIComponent(prefillEmail);

        }

    }


    /* ======================================================
       PASSWORD VISIBILITY TOGGLE
       ====================================================== */

    document.querySelectorAll(".password-toggle").forEach(button => {

        button.addEventListener("click", () => {

            const targetId =
                button.getAttribute("data-target");

            const input =
                document.getElementById(targetId);

            if (!input) return;

            const isPassword =
                input.type === "password";

            input.type =
                isPassword ? "text" : "password";

            button.innerHTML =
                isPassword
                    ? eyeOpenIcon()
                    : eyeClosedIcon();

            button.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        });

    });



    /* ======================================================
       LOGIN FORM VALIDATION
       Register validation is NOT handled here.
       ====================================================== */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", e => {

            /*
             * There is no backend to post to, so we always
             * take over submission ourselves.
             */

            e.preventDefault();

            hideLoginAlert();

            clearErrors();

            let valid = true;


            /* ----------------------------------------------
               Username / Email / Mobile
               ---------------------------------------------- */

            const username =
                document.getElementById("loginId");

            if (
                username &&
                !username.value.trim()
            ) {

                showError(
                    username,
                    "Enter your email or mobile number."
                );

                valid = false;
            }


            /* ----------------------------------------------
               Password
               ---------------------------------------------- */

            const password =
                document.getElementById("loginPassword");

            if (
                password &&
                !password.value.trim()
            ) {

                showError(
                    password,
                    "Enter your password."
                );

                valid = false;
            }


            /* ----------------------------------------------
               Stop here if the fields themselves are invalid
               ---------------------------------------------- */

            if (!valid) {

                return;

            }


            /* ----------------------------------------------
               DEMO AUTH CHECK
               Looks up the account created during
               registration and compares the password.
               ---------------------------------------------- */

            const user =
                findUserByLoginId(username.value);

            if (
                !user ||
                user.password !== password.value
            ) {

                showLoginAlert(
                    "We couldn't find an account matching that email/mobile and password.",
                    "error"
                );

                return;

            }


            startSession(user);

            showLoginAlert(
                "Login successful. Redirecting…",
                "success"
            );

            const loginButton =
                loginForm.querySelector(".btn-primary");

            if (loginButton) {

                loginButton.disabled = true;
                loginButton.textContent = "Redirecting…";

            }

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 600);

        });

    }



    /* ======================================================
       REMOVE LOGIN ERRORS WHILE TYPING
       ====================================================== */

    document.querySelectorAll(
        "#loginForm input, #loginForm select"
    ).forEach(field => {

        field.addEventListener("input", () => {

            removeError(field);

        });

        field.addEventListener("change", () => {

            removeError(field);

        });

    });

});



/* ==========================================================
   ERROR FUNCTIONS
   ========================================================== */

function showError(field, message) {

    if (!field) return;


    field.style.borderColor =
        "var(--danger)";


    /* Remove existing error first */

    const existingError =
        field.parentElement.querySelector(
            ".error-text"
        );

    if (existingError) {

        existingError.remove();

    }


    /* Create error */

    const error =
        document.createElement("div");

    error.className =
        "error-text";

    error.textContent =
        message;


    field.parentElement.appendChild(
        error
    );

}



function removeError(field) {

    if (!field) return;


    field.style.borderColor = "";


    const error =
        field.parentElement.querySelector(
            ".error-text"
        );

    if (error) {

        error.remove();

    }

}



function clearErrors() {

    document
        .querySelectorAll(
            "#loginForm .error-text"
        )
        .forEach(error => {

            error.remove();

        });

}



/* ==========================================================
   PASSWORD ICONS
   ========================================================== */

function eyeOpenIcon() {

    return `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >

            <path
                d="M1 12s4-7 11-7
                   11 7 11 7
                   -4 7 -11 7
                   -11-7 -11-7z"
            />

            <circle
                cx="12"
                cy="12"
                r="3"
            />

        </svg>
    `;

}



function eyeClosedIcon() {

    return `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >

            <path
                d="M17.94 17.94
                   A10.94 10.94 0 0 1
                   12 19
                   c-7 0-11-7-11-7
                   a21.77 21.77 0 0 1
                   5.06-5.94"
            />

            <path
                d="M1 1l22 22"
            />

            <path
                d="M9.53 9.53
                   A3.5 3.5 0 0 0
                   14.47 14.47"
            />

            <path
                d="M21 12
                   s-4-7-11-7
                   a10.94 10.94 0 0 0
                   -3.23.49"
            />

        </svg>
    `;

}