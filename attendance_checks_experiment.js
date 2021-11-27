function LoadInfo(){
    /* Get Date, Time, Location */
    sessionStorage.setItem("startTime", performance.now());
    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth();
    var year = todaydate.getFullYear();
    var datestring = day + "/" + month + "/" + year;
    var timeString = todaydate.toLocaleTimeString();

    document.getElementById('txtDate').value = datestring;
    document.getElementById('txtTime').value = timeString;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        var location = document.getElementById("txtLocation");
        location.value = "Geolocation is not supported by this browser.";
    }


    /* For session   */
    var status = sessionStorage.getItem("attd_status");                                             // Get current session status

    if (status == null){
        sessionStorage.setItem("attd_status", "standby");                                           // Create a new session onload if status is null
    }
    else if (status == "in"){
        document.getElementById('btnChecks').value = 'Check-out';                                   // Display "Check-out" on button when session status is "in"
        
        document.getElementById('alert_Notice').style.display = "block";                            // Pop out for notice check-in timing
        document.getElementById('notice_Message').innerHTML = sessionStorage.getItem("check_in");   // Display check-in timing
    }
    else if (status == "out"){
        document.getElementById('btnChecks').value = 'Check-in';                                    // Display "Check-in" on button when session status is "out"
    }
    
}

function showPosition(position) {
    var location = document.getElementById("txtLocation");
    
    /* This shit need credit card for Google's API key _|_ 
    var address = getReverseGeocodingData(position.coords.latitude, position.coords.longitude);
    location.value = address  
    */
    
    location.value = position.coords.latitude + " : " + position.coords.longitude
}

function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng },  (results, status) =>{
        if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            var address = (results[0].formatted_address);
        }
    });
}

function showPreview(event){
    if(event.target.files.length > 0){
        document.getElementById("btnChecks").disabled = false;	                                        // Enable Button when image is uploaded
        
        var getImagePath = URL.createObjectURL(event.target.files[0]);
        document.getElementById('img_Preview').style.backgroundImage = "url(" + getImagePath + ")";     // Set the preview image
        document.getElementById('img_Preview').style.border = "2px solid #5e8488";                      // Set the border stlye
        
        //Make random shit inside the box invisible (but still workable)
        document.getElementById('img_Upload').style.opacity = "0";
        document.getElementById('upload_Icon').style.opacity = "0";
        document.getElementById('upload_Drop').style.opacity = "0";
    }
}

function btnClick(){
    var x = document.getElementById('btnChecks').value
    var status = sessionStorage.getItem("attd_status"); 

    if(status == "standby"  || status == "out"){    //Checking-in
        document.getElementById('img_Preview').style.backgroundImage = "none";           // Remove the image preview (background-image)
        document.getElementById('img_Preview').style.border = "none";                    // Reset the outder border
        
        //Make the random shit visible
        document.getElementById('img_Upload').style.opacity = "1";
        document.getElementById('upload_Icon').style.opacity = "1";
        document.getElementById('upload_Drop').style.opacity = "1";

        document.getElementById("btnChecks").disabled = true;                           // Disable button
        document.getElementById('btnChecks').value  = 'Check-out';                      // Change to Check-out

        document.getElementById('alert_Success_in').style.display = "block";            // Pop up check-in success

        sessionStorage.setItem("attd_status", "in");                                    // Set status to "in"
        sessionStorage.setItem("check_in", document.getElementById('txtTime').value);   // Save the timed in a session

    }
    else if(status == "in"){                                                            // Checking-out
        var r = confirm("Confirm Check-out");                                           // Confirmation window

        if (r == true){
            document.getElementById('img_Preview').style.backgroundImage = "none";       // Remove the image preview (background-image)
            document.getElementById('img_Preview').style.border = "none";                // Reset the outder border
            
            //Make the random shit visible
            document.getElementById('img_Upload').style.opacity = "1";
            document.getElementById('upload_Icon').style.opacity = "1";
            document.getElementById('upload_Drop').style.opacity = "1";
    
            document.getElementById("btnChecks").disabled = true;                        // Disable button
            document.getElementById('btnChecks').value  = 'Check-in';                    // Change to Check-in
    
            document.getElementById('alert_Success_out').style.display = "block";        // Pop out check-out success

            sessionStorage.setItem("attd_status", "out");                                // Set status to "out"
            sessionStorage.removeItem('check_in');                                       // Destroy the check-in session
        }
    }
    //Add alert for timing
    var endtime = performance.now();
    console.log(endtime);
    var timetaken = endtime - parseFloat(sessionStorage.getItem('startTime'));
    console.log(timetaken);
    alert(timetaken);
}

function closeFunction(val){
    if(val == 1){            // Closing Check-in alert trigger
        document.getElementById('alert_Success_in').style.display = "none";
    }
    else if(val == 2){      // Closing Check-out alert trigger
        document.getElementById('alert_Success_out').style.display = "none";
    }
    else if(val == 3){      /// Closing notice alert trigger
        document.getElementById('alert_Notice').style.display = "none";
    }
    else if(val == 4){      // Closing help pop-up
        document.getElementById("atdncheck-help").style.display = "none";
        document.getElementById("close-atdn-help").style.display = "none";
    }
    else if(val == 5){      // Open help pop-up
        document.getElementById("atdncheck-help").style.display = "block";
        document.getElementById("close-atdn-help").style.display = "block";
    }
}
