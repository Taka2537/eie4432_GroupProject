$(document).ready(function () { 
  fetch('/auth/test',{method: 'GET'})
  .then(response => response.json())
  .then (data => {
    //renderEvents(data);
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


  fetch('/auth/allEvents,', {method:'Post'})
   .then(response => response.json())
  .then(data => {
    alert(data);
  }).catch(error =>{
    alert(error);
  })



function renderEvents (events){
  document.getElementById("display".innerHTML ="",)

  const divcontainer = document.createElement("div");
  events.forEach(async obj =>{
    const info = ` 
        <div class="py-4">
          <h5 class="form-label">Train Schedule</h5>
          <table class="table table-striped table-hover" id="bookingTable">
            <thead>
              <tr>
                <th>Departure Date: ${obj.departureDate}</th>
                <th>Departure From: ${obj.departureFrom}</th>
                <th>Departure To: ${obj.departureTo}</th>
                <th>Departure Time ${obj.departureTime}</th>
              </tr>
            </thead> 
            <tbody id="bookingTableBody"> 
            </tbody>
          </table>
        </div> `;
        const infocontainer = document.createElement("div");
        infocontainer.innerHTML = info;
        divcontainer.append(infocontainer);
  });

  document.getElementById("display").append(divcontainer);
}

});