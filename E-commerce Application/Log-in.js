function login(event) {
  event.preventDefault();

  const UserName = document.getElementById("Username").value;
  const Password = document.getElementById("Password").value;
  const storedUser = localStorage.getItem(UserName);

  if (!storedUser) {
    Swal.fire({
      icon: 'error',
      title: 'User Not Found',
      text: 'Please check your username or sign-in first',
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

