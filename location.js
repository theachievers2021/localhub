
let x = navigator.geolocation;
    
x.getCurrentPosition(success, failure);
function success(position)

{
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;

    console.log("Lat:", myLat);
    console.log("Long:", myLong);

    var coords = new google.maps.LatLng(myLat,myLong);

    var mapOptions = {

        zoom:11,
        center: coords,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker = new google.maps.Marker({map:map, position:coords});	

    getCityName(myLat,myLong);
}

function failure(){ }

//success();


            async function getCityName(lat, long){
                  const APIkEY="AIzaSyBELu7088a2UQnTlvSw4KZOp2f3yXUengc";
                  let url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key="+APIkEY;
                  console.log(url);
                  const response=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${APIkEY}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "*/*"
                        }
                    })
                      console.log("aici");
                
                      const resp=await response.json();
                      console.log(resp);
                      const city=resp.results[0].address_components[2].long_name;
                      console.log(city);

                      const county=resp.results[0].address_components[4].long_name;
                      console.log(county);
                      const justCounty=county.split(" ");
                      const judet=justCounty[1];
                      console.log(judet);
                      getId(city,judet);

                  }
                //   getCityName(myLat,myLong);

                async function getId(city, county){
                    let url=`https://orase.peviitor.ro/id/?localitate=%22${city}%22&judet=%22${county}%22`;
                    const response=await fetch(url,
                    {
                        method: "GET",
                        headers: {
                            Accept: "*/*"
                        }
                    })
                      console.log("aici");
                      const resp=await response.json();
                      const id=resp.id;
                      //console.log(id);
                      localHubInfo(id);
                }

                async function localHubInfo(id){
                    const encodedid=encodeURI(id);
                    console.log(encodedid);
                    let url=`https://orase.peviitor.ro/api/localhub/get_info/?id=%22${encodedid}%22`;
                    console.log(url);
                    const response=await fetch(url,
                    {
                        method: "GET",
                        headers: {
                            Accept: "*/*"
                        }
                    })
                      console.log("aici");
                      const resp=await response.json();
                      console.log(resp);
                      //const id=resp.id;
                      //console.log(id);

                }
       