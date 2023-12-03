$(document).ready(function () {
  $('#logout').click(function () {
    fetch('/auth/me')
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.status == 'success') {
          $('h4').text(`Welcome back! ${result.user.username} (${result.user.role})`);
          $('#logout').css('display', 'block');
        } else if (result.status == 'failed') {
          alert('Please login');
          window.close('http://127.0.0.1:3000/booking.html');
          window.redirect('http://127.0.0.1:3000/login.html');
        }
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });

    const confirmLogout = confirm('Confirm to logout?');
    if (confirmLogout) {
      fetch('/auth/logout', {
        method: 'POST',
      })
        .then(function (response) {
          if (response.status === 200) {
            window.location.href = 'http://127.0.0.1:3000/login.html';
            alert('Logged out successfully');
          } else {
            alert('Logout failed. Please try again.');
          }
        })
        .catch(function (error) {
          console.error('Logout request failed', error);
          alert('An error occurred during logout. Please try again.');
        });
    }
  });

  // Function to handle login
   $('#login').click(function () {
    const username = $('#username').val();
    const password = $('#password').val();

    if (!username || !password) {
      alert('Username and password cannot be empty');
    } else {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      fetch('/auth/login', {
        method: 'POST',
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.status == 'success') {
            alert(`Logged in successfully`);

            // Check the user role
            const role = result.user.role;

            if (role === 'admin') {
              // Redirect to events.html for admin
              window.location.href = 'http://127.0.0.1:3000/events.html';
            } else if (role === 'user') {
              // Redirect to booking.html for user
              window.location.href = 'http://127.0.0.1:3000/booking.html';
            } else {
              alert('Unknown user role');
            }
          } else if (result.status == 'failed') {
            alert(result.message);
          } else {
            alert('Unknown error');
          }
        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
    }
  });


  // Function to check if a remembered username exists and set the value in the input field
  function checkRememberedUsername() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');

    if (rememberedUsername) {
      $('#username').val(rememberedUsername);
    }
  }

  // Check if a remembered username exists when the page loads
  checkRememberedUsername();
});
