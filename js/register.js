/* ==========================================================
   REGISTER WIZARD
   Anna University, Trichy Alumni Portal
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;


    /* ======================================================
       VARIABLES
    ====================================================== */

    let currentStep = 1;

    const totalSteps = 4;

    let otpTimerInterval = null;

    let otpSeconds = 300;

    let generatedOtp = null;


    /* ======================================================
       LOCAL "DATABASE" HELPERS
       DEMO ONLY — replace with real API calls once a
       backend is available. Accounts are saved to
       localStorage so login.html can authenticate against
       them.
    ====================================================== */

    const AU_USERS_KEY = "auAlumniUsers";

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

    function saveStoredUsers(users) {

        try {

            localStorage.setItem(
                AU_USERS_KEY,
                JSON.stringify(users)
            );

        } catch (err) {

            /* localStorage unavailable — ignore for demo */

        }

    }

    function isEmailTaken(email) {

        const value = email.trim().toLowerCase();

        return getStoredUsers().some(
            user => (user.email || "").toLowerCase() === value
        );

    }

    function isMobileTaken(mobile) {

        const value = mobile.trim();

        return getStoredUsers().some(
            user => (user.mobile || "") === value
        );

    }


    /* ======================================================
       STEP ELEMENTS
    ====================================================== */

    const steps = document.querySelectorAll(".register-step");

    const stepItems = document.querySelectorAll(".step-item");


    /* ======================================================
       SHOW STEP
    ====================================================== */

    function showStep(stepNumber) {

        if (stepNumber < 1 || stepNumber > totalSteps) {
            return;
        }

        currentStep = stepNumber;


        /* ----------------------------------------------
           SHOW / HIDE FORM STEPS
        ---------------------------------------------- */

        steps.forEach(step => {

            const stepValue = Number(step.dataset.step);

            step.classList.toggle(
                "active",
                stepValue === stepNumber
            );

        });


        /* ----------------------------------------------
           STEP INDICATOR
           
           IMPORTANT:
           HTML uses data-step-indicator
        ---------------------------------------------- */

        stepItems.forEach(item => {

            const itemStep =
                Number(item.dataset.stepIndicator);

            item.classList.remove("active");

            item.classList.remove("completed");


            if (itemStep === stepNumber) {

                item.classList.add("active");

            } else if (itemStep < stepNumber) {

                item.classList.add("completed");

            }

        });


        /* ----------------------------------------------
           SCROLL TO REGISTER CARD
        ---------------------------------------------- */

        const card =
            document.querySelector(".register-card");

        if (card) {

            card.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        /* ----------------------------------------------
           STEP 4 OTP EMAIL
        ---------------------------------------------- */

        if (stepNumber === 4) {

            const email =
                document.getElementById("email");

            const otpEmail =
                document.getElementById("otpEmail");


            if (email && otpEmail) {

                otpEmail.textContent =
                    email.value.trim();

            }

        }

    }


    /* ======================================================
       ERROR FUNCTIONS
    ====================================================== */

    function showError(field, message) {

        if (!field) return;


        field.style.borderColor =
            "var(--danger)";


        const parent =
            field.parentElement;

        if (!parent) return;


        const oldError =
            parent.querySelector(".error-text");

        if (oldError) {
            oldError.remove();
        }


        const error =
            document.createElement("div");

        error.className =
            "error-text";

        error.textContent =
            message;


        parent.appendChild(error);

    }


    function removeError(field) {

        if (!field) return;


        field.style.borderColor = "";


        const parent =
            field.parentElement;

        if (!parent) return;


        const error =
            parent.querySelector(".error-text");

        if (error) {
            error.remove();
        }

    }


    function clearStepErrors(stepNumber) {

        const step =
            document.querySelector(
                `.register-step[data-step="${stepNumber}"]`
            );

        if (!step) return;


        step.querySelectorAll(".error-text")
            .forEach(error => error.remove());


        step.querySelectorAll("input, select")
            .forEach(field => {

                field.style.borderColor = "";

            });

    }


    /* ======================================================
       EMAIL VALIDATION
    ====================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* ======================================================
       STEP 1 VALIDATION
    ====================================================== */

    function validateStep1() {

        clearStepErrors(1);

        let valid = true;


        const firstName =
            document.getElementById("firstName");

        const lastName =
            document.getElementById("lastName");

        const email =
            document.getElementById("email");

        const mobile =
            document.getElementById("mobile");

        const dob =
            document.getElementById("dob");


        /* ----------------------------------------------
           First Name
        ---------------------------------------------- */

        if (!firstName ||
            !firstName.value.trim()) {

            showError(
                firstName,
                "Enter your first name."
            );

            valid = false;
        }


        /* ----------------------------------------------
           Last Name
        ---------------------------------------------- */

        if (!lastName ||
            !lastName.value.trim()) {

            showError(
                lastName,
                "Enter your last name."
            );

            valid = false;
        }


        /* ----------------------------------------------
           Email
        ---------------------------------------------- */

        if (!email ||
            !email.value.trim()) {

            showError(
                email,
                "Enter your email address."
            );

            valid = false;

        } else if (
            !isValidEmail(email.value.trim())
        ) {

            showError(
                email,
                "Enter a valid email address."
            );

            valid = false;

        } else if (
            isEmailTaken(email.value)
        ) {

            showError(
                email,
                "An account with this email already exists."
            );

            valid = false;
        }


        /* ----------------------------------------------
           Mobile
        ---------------------------------------------- */

        if (!mobile ||
            !mobile.value.trim()) {

            showError(
                mobile,
                "Enter your mobile number."
            );

            valid = false;

        } else {

            const mobileValue =
                mobile.value.replace(/\D/g, "");


            if (mobileValue.length !== 10) {

                showError(
                    mobile,
                    "Enter a valid 10-digit mobile number."
                );

                valid = false;

            } else if (
                isMobileTaken(mobileValue)
            ) {

                showError(
                    mobile,
                    "An account with this mobile number already exists."
                );

                valid = false;
            }

        }


        /* ----------------------------------------------
           Date of Birth
        ---------------------------------------------- */

        if (!dob ||
            !dob.value) {

            showError(
                dob,
                "Select your date of birth."
            );

            valid = false;
        }


        return valid;

    }


    /* ======================================================
       STEP 2 VALIDATION
    ====================================================== */

    function validateStep2() {

        clearStepErrors(2);

        let valid = true;


        const graduationYear =
            document.getElementById("graduationYear");

        const department =
            document.getElementById("department");

        const degree =
            document.getElementById("degree");


        /* ----------------------------------------------
           Graduation Year
        ---------------------------------------------- */

        if (!graduationYear ||
            !graduationYear.value.trim()) {

            showError(
                graduationYear,
                "Enter your graduation year."
            );

            valid = false;

        } else {

            const year =
                Number(graduationYear.value);

            const currentYear =
                new Date().getFullYear();


            if (
                year < 1900 ||
                year > currentYear
            ) {

                showError(
                    graduationYear,
                    "Enter a valid graduation year."
                );

                valid = false;
            }

        }


        /* ----------------------------------------------
           Department
        ---------------------------------------------- */

        if (!department ||
            !department.value.trim()) {

            showError(
                department,
                "Enter your department."
            );

            valid = false;
        }


        /* ----------------------------------------------
           Degree
        ---------------------------------------------- */

        if (!degree ||
            !degree.value.trim()) {

            showError(
                degree,
                "Enter your degree."
            );

            valid = false;
        }


        return valid;

    }


    /* ======================================================
       PASSWORD STRENGTH
    ====================================================== */

    function checkPasswordStrength(password) {

        let score = 0;


        if (password.length >= 8) {
            score++;
        }


        if (/[A-Z]/.test(password)) {
            score++;
        }


        if (/[a-z]/.test(password)) {
            score++;
        }


        if (/[0-9]/.test(password)) {
            score++;
        }


        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }


        return score;

    }


    /* ======================================================
       STEP 3 VALIDATION
    ====================================================== */

    function validateStep3() {

        clearStepErrors(3);

        let valid = true;


        const password =
            document.getElementById("password");

        const confirmPassword =
            document.getElementById("confirmPassword");

        const terms =
            document.getElementById("terms");


        /* ----------------------------------------------
           Password
        ---------------------------------------------- */

        if (!password ||
            !password.value) {

            showError(
                password,
                "Enter your password."
            );

            valid = false;

        } else if (
            password.value.length < 8
        ) {

            showError(
                password,
                "Password must be at least 8 characters."
            );

            valid = false;
        }


        /* ----------------------------------------------
           Confirm Password
        ---------------------------------------------- */

        if (!confirmPassword ||
            !confirmPassword.value) {

            showError(
                confirmPassword,
                "Confirm your password."
            );

            valid = false;

        } else if (
            password &&
            confirmPassword.value !== password.value
        ) {

            showError(
                confirmPassword,
                "Passwords do not match."
            );

            valid = false;
        }


        /* ----------------------------------------------
           Terms
        ---------------------------------------------- */

        if (!terms ||
            !terms.checked) {

            const termsParent =
                terms
                    ? terms.closest(".terms")
                    : null;


            if (termsParent) {

                const oldError =
                    termsParent.querySelector(".error-text");

                if (oldError) {
                    oldError.remove();
                }


                const error =
                    document.createElement("div");

                error.className =
                    "error-text";

                error.textContent =
                    "You must agree to the terms and conditions.";


                termsParent.appendChild(error);

            }

            valid = false;

        }


        return valid;

    }


    /* ======================================================
       NEXT STEP BUTTONS
    ====================================================== */

    document.querySelectorAll(".next-step")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const nextStep =
                        Number(button.dataset.next);


                    let valid = true;


                    if (currentStep === 1) {
                        valid = validateStep1();
                    }


                    if (currentStep === 2) {
                        valid = validateStep2();
                    }


                    if (currentStep === 3) {
                        valid = validateStep3();
                    }


                    if (!valid) {
                        return;
                    }


                    showStep(nextStep);


                    /* ------------------------------------------
                       Enter OTP step
                    ------------------------------------------ */

                    if (nextStep === 4) {

                        sendOtp();

                    }

                }
            );

        });


    /* ======================================================
       BACK BUTTONS
    ====================================================== */

    document.querySelectorAll(".prev-step")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const previousStep =
                        Number(button.dataset.prev);

                    showStep(previousStep);

                }
            );

        });


    /* ======================================================
       OTP INPUTS
    ====================================================== */

    const otpInputs =
        document.querySelectorAll(".otp-box");


    otpInputs.forEach((input, index) => {


        /* ----------------------------------------------
           Allow only numbers
        ---------------------------------------------- */

        input.addEventListener(
            "input",
            event => {

                let value =
                    event.target.value
                        .replace(/\D/g, "");


                event.target.value =
                    value.substring(0, 1);


                removeOtpStatus();


                if (
                    value &&
                    index < otpInputs.length - 1
                ) {

                    otpInputs[index + 1].focus();

                }


                syncOtp();

            }
        );


        /* ----------------------------------------------
           Backspace
        ---------------------------------------------- */

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    otpInputs[index - 1].focus();

                }

            }
        );


        /* ----------------------------------------------
           Arrow navigation
        ---------------------------------------------- */

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "ArrowLeft" &&
                    index > 0
                ) {

                    otpInputs[index - 1].focus();

                }


                if (
                    event.key === "ArrowRight" &&
                    index < otpInputs.length - 1
                ) {

                    otpInputs[index + 1].focus();

                }

            }
        );


        /* ----------------------------------------------
           Paste OTP
        ---------------------------------------------- */

        input.addEventListener(
            "paste",
            event => {

                event.preventDefault();


                const pasted =
                    (
                        event.clipboardData ||
                        window.clipboardData
                    )
                    .getData("text")
                    .replace(/\D/g, "")
                    .substring(0, 6);


                if (!pasted) return;


                pasted.split("")
                    .forEach(
                        (digit, i) => {

                            if (otpInputs[i]) {

                                otpInputs[i].value =
                                    digit;

                            }

                        }
                    );


                syncOtp();


                const nextEmpty =
                    Array.from(otpInputs)
                        .findIndex(
                            box => !box.value
                        );


                if (nextEmpty !== -1) {

                    otpInputs[nextEmpty].focus();

                } else {

                    otpInputs[
                        otpInputs.length - 1
                    ].focus();

                }

            }
        );

    });


    /* ======================================================
       SYNC HIDDEN OTP
    ====================================================== */

    function syncOtp() {

        const hiddenOtp =
            document.getElementById("otp");

        if (!hiddenOtp) return;


        hiddenOtp.value =
            Array.from(otpInputs)
                .map(input => input.value)
                .join("");

    }


    /* ======================================================
       CLEAR OTP
    ====================================================== */

    function clearOtp() {

        otpInputs.forEach(input => {

            input.value = "";

        });


        syncOtp();

    }


    /* ======================================================
       OTP STATUS
    ====================================================== */

    function showOtpStatus(message, type) {

        const status =
            document.getElementById("otpMessage");

        if (!status) return;


        status.textContent =
            message;


        status.className =
            "otp-status " + type;

    }


    function removeOtpStatus() {

        const status =
            document.getElementById("otpMessage");

        if (!status) return;


        status.textContent = "";

        status.className =
            "otp-status";

    }


    /* ======================================================
       SEND OTP
       FRONTEND DEMO
    ====================================================== */

    function sendOtp() {

        const email =
            document.getElementById("email");

        const otpEmail =
            document.getElementById("otpEmail");


        if (!email) return;


        const emailValue =
            email.value.trim();


        if (otpEmail) {

            otpEmail.textContent =
                emailValue;

        }


        clearOtp();

        removeOtpStatus();


        /*
         * DEMO ONLY
         *
         * Production version should call PHP backend
         * and generate/store/send OTP securely.
         */

        generatedOtp =
            String(
                Math.floor(
                    100000 +
                    Math.random() * 900000
                )
            );


        console.log(
            "Demo OTP:",
            generatedOtp
        );


        showOtpStatus(
            "OTP sent to your email address.",
            "success"
        );


        startOtpTimer();


        setTimeout(() => {

            if (otpInputs[0]) {

                otpInputs[0].focus();

            }

        }, 200);

    }


    /* ======================================================
       RESEND OTP
    ====================================================== */

    const resendOtpBtn =
        document.getElementById("resendOtpBtn");


    if (resendOtpBtn) {

        resendOtpBtn.addEventListener(
            "click",
            () => {

                if (
                    resendOtpBtn.disabled
                ) {

                    return;

                }


                sendOtp();

            }
        );

    }


    /* ======================================================
       OTP TIMER
    ====================================================== */

    function startOtpTimer() {

        clearInterval(
            otpTimerInterval
        );


        otpSeconds = 300;


        updateOtpTimer();


        if (resendOtpBtn) {

            resendOtpBtn.disabled =
                true;

        }


        otpTimerInterval =
            setInterval(
                () => {

                    otpSeconds--;


                    updateOtpTimer();


                    if (otpSeconds <= 0) {

                        clearInterval(
                            otpTimerInterval
                        );


                        if (resendOtpBtn) {

                            resendOtpBtn.disabled =
                                false;

                        }

                    }

                },
                1000
            );

    }


    function updateOtpTimer() {

        const timer =
            document.getElementById("otpTimer");

        if (!timer) return;


        const minutes =
            Math.floor(
                otpSeconds / 60
            );

        const seconds =
            otpSeconds % 60;


        timer.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    }


    /* ======================================================
       VERIFY OTP
    ====================================================== */

    const verifyOtpBtn =
        document.getElementById("verifyOtpBtn");


    if (verifyOtpBtn) {

        verifyOtpBtn.addEventListener(
            "click",
            () => {

                syncOtp();


                const otp =
                    document.getElementById("otp");


                if (
                    !otp ||
                    otp.value.length !== 6
                ) {

                    showOtpStatus(
                        "Enter the complete 6-digit OTP.",
                        "error"
                    );


                    if (otpInputs[0]) {

                        otpInputs[0].focus();

                    }


                    return;

                }


                /* ------------------------------------------
                   DEMO OTP CHECK
                ------------------------------------------ */

                if (
                    generatedOtp &&
                    otp.value === generatedOtp
                ) {

                    showOtpStatus(
                        "Email verified successfully.",
                        "success"
                    );


                    verifyOtpBtn.disabled =
                        true;


                    verifyOtpBtn.textContent =
                        "Email Verified";


                    clearInterval(
                        otpTimerInterval
                    );


                    /*
                     * Submit registration after
                     * successful OTP verification.
                     */

                    submitRegistration();

                } else {

                    showOtpStatus(
                        "Invalid OTP. Please try again.",
                        "error"
                    );

                }

            }
        );

    }


    /* ======================================================
       OTP BACK BUTTON
    ====================================================== */

    const otpBackBtn =
        document.getElementById("otpBackBtn");


    if (otpBackBtn) {

        otpBackBtn.addEventListener(
            "click",
            () => {

                showStep(3);

            }
        );

    }


    /* ======================================================
       FINAL REGISTRATION SUBMIT
    ====================================================== */

    function submitRegistration() {

        /*
         * Prevent normal form submission temporarily.
         * Replace this section with your PHP API/AJAX
         * endpoint when backend is ready.
         */

        registerForm.dataset.otpVerified =
            "true";


        /*
         * Allow normal submit if the form has an action.
         */

        if (
            registerForm.getAttribute("action")
        ) {

            registerForm.submit();

            return;

        }


        /*
         * DEMO ONLY
         *
         * No backend yet, so the account is saved to
         * localStorage and login.html authenticates
         * against it. Replace with a real API call once
         * a backend exists — and never store a plaintext
         * password like this in production.
         */

        const email =
            document.getElementById("email").value.trim();

        const newUser = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: email,
            mobile: document.getElementById("mobile").value.trim(),
            dob: document.getElementById("dob").value,
            graduationYear: document.getElementById("graduationYear").value,
            department: document.getElementById("department").value,
            degree: document.getElementById("degree").value,
            password: document.getElementById("password").value,
            registeredAt: new Date().toISOString()
        };

        const users = getStoredUsers();

        users.push(newUser);

        saveStoredUsers(users);


        showOtpStatus(
            "Registration completed successfully. Redirecting to login…",
            "success"
        );

        setTimeout(() => {

            window.location.href =
                "index.html?registered=1&email=" +
                encodeURIComponent(email);

        }, 1200);

    }


    /* ======================================================
       FORM SUBMIT PROTECTION
    ====================================================== */

    registerForm.addEventListener(
        "submit",
        event => {

            /*
             * Registration should only submit after
             * successful OTP verification.
             */

            if (
                registerForm.dataset.otpVerified !==
                "true"
            ) {

                event.preventDefault();

            }

        }
    );


    /* ======================================================
       LIVE VALIDATION
    ====================================================== */

    registerForm
        .querySelectorAll(
            "input, select"
        )
        .forEach(field => {


            field.addEventListener(
                "input",
                () => {

                    removeError(field);

                }
            );


            field.addEventListener(
                "change",
                () => {

                    removeError(field);

                }
            );

        });


    /* ======================================================
       MOBILE NUMBER
    ====================================================== */

    const mobile =
        document.getElementById("mobile");


    if (mobile) {

        mobile.addEventListener(
            "input",
            () => {

                mobile.value =
                    mobile.value
                        .replace(/\D/g, "")
                        .substring(0, 10);

            }
        );

    }


    /* ======================================================
       GRADUATION YEAR
    ====================================================== */

    const graduationYear =
        document.getElementById("graduationYear");


    if (graduationYear) {

        graduationYear.addEventListener(
            "input",
            () => {

                graduationYear.value =
                    graduationYear.value
                        .replace(/\D/g, "")
                        .substring(0, 4);

            }
        );

    }


    /* ======================================================
       DOB
       Show placeholder first,
       open date picker on focus.
    ====================================================== */

    const dob =
        document.getElementById("dob");


    if (dob) {

        dob.addEventListener(
            "focus",
            () => {

                if (dob.type !== "date") {

                    dob.type = "date";

                }

            }
        );


        dob.addEventListener(
            "blur",
            () => {

                if (!dob.value) {

                    dob.type = "text";

                }

            }
        );

    }


    /* ======================================================
       PASSWORD LIVE CHECK
    ====================================================== */

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");


    if (password) {

        password.addEventListener(
            "input",
            () => {

                removeError(password);

            }
        );

    }


    if (confirmPassword) {

        confirmPassword.addEventListener(
            "input",
            () => {

                removeError(confirmPassword);

            }
        );

    }


    /* ======================================================
       INITIAL STEP
    ====================================================== */

    showStep(1);

});