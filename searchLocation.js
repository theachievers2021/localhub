const input = document.getElementById("searchTextField");

function initialize() {
  var options = {
    types: ["(cities)"],
    componentRestrictions: {
      country: "ro",
    },
  };

  var autocomplete = new google.maps.places.Autocomplete(input, options);
}

google.maps.event.addDomListener(window, "load", initialize);
