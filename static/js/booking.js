$(document).ready(function () {

  const urlParams = new URLSearchParams(window.location.search);

  const departureId = urlParams.getAll('departureId');
  const departureDate = urlParams.getAll('departureDate');
  const departureFrom = urlParams.getAll('departureFrom');
  const departureTo = urlParams.getAll('departureTo');
  const departureTime = urlParams.getAll('departureTime');

  const bookingTableBody = $('#bookingTableBody');

  $('#logoutButton').click(function (event) {


    // Perform payment processing here...
    // Assuming the payment is successful, show the success message and redirect
    alert('Logged out successfully');
    window.location.href = 'index.html';
  });

$('#selectButton').click(function () {
    const numberOfAdults = document.getElementById('numberOfAdults').value;
    const numberOfChildren = document.getElementById('numberOfChildren').value;

    localStorage.setItem('Number_Of_Adults', numberOfAdults);
    localStorage.setItem('Number_Of_Children', numberOfChildren);
   
    const totalAdults = parseInt(numberOfAdults);
    const totalChildren = parseInt(numberOfChildren);
    const totalPassengers = totalAdults + totalChildren;

    localStorage.setItem('Total_Passengers', totalPassengers);

    window.location.href = 'reserve.html';
  });

  for (let i = 0; i < departureId.length; i++) {
    const row = `
      <tr>
        <td>${departureId[i]}</td>
        <td>${departureDate[i]}</td>
        <td>${departureFrom[i]}</td>
        <td>${departureTo[i]}</td>
        <td>${departureTime[i]}</td>
      </tr>
    `;
    bookingTableBody.append(row);
  }
});