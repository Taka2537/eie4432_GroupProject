$(document).ready(function () {
  $('#cancelButton').click(function () {
    // Clear localStorage when cancel button is clicked
    localStorage.clear();

    // Redirect back to booking.html
    window.location.href = 'booking.html';
  });
  $('#confirmButton').click(function (event) {

    alert('Payment successful');
    window.location.href = 'booking.html';
  });

  

  // Check trip type and show/hide return trip details accordingly
  

  // Retrieve stored choices from local storage
  // const departure = localStorage.getItem('Departure_Location');
  // const destination = localStorage.getItem('Destination');
  // const departureDate = localStorage.getItem('Departure_Date');
  // const departureTime = localStorage.getItem('Departure_Time');
  // const returnDate = localStorage.getItem('Return_Date');
  // const returnTime = localStorage.getItem('Return_Time');
  // const returnLocation = localStorage.getItem('Return_Location');
  // const returnDestination = localStorage.getItem('Return_Destination');
  // // Retrieve other stored values similarly...

  // // Use the retrieved values to populate the payment page
  // document.getElementById('departureDate').textContent = `Departure Date: ${departureDate}`;
  // document.getElementById('departureLocation').textContent = `Departure Location: ${departure}`;
  // document.getElementById('destinationInfo').textContent = `Destination: ${destination}`;
  // document.getElementById('departureTime').textContent = `Departure Time: ${departureTime}`;
  // document.getElementById('returnDate').textContent = `Return Date: ${returnDate}`;
  // document.getElementById('returnTime').textContent = `Return Time: ${returnTime}`;
  // document.getElementById('returnLocation').textContent = `Return Location: ${returnLocation}`;
  // document.getElementById('returnDestination').textContent = `Return Destination: ${returnDestination}`;
  // // Update other elements as needed...

  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};

    for (const [key, value] of urlParams) {
      params[key] = value;
    }

    return params;
  }

  // Retrieve URL parameters
  const urlParams = getUrlParams();

  const selectedSeats = [];
  for (const param in urlParams) {
    if (param.startsWith('seat')) {
      selectedSeats.push(urlParams[param]);
    }
  }

  const selectedSeatText = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected';
  $('#selectedSeatText').text(`Selected Seats: ${selectedSeatText}`);

  // Calculate and update total price
  const premiumSeatPrice = parseInt(urlParams.premiumSeatPrice) || 0;
  const normalSeatPrice = parseInt(urlParams.normalSeatPrice) || 0;
  const premiumSeatsCount = parseInt(urlParams.premiumSeatsCount) || 0;
  const normalSeatsCount = parseInt(urlParams.normalSeatsCount) || 0;
  const totalPrice = premiumSeatPrice * premiumSeatsCount + normalSeatPrice * normalSeatsCount;
  $('#totalPrice').text(`Total: $${totalPrice}`);
});
