let myLocation = navigator.geolocation;

const addLocationButton = document.getElementById("addLocationButton");
const addLocationForm = document.getElementById("addLocationForm");

let idGeneral = "";

myLocation.getCurrentPosition(success, failure);
function success(position) {
  let myLat = position.coords.latitude;
  let myLong = position.coords.longitude;

  console.log("Lat: " + myLat + " Long: " + myLong);

  var coords = new google.maps.LatLng(myLat, myLong);

  var mapOptions = {
    zoom: 14,
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
  let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });
  const resp = await response.json();
  console.log("URL-UL este:", url);

  const locationParse = resp.results[0].address_components[2].long_name.split(
    " "
  );

  const city = locationParse[0];
  console.log("Current city:", city);

  // const countyParse = resp.results[0].address_components[4].long_name.split(
  //   " "
  // );

  const countyParse = resp.results[7].address_components[0].long_name.split(
    " "
  );
  // console.log("Mere:", countrySperCaMerge[1]);

  console.log("Resp:", resp);
  console.log(resp.results[0].address_components);
  console.log("CountyParse:", countyParse);
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
  idGeneral = id;
  localHubInfo(id);
}

async function localHubInfo(id) {
  const encodedid = encodeURI(id);

  let url = `https://orase.peviitor.ro/api/localhub/get_info/?id=%22${encodedid}%22`;
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });
  const resp = await response.json();
  let docs = resp.response.docs;
  let locationName = [];
  let locationWeb = [];
  let locationId = [];
  for (let i = 0; i < docs.length; i++) {
    if (docs[i]["name"]) {
      locationName.push(docs[i]["name"][0]);
    } else {
      locationName.push(null);
    }
    if (docs[i]["web"]) {
      locationWeb.push(docs[i]["web"][0]);
    } else {
      locationWeb.push(null);
    }
    if (docs[i]["id"]) {
      locationId.push(docs[i]["id"]);
    } else {
      locationId.push(null);
    }
  }

  let locationNameWebId = {
    name: locationName,
    web: locationWeb,
    id: locationId,
  };
  console.log("Name and Web:", locationNameWebId);
  console.log("Lungime lista este:", locationNameWebId.name.length);
  const mainContent = document.getElementById("main_content");
  const numeServiciiLoc = document.createElement("h1");
  const numeServicii = document.createTextNode(idGeneral);
  numeServiciiLoc.appendChild(numeServicii);
  mainContent.appendChild(numeServiciiLoc);
  const lineUp = document.getElementById("line-up");

  for (let i = 0; i < locationNameWebId.name.length; i++) {
    //console.log(locationNameAndWeb.name[i]);
    //console.log("Aici web e:", locationNameAndWeb.web[i]);

    const locationCard = document.createElement("div");
    const locationNameP = document.createElement("p");
    const locationWebP = document.createElement("p");
    const linkLocationWeb = document.createElement("a");
    const deleleteButton = document.createElement("button");
    deleleteButton.type = "button";
    deleleteButton.innerHTML = `<i class="ion-android-delete"></i>`;
    deleleteButton.className = "deleteBtn-styled large_icon";
    //deleleteButton.onclick = deleteLocation(locationNameWebId.id[i]);
    deleleteButton.addEventListener("click", async function (event) {
      event.preventDefault();
      console.log("SUNT APASAT CU CODUL", locationNameWebId.id[i]);
      deleteLocation(locationNameWebId.id[i]);
    });

    console.log(i, locationNameWebId.id[i]);
    const contentLocationName = document.createTextNode(
      locationNameWebId.name[i]
    );

    locationNameP.appendChild(contentLocationName);
    locationCard.appendChild(locationNameP);
    // const deleleteButton = createDeleteButton(locationNameWebId.id[i]);
    // deleleteButton.onclick = console.log(
    //   "SUNT APASAT CU CODUL",
    //   locationNameWebId.id[i]
    // );

    locationCard.appendChild(deleleteButton);

    if (locationNameWebId.web[i]) {
      const contentLocationWeb = document.createTextNode(
        locationNameWebId.web[i]
      );
      locationCard.appendChild(linkLocationWeb);
      //locationWebP.appendChild(contentLocationWeb);
      locationCard.href = locationNameWebId.web[i];
      //console.log("Link:", locationCard.href);
    }
    locationCard.appendChild(locationWebP);

    lineUp.appendChild(locationCard);
  }
}

async function deleteLocation(id) {
  await fetch(`https://orase.peviitor.ro/api/localhub/delete/?id=${id}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "*/*",
      Connection: "keep - alive",
    },
  });
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

function generateGUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

addLocationForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const nameForm = formData.get("nameForm");
  const webForm = formData.get("webForm");
  const contactForm = formData.get("contactForm");
  const detailsForm = formData.get("detailsForm");
  const socialForm = formData.get("socialForm");
  const gpsForm = formData.get("gpsForm");

  const id1 = generateGUID();
  const data = [
    {
      id: id1,
      location_id: idGeneral,
      name: [nameForm],
      web: [webForm],
      social: [socialForm],
      contact: [contactForm],
      details: [detailsForm],
      gpsForm: [gpsForm],
    },
  ];

  console.log(data);

  await addNewLocation(data);
  closeForm();

  // for (var value of formData.values()) {
  //   console.log(value);
  // }
});
