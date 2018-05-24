$(window).on('load', function() {

  // listens to see if #countryfile id changes to update #providencefile
  $('#countryfile').on('change', function() {
    console.log('country id has changed!');
    const country = $('#country').val();
    if ( country === "United States") {
      $.get('../stylesheets/states.txt', function(data2) {
        $('#providencefile').html(data2);
      })
    } else {
      $('#providencefile').html('');
      $('#providencefile').html("<input class='width' id='providence' type='text' placeholder='England' />") ;
    }  
  })

// reads and displays country options to html
  function readTextFile() {
    $.get('../stylesheets/countries.txt', function(data) {
      $('#countryfile').html(data);

    $.get('../stylesheets/states.txt', function(data2) {
      $('#providencefile').html(data2);
    })
    })
  }

  // modal generator RModal.js for sample options
  var modal = new RModal(document.getElementById('modal'), {
    // built-in options
    afterClose: function() {
      setTimeout(function() {
        $('#removefadeOut').removeClass('animated fadeIn fadeOut');
      }, 1500);
    }, 
    bodyClass: 'modal-open',
    dialogClass: 'modal-dialog',
    dialogOpenClass: 'animated fadeIn',
    dialogCloseClass: 'animated fadeOut'
  });

  // adding new packages to the database
  function AddPackage(event) {
    event.preventDefault();

    const fixingDate = new Promise(function(resolve, reject) {
      let month = $('input[id="month"]').val();
      let day = $('input[id="day"]').val();
      let year = $('#year').val();

      // unfixed checks
      if (month > 12 || month < 1) {
          reject('This MONTH isn\'t possible');
      } else if (day > 31 || day < 1) {
          reject('This DAY isn\'t possible');
      } else {
        // passed resolve function
        createDate(resolve);
      }
      
      // fixable checks
      function createDate(fixed) {
        if (month.length !== 2) {
          month = '0' + $('input[id="month"]').val();
        } 
        if (day.length !== 2) {
          day = '0' + $('input[id="month"]').val();
        }
        const newdate = JSON.stringify(year + "-" + month + "-" + day);
        // fixed === resolve()
        fixed(newdate);
      }
    });


    const submitData = function() {
      let officialDate = "";

      // promise to fix potential errors client-side
      fixingDate.then(function(data) {
        officialDate = data;
        // works, console.log('this is the data results from promise ' + officialDate);
      }).then(function() {

        const packageInfo = {
          'packageStatus': $('input[name="seized"]:checked').val(),
          'courier': $('input[name="courierService"]:checked').val(),
          'country': $('#country').val(),      
          'providence': $('#providence').val(),
          'agent': $('#agent').val(),
          'packageSize': $('#packageSize').val(),
          'dateArrived': officialDate
        }
  
        // posts inputted data after checks passed
        $.ajax({
          type: 'POST',
          url: '/users/add',
          data: packageInfo,
          dataType: 'JSON'
        }).done(function(responsedata) {
          alert(responsedata.msg);
          if (responsedata.msg === 'Info was saved successfully!') {
            $('#add').html('Thank you for your contribution! Only 1 package per 24 hours is allowed to limit spam');
          }  {
            return;
          }
        })
      }).catch(function(data) {
        alert(data);
      })
    }
    submitData();
  }

  $('#btnAddPackage').on('click', AddPackage);
  
  window.modal = modal;
  readTextFile();
});
