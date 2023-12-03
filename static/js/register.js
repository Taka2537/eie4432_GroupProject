$(document).ready(function () {
  $('#register').click(function () {
    const username = $('#username').val();
    const password = $('#password').val();
    const repeatpassword = $('#repeatPassword').val();
    const role = 'user';

    if (!username || !password) {
      alert('Username and password cannot be empty');
      return;
    }

    if (password !== repeatpassword) {
      alert('Password mismatch!');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('role', role);

    fetch('/auth/register', {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.status == 'success') {
          alert(`Welcome,${username}!` + `\n` + `You can login with your account now!`);
          window.location.href = '/login.html';
        } else if (result.status == 'failed') {
          alert(result.message);
        } else {
          alert('Unknown error');
        }
      })

      .catch(function (error) {
        console.log('Request failed', error);
      });
  });
});
