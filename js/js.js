document.addEventListener('DOMContentLoaded', () => {
    const usernameInp = document.getElementById('in1');
    const fullNameInp = document.getElementById('in2');
    const emailInp = document.getElementById('in3');
    const passwordInp = document.getElementById('in4');
    const submitBtn = document.querySelector('.submit');
    const validationLines = document.querySelectorAll('.validate > div');

    // 2. Define Icon Paths (Based on your HTML)
    const IMG_CHECK = 'style/img/Vector.png'; // Green Tick
    const IMG_ERROR = 'style/img/Vector (1).png'; // Red Circle

    // 3. Helper: Set Input Error (Handles Red Border + Red Text inside Input)
    const setError = (inputEl, message) => {
        // Find or create the error message div below the input
        let errorDiv = inputEl.parentElement.querySelector('.error-text');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.style.fontFamily=`Figtree`
            errorDiv.className = 'error-text';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '4px';
            inputEl.parentElement.appendChild(errorDiv);
        }

        if (message) {
            // ERROR STATE
            errorDiv.textContent = message;
            errorDiv.style.color = '#FF4D4D';      // Error message text is Red
            inputEl.style.borderColor = '#FF4D4D'; // Input border is Red
            inputEl.style.color = '#FF4D4D';       // Typed text inside input is Red (Matches Screenshot 273)
        } else {
            // VALID/DEFAULT STATE
            errorDiv.textContent = "";
            inputEl.style.borderColor = 'rgba(21, 128, 61, 1)'; // Input border is Blue
            inputEl.style.color = '#000000';       // Typed text is Black
        }
    };

    // 4. Helper: Update Password Checklist (Handles Icon + Statement Color)
    const updateChecklistLine = (index, isValid) => {
        const line = validationLines[index];
        const img = line.querySelector('img');

        if (isValid) {
            line.style.color = '#2ECC71'; // Statement text turns Green
            img.src = IMG_CHECK;         // Icon becomes Green Tick
        } else {
            line.style.color = '#FF4D4D'; // Statement text turns Red
            // img.src = IMG_ERROR;         // Icon becomes Red Circle
            img.src = IMG_ERROR
        }
    };

    // --- VALIDATION LOGIC ---

    const validateUsername = () => {
        const val = usernameInp.value;
        const alphanumeric = /^[a-z0-9]+$/i;

        if (val.length === 0) {
            setError(usernameInp, ""); // Reset if empty
            usernameInp.style.borderColor = ''; 
            usernameInp.style.color = '';
            return;
        }

        // Check length and characters
        if (val.length < 3 || val.length > 15) {
            setError(usernameInp, "Username must be between 3 and 15 characters");
        } else if (!alphanumeric.test(val)) {
            setError(usernameInp, "Username can only contain letters and numbers");
        } else {
            setError(usernameInp, ""); // Valid
        }
    };

    const validateFullName = () => {
        const val = fullNameInp.value;
        const alphaSpace = /^[a-zA-Z\s]+$/;
        
        if (val.length === 0) {
            setError(fullNameInp, "");
            fullNameInp.style.borderColor = '';
            return;
        }

        if (!alphaSpace.test(val)) {
            setError(fullNameInp, "Full name must contain only letters and spaces");
        } else if (val.trim().split(/\s+/).length < 2) {
            setError(fullNameInp, "Please enter your full name (First & Last)");
        } else {
            setError(fullNameInp, "");
        }
    };

    const validateEmail = () => {
        const val = emailInp.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(val.length === 0){
            setError(emailInp, "");
            emailInp.style.borderColor = 'rgba(70, 95, 241, 1)';
            return;
        }
        else if (val.length > 0 && emailRegex.test(val)){
            setError(emailInp , "");
        } else{
            setError(emailInp , "Please enter a valid email address");
            return;
        }
          
       
    };

    const validatePassword = () => {
        const pass = passwordInp.value;
        const name = fullNameInp.value.toLowerCase().trim();
        const email = emailInp.value.toLowerCase().trim();

        // Reset to grey if empty
        if (pass.length === 0) {
            validationLines.forEach(line => {
                line.style.color = '#9C9AA5'; // Grey text
                line.querySelector('img').src = "style/img/check.png"; // Default icon
            });
            passwordInp.style.borderColor = '';
            passwordInp.style.color = '';
            return;
        }

        // Rules
        const isLongEnough = pass.length >= 8;
        const hasNumSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
        const containsSensitive = (name && pass.toLowerCase().includes(name)) || 
                                  (email && pass.toLowerCase().includes(email));

        // Update Text for Strength (Weak vs Strong)
        // Accessing childNodes[1] because [0] is the <img>
        const strengthTextNode = validationLines[0].childNodes[1];
        if (pass.length > 8 && hasNumSymbol) {
            strengthTextNode.textContent = " Password Strength : Strong";
        } else {
            strengthTextNode.textContent = " Password Strength : Weak";
        }

        // Update Colors and Icons
        updateChecklistLine(0, pass.length > 8 && hasNumSymbol); // Strength
        updateChecklistLine(1, !containsSensitive);              // Name/Email
        updateChecklistLine(2, isLongEnough);                    // Length
        updateChecklistLine(3, hasNumSymbol);                    // Symbol

        // Validate Input Box style
        const isValidPass = isLongEnough && hasNumSymbol && !containsSensitive;
        if (isValidPass) {
            passwordInp.style.borderColor = 'rgba(21, 128, 61, 1)';
            passwordInp.style.color = '#000000';
        } else {
            passwordInp.style.borderColor = '#FF4D4D';
            passwordInp.style.color = '#FF4D4D'; // Input text turns Red
        }
    };

    // 5. LIVE VALIDATION LISTENERS
    // Runs every time you type a character
    usernameInp.addEventListener('input', validateUsername);
    fullNameInp.addEventListener('input', validateFullName);
    emailInp.addEventListener('input', validateEmail);
    passwordInp.addEventListener('input', validatePassword);

    // 6. SUBMIT BUTTON
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Stop reload

        // Run validation one last time
        validateUsername();
        validateFullName();
        validateEmail();
        validatePassword();

        // Check for visible errors
        const hasErrors = document.querySelector('.error-text') && 
                          Array.from(document.querySelectorAll('.error-text')).some(el => el.textContent !== "");
        
        // Check if password box is red
        const passInvalid = passwordInp.style.borderColor === 'rgb(255, 77, 77)'; // #FF4D4D

        if (!hasErrors && !passInvalid && usernameInp.value && passwordInp.value) {
            // Show Success Message
            if (!document.querySelector('.success-final')) {
                const msg = document.createElement('div');
                msg.className = 'success-final';
                msg.textContent = "Account Created Successfully!";
                msg.style.color = "#2ECC71";
                msg.style.fontWeight = "bold";
                msg.style.textAlign = "center";
                msg.style.marginTop = "15px";
                document.querySelector('.d-right').appendChild(msg);
                msg.style.fontFamily='Figtree'
            }
        }

        console.log({
            username: usernameInp.value,
            fullName: fullNameInp.value,
            email: emailInp.value,
            password: "********" // برای امنیت
        });
        
    });
});