//const input = document.getElementById("searchTextField");
const inputLocatie = document.getElementById("searchTextFieldLocatie");
const buttonLocatie = document.getElementById("searchButtonLocatie");

// function initialize() {
//   var options = {
//     types: ["(cities)"],
//     componentRestrictions: {
//       country: "ro",
//     },
//   };

//   var autocomplete = new google.maps.places.Autocomplete(input, options);
// }

// google.maps.event.addDomListener(window, "load", initialize);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// buttonLocatie.addEventListener("submit", async function (event) {
//   event.preventDefault();
//   await getLocation();
// });

async function getLocation() {
  console.log("INPUT ESTE", capitalizeFirstLetter(inputLocatie.value));
  const searchedLocation = capitalizeFirstLetter(inputLocatie.value);
  const encodedLocatie = encodeURI(searchedLocation);
  let url = `https://orase.peviitor.ro/api/localitate/?nume=${encodedLocatie}`;
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });

  const resp = await response.json();
  //console.log(resp);
  const docs = resp.response.docs;
  let idFinal = "";
  console.log("Loc caut:", searchedLocation);
  for (let i = 0; i < docs.length; i++) {
    if (docs[i]["localitate"][0] == searchedLocation) {
      console.log(docs[i]["id"]);
      idFinal = docs[i]["id"];
    }
  }
  //const id = response.id;
  //console.log("ID locatie cautata:", id);
  localHubInfo(idFinal);
}

async function display() {
  const id = getLocation();
  console.log(id);
  await localHubInfo(id);
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
  const numeServicii = document.createTextNode(id);
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
