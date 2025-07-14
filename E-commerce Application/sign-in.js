function signin(event) {
  event.preventDefault();

  const Name = document.getElementById("Name").value;
  const UserName = document.getElementById("Username").value;
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

  if (localStorage.getItem(UserName)) {
    Swal.fire({
      icon: 'error',
      title: 'Username Taken',
      text: 'This username already exists!',
    });
    return;
  }

  const newUser = {
    Name: Name,
    UserName: UserName,
    Password: Password,
  };

  localStorage.setItem(UserName, JSON.stringify(newUser));
  
  Swal.fire({
    icon: 'success',
    title: 'Account Created!',
    text: 'Please login to continue',
  }).then(() => {
    window.location.href = "Login.html";
  });
}

document.getElementById("Sign-in-Form").onsubmit = signin;

