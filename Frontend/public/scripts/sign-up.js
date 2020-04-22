import { handleErrors } from "./utils.js";

const signUpForm = document.querySelector(".sign-up-form");

signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(signUpForm);
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const body = { fullName, email, password };
    try {
        if (password !== confirmPassword) {
            let passwordError = new Error;
            passwordError.name = "Password Error"
            passwordError.message = "Passwords must match"
            passwordError.status = "passwordError";
            throw passwordError;
        }

        const res = await fetch("http://localhost:8000/users", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw res;
        }
        const {
            token,
            user: { id },
        } = await res.json();
        // storage access_token in localStorage:
        localStorage.setItem("CLACK_CURRENT_USER_FULLNAME", fullName);
        localStorage.setItem("CLACK_ACCESS_TOKEN", token);
        localStorage.setItem("CLACK_CURRENT_USER_ID", id);
        window.location.href = "/main";
    } catch (err) {
        handleErrors(err);
    }
});