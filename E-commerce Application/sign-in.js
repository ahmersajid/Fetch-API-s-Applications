// Toggle password visibility for both password fields
function setupPasswordToggles() {
    // Setup for password field
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('Password');
    const eyeIcon = toggleBtn.querySelector('i');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });
    
    // Setup for confirm password field
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('Confirm-Password');
    const confirmEyeIcon = toggleConfirmBtn.querySelector('i');
    
    toggleConfirmBtn.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        // Toggle eye icon
        confirmEyeIcon.classList.toggle('fa-eye');
        confirmEyeIcon.classList.toggle('fa-eye-slash');
    });
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', setupPasswordToggles);

function signin(event) {
  event.preventDefault();

  const Name = document.getElementById("Name").value;
  const Username = document.getElementById("Username").value;
  const Password = document.getElementById("Password").value;
  const ConfirmPassword = document.getElementById("Confirm-Password").value;

  if (Password !== ConfirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Passwords don't match!",
    });
    return;
  }

  if (localStorage.getItem(Username)) {
    Swal.fire({
      icon: 'error',
      title: 'Email Already Registered',
      text: 'This email is already registered!',
    });
    return;
  }

  const newUser = {
    Name: Name,
    Username: Username,
    Password: Password,
  };

  localStorage.setItem(Username, JSON.stringify(newUser));
  
  Swal.fire({
    icon: 'success',
    title: 'Account Created!',
    text: 'Please login to continue',
  }).then(() => {
    window.location.href = "Login.html";
  });
}

document.getElementById("Sign-in-Form").onsubmit = signin;