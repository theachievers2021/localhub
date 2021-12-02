let myLocation = navigator.geolocation;

const addLocationButton = document.getElementById("addLocationButton");
const addLocationForm = document.getElementById("addLocationForm");

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
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });
  const resp = await response.json();
  console.log(resp);
  let docs = resp.response.docs;
  let locationName = [];
  let locationWeb = [];
  for (let i = 0; i < docs.length; i++) {
    locationName.push(docs[i]["name"][0]);
    locationWeb.push(docs[i]["web"][0]);
  }

  let locationNameAndWeb = {
    name: locationName,
    web: locationWeb,
  };
  console.log("L AND W:", locationNameAndWeb);
  console.log("este:", locationNameAndWeb.name.length);
  const lineUp = document.getElementById("line-up");
  for (let i = 0; i < locationNameAndWeb.name.length; i++) {
    //console.log(locationNameAndWeb.name[i]);
    //console.log(locationNameAndWeb.web[i]);

    const locationCard = document.createElement("div");
    const locationNameP = document.createElement("p");
    const locationWebP = document.createElement("p");
    const contentLocationName = document.createTextNode(
      locationNameAndWeb.name[i]
    );
    const contentLocationWeb = document.createTextNode(
      locationNameAndWeb.web[i]
    );
    locationNameP.appendChild(contentLocationName);
    locationWebP.appendChild(contentLocationWeb);
    locationCard.appendChild(locationNameP);
    locationCard.appendChild(locationWebP);
    lineUp.appendChild(locationCard);
  }
}

function addNewLocation(data) {
  fetch("https://orase.peviitor.ro/api/localhub/add_info/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "*/*",
      Connection: "keep - alive",
    },
    body: JSON.stringify(data),
    //   id: "fbc9f3a8-8600-4bea-93f2-257e737ec5bb",
    //   location_id: "Cluj-Napoca, Cluj, judet Cluj",
    //   name: ["gazul"],
    //   web: ["https://www.eon.ro/contact"],
    //   contact: ["0265 200 366"],
    //   details: "gaz la retea",
    // }),
  });
}

addLocationForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const nameForm = formData.get("nameForm");
  const webForm = formData.get("webForm");
  const contactForm = formData.get("contactForm");
  const detailsForm = formData.get("detailsForm");

  const id1 = "fbc9f3a8-8600-4bea-93f2-257e737ec5bn";
  const locationID = "Cluj-Napoca, Cluj, judet Cluj";
  const data = [
    {
      id: id1,
      location_id: locationID,
      name: [nameForm],
      web: [webForm],
      contact: [contactForm],
      details: [detailsForm],
    },
  ];

  console.log(data);

  await addNewLocation(data);

  // for (var value of formData.values()) {
  //   console.log(value);
  // }
});
