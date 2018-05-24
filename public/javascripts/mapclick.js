$(window).on('load', function() {
  $('.usa').on('click', function(event) {
    event.preventDefault();
    const countryid = event.target.alt;
    const stateid = event.target.id;

    // working fine
    // console.log('will the state id display? ' + stateid);
    
    const stateInfo = {
      'country': countryid,
      'providence': stateid
    }

    $('#providenceTitle').text((stateInfo.providence).toUpperCase());
    $('#providenceBody').html('');

    // opening modal and displaying firebase results for that state/providence
    $.ajax({
      type: 'POST',
      url: '/info',
      data: stateInfo,
      dataType: 'JSON'
    }).done(function(data) {
      const dataArray = data.msg;
      console.log('returned data: ' + JSON.stringify(dataArray));
      // console.log('this is the data array length ' + dataArray.length);

      function runtest(data) {
        for (i=0; i<data.length; i++) {
          let seized1 = data[i].seized;
          let agent1 = data[i].agent;
          let courier1 = data[i].courier;
          let dateArrived1 = data[i].dateArrived;
          let packageSize1 = `${data[i].packageSize} Kg`;
          const nulltext =  '<div class="redtext">no info shared</div>';

          if (data[i].seized === "") {
            seized1 = nulltext;
          }  
          if (data[i].agent === "") {
            agent1 = nulltext;
          }  
          if (data[i].courier === "") {
            courier1 = nulltext;
          }  
          if (data[i].dateArrived == "") {
            dateArrived1 = nulltext;
          }  
          if (data[i].packageSize === "") {
            packageSize1 = nulltext;
          }

          let x = 1 + i;
          let test = `<div class="container modalbackground 0${x}"><div class='row'><br/><div class="col-md-6 bold">Seized:</div> <div class="col-md-4">${seized1}</div></div>`;
            test += `<div class='row'><div class="col-md-6 bold">Agent Used: </div> <div class="col-md-4">${agent1}</div></div>`
            test += `<div class='row'><div class="col-md-6 bold">Courier Service: </div> <div class="col-md-4">${courier1}</div></div>`
            test += `<div class='row'><div class="col-md-6 bold">Arrival Date: </div> <div class="col-md-4">${dateArrived1}</div></div>`
            test += `<div class='row'><div class="col-md-6 bold">Package Size: </div> <div class="col-md-4">${packageSize1} </div><br/></div></div>`;

          $('.modal-body span').append(
            `<br />${test}`
          )
        }
      }

      if (dataArray === 'There is nothing here') {
        $('.modal-body span').append(
          `<br /><div class="margins">${dataArray}</div>`
        )
      } else {
        runtest(dataArray);
      }
      // this should go after the ajax request
      modal.open();
    })
  // end of the map click function
  })
});