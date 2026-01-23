// Toggle password visibility
function setupPasswordToggle() {
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
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', setupPasswordToggle);

function login(event) {
  event.preventDefault();

  const Email = document.getElementById("Email").value;
  const Password = document.getElementById("Password").value;
  const storedUser = localStorage.getItem(Email);

  if (!storedUser) {
    Swal.fire({
      icon: 'error',
      title: 'User Not Found',
      text: 'Please check your Email or sign-in first',
    });
    return;
  }

  const userData = JSON.parse(storedUser);
  if (userData.Password !== Password) {
    Swal.fire({
      icon: 'error',
      title: 'Wrong Password',
      text: 'Please try again or reset your password',
    });
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(userData));
  
  Swal.fire({
    icon: 'success',
    title: 'Login Successful!',
    showConfirmButton: false,
    timer: 1500
  }).then(() => {
    window.location.href = "index.html";
  });
}

document.getElementById("Log-in-Form").onsubmit = login;