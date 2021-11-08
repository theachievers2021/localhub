let myLocation = navigator.geolocation;

myLocation.getCurrentPosition(success, failure);
function success(position) {
  let myLat = position.coords.latitude;
  let myLong = position.coords.longitude;

  console.log("Lat: " + myLat + " Long: " + myLong);

  var coords = new google.maps.LatLng(myLat, myLong);

  var mapOptions = {
    zoom: 11,
    center: coords,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var marker = new google.maps.Marker({ map: map, position: coords });

  getCityName(myLat, myLong);
}
function failure() {}

//success();

async function getCityName(lat, long) {
  const apiKey = "AIzaSyBELu7088a2UQnTlvSw4KZOp2f3yXUengc";

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    }
  );
  const resp = await response.json();
  //console.log("Response from GoogleApi", resp);
  const locationParse = resp.plus_code.compound_code.split(",");
  const cityParse = locationParse[0].split(" ");
  const city = cityParse[1];

  console.log("Current city:", city);

  const countyParse = resp.results[0].address_components[4].long_name.split(
    " "
  );
  const county = countyParse[1];
  console.log("Current county:", county);
  getId(city, county);
}

async function getId(city, county) {
  let url = `https://orase.peviitor.ro/id/?localitate=%22${city}%22&judet=%22${county}%22`;
  //console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });

  const resp = await response.json();
  const id = resp.id;
  console.log("ID:", id);
  localHubInfo(id);
}

async function localHubInfo(id) {
  const encodedid = encodeURI(id);
  //console.log(encodedid);
  let url = `https://orase.peviitor.ro/api/localhub/get_info/?id=%22${encodedid}%22`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });
  const resp = await response.json();
  console.log("Resp:", resp);
}
