$(document).ready(function () {

fetch('/auth/allevents',{method: 'GET'})
  .then(response => response.json())
  .then (data => {
    renderEvents(data);
  }).catch(error => {
    console.error('Error',error);
  });
  // fetch('/auth/testing',{method:"GET"})
  // .then(response => response.json())
  // .then(data => {
  //   alert(data);
  // }).catch(error =>{
  //   alert(error);
  // })


  // fetch('/auth/allEvents,', {method:'Post'})
  //  .then(response => response.json())
  // .then(data => {
  //   alert(data);
  // }).catch(error =>{
  //   alert(error);
  // })



function renderEvents (events){
  document.getElementById("display".innerHTML ="",)

  const divcontainer = document.createElement("div");
  events.forEach(async obj =>{
    const info = ` 
          <table class="table table-striped table-hover" id="bookingTable">
            <thead>
              <tr>
                <th>${obj.departureDate}</th>
                <td>${obj.departureFrom}</td>
                <td>${obj.departureTo}</td>
                <td>${obj.departureTime}</td>
              </tr>
            </thead> 
            <tbody id="bookingTableBody"> 
            </tbody>
          </table>
              `;
        const infocontainer = document.createElement("div");
        infocontainer.innerHTML = info;
        divcontainer.append(infocontainer);
  });

  document.getElementById("display").append(divcontainer);
}


$('#confirmButton').click(function () {
   const departureId = $('#trainID').val();
    const departureDate = $('#departureDate').val();
    const departureFrom = $('#departureFrom').val();
    const departureTo = $('#departureTo').val();
    const departureTime = $('#departureTime').val();
  

    if (!departureDate || !departureFrom || !departureTo || !departureTime) {
      alert('All fields must be filled out');
    } else {
      const formData = new FormData();
      formData.append('departureId', departureId);
      formData.append('departureDate', departureDate);
      formData.append('departureFrom', departureFrom);
      formData.append('departureTo', departureTo);
      formData.append('departureTime', departureTime);

      fetch('/auth/trainInfo', {
        method: 'POST',
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.status == 'success') {
            alert(`Proceed to booking`);

            window.location.href = 'http://127.0.0.1:3000/booking.html';
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

  


});