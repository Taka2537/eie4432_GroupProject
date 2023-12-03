$(document).ready(function () {
  const selectedSeats = []; // Array to store selected seats
  let selectedPremiumSeats = 0;
  let selectedNormalSeats = 0;
  const premiumSeatPrice = 320; // Replace this with the actual premium seat price
  const normalSeatPrice = 250; // Replace this with the actual normal seat price

  const totalAdults = parseInt(localStorage.getItem('Number_Of_Adults')) || 0;
  const totalChildren = parseInt(localStorage.getItem('Number_Of_Children')) || 0;
  const totalPassengers = totalAdults + totalChildren;

  // Function to handle seat selection
  function selectSeat(seat) {
    if ($(seat).hasClass('booked')) {
      // If the seat is already booked, do nothing
      return;
    }

    if ($(seat).hasClass('selected')) {
      // If the seat is already selected, unselect it
      $(seat).removeClass('selected');
      const index = selectedSeats.indexOf(seat.id);
      if (index !== -1) {
        selectedSeats.splice(index, 1); // Remove deselected seat from the array
      }
      // Update selected seat count based on seat type
      if ($(seat).hasClass('premium_seat')) {
        selectedPremiumSeats--;
      } else {
        selectedNormalSeats--;
      }
    } else {
      // Check if the total number of selected seats is less than the total passengers allowed
      if (selectedSeats.length < totalPassengers) {
        // Otherwise, select the seat
        $(seat).addClass('selected');
        selectedSeats.push(seat.id); // Add selected seat to the array
        // Update selected seat count based on seat type
        if ($(seat).hasClass('premium_seat')) {
          selectedPremiumSeats++;
        } else {
          selectedNormalSeats++;
        }
      }
    }

    updateDetails(); // Update details section
  }

  // Function to update details section
  function updateDetails() {
    let alphabeticallySortedSeats = selectedSeats.sort((a, b) => {
      const rowA = a.charAt(0);
      const rowB = b.charAt(0);
      const seatNumberA = parseInt(a.substring(1));
      const seatNumberB = parseInt(b.substring(1));

      if (rowA !== rowB) {
        return rowA.localeCompare(rowB);
      } else {
        return seatNumberA - seatNumberB;
      }
    });

    let message = 'Selected seats: ';
    if (alphabeticallySortedSeats.length === 0) {
      message += 'No seats selected';
    } else {
      message += alphabeticallySortedSeats.join(', ');
    }
    $('#selectedSeatText').html(message);

    updateSelectedSeatsUI(); // Update seat count and price
  }

  // Function to update selected seat count and price UI
  function updateSelectedSeatsUI() {
    $('#selectedPremiumSeats').html(
      `Premium Seats: ${selectedPremiumSeats} ($${selectedPremiumSeats * premiumSeatPrice})`
    );
    $('#selectedNormalSeats').html(`Normal Seats: ${selectedNormalSeats} ($${selectedNormalSeats * normalSeatPrice})`);

    // Update total price
    const totalPrice = selectedPremiumSeats * premiumSeatPrice + selectedNormalSeats * normalSeatPrice;
    $('#totalPrice').text(`Total: $${totalPrice}`);
  }

  // Initialize details section when the page loads
  updateDetails();

  // Event listener for clicking on seats
  $('.premium_seat, .seat').click(function () {
    selectSeat(this);
  });

  $('#proceedToPaymentBtn').click(function () {
    // Construct the query parameters string
    let queryParams = '';

    // Encode each piece of selected seat info as separate query parameters
    selectedSeats.forEach(function (seatId, index) {
      queryParams += `&seat${index + 1}=${seatId}`;
    });

    // Add counts and prices as separate query parameters
    queryParams += `&premiumSeatsCount=${selectedPremiumSeats}`;
    queryParams += `&normalSeatsCount=${selectedNormalSeats}`;
    queryParams += `&premiumSeatPrice=${premiumSeatPrice}`;
    queryParams += `&normalSeatPrice=${normalSeatPrice}`;

    // Redirect to payment.html with query parameters
    window.location.href = `payment.html?${queryParams}`;
  });
});
