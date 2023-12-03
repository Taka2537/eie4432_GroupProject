$(document).ready(function () {
  // Function to check if the user is logged in
    $('#nonLoginButton').click(function (event) {

    alert('Please login first');
    window.location.href = 'login.html';
  });
  function isLoggedIn() {
    return new Promise(function (resolve, reject) {
      fetch('/auth/me')
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.status == 'success') {
            resolve(true); // User is logged in
          } else {
            resolve(false); // User is not logged in
          }
        })
        .catch(function (error) {
          console.log('Request failed', error);
          reject(error);
        });
    });
  }

  // Event listener for the "Make a Booking" link
  $('a[href="booking.html"]').click(function (event) {
    // Check if the user is logged in
    isLoggedIn()
      .then(function (loggedIn) {
        if (!loggedIn) {
          event.preventDefault(); // Prevent the default action of the link
          alert('Please log in to make a booking.'); // Show an alert to prompt the user to log in
        }
      })
      .catch(function (error) {
        console.error('Error checking login status', error);
        // Handle error if necessary
      });
  });
});
