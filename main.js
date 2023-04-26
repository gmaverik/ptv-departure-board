console.log('Custom Javascript Loaded');
var CryptoJS = require("crypto-js");

const devId = (keys.DEV_ID);
const apiKey = (keys.API_KEY);

var userStation = 1071;
var userPlatform = 1;
var primaryRequest;
var runRef0, runRef1, runRef2, runRef3, runRef4;
var primaryRequest;


const urlQuery = window.location.search;
const splitUrlQuery = urlQuery.split("/");
if(splitUrlQuery[0] == "?data")
{
  userPlatform = splitUrlQuery[2];
  userStation = splitUrlQuery[1];
};

for (let j = 0; j < Object.keys(stations).length; j++) { 
  if(stations[j].stationId == userStation)
  {
    userStationName =  stations[j].stationName;   // console.log("The user station is: " + stopping_list[j].stationName);
    break;
  }
  // console.log("The user station is located at array index: " + stationArrayIndex);
}


function date_toTime(date) // Converts "YYYY-MM-DDTHH:MM:SSZ" to "HH:MM" (plus 24 to 12h time) 
{
  var h = date.getHours();
  var m = date.getMinutes();
  if(h > 12) h = h - 12;
  if(m < 10) m = "0" + m;
  if(h == 24 || 0) h = "12";
  return h + ":" + m;
};

function date_toUntil(date, schedTime)  // Gives an estimate for departure time 
{
  var now = new Date;
  if(date == "Thu Jan 01 1970 10:00:00 GMT+1000 (Australian Eastern Standard Time)") // Checks if no estimated time is given in api response
  {
    var difference = schedTime.getTime() - now.getTime(); // If so manually calculate remaining time until departure
  }
  else // If a estimated time is provided
  {
    var difference = date.getTime() - now.getTime(); // Calculate the remaining time until the estimated departure time
  };

  return Math.ceil(difference / 60000);
};


// var hash = CryptoJS.HmacSHA1(comRequest, apiKey);
// console.log("https://timetableapi.ptv.vic.gov.au" + comRequest + "&signature=" + hash.toString())


setInterval(() => {
  
  timeNow = new Date();
  hourNow = timeNow.getHours();
  hourNow24 = timeNow.getHours();
  minuteNow = timeNow.getMinutes();
  secondNow = timeNow.getSeconds();
  if(hourNow > 12) hourNow = hourNow - 12;
  if(hourNow == 0 || hourNow == 24) hourNow = 12;
  if(minuteNow < 10) minuteNow = "0" + minuteNow;
  if(secondNow < 10) secondNow = "0" + secondNow;
  if(hourNow24 < 10) hourNow24 = "0" + hourNow24;
  clockNow = `${hourNow}:${minuteNow}:${secondNow}`;
  clockNow24 = `${hourNow24}:${minuteNow}:${secondNow}`;
  // console.log(`T${hourNow24}${minuteNow}${secondNow}`);

  primaryRequest = "/v3/departures/route_type/0/stop/"+ userStation +"?platform_numbers=" + userPlatform + "&max_results=10000" + "&devid=" + devId;

(async function() {
  const response = await fetch("http://timetableapi.ptv.vic.gov.au" + primaryRequest + "&signature=" + CryptoJS.HmacSHA1(primaryRequest, apiKey).toString());
  const json = await response.json();
  // console.info("http://timetableapi.ptv.vic.gov.au" + primaryRequest + "&signature=" + CryptoJS.HmacSHA1(primaryRequest, apiKey).toString())
  primaryResponse = json;
  // console.log(primaryResponse);
  runRef0 = primaryResponse.departures[0].run_ref;
  runRef1 = primaryResponse.departures[1].run_ref;
  runRef2 = primaryResponse.departures[2].run_ref;
  runRef3 = primaryResponse.departures[3].run_ref;
  runRef4 = primaryResponse.departures[4].run_ref;

  sched0 = new Date(primaryResponse.departures[0].scheduled_departure_utc)
  sched1 = new Date(primaryResponse.departures[1].scheduled_departure_utc)
  sched2 = new Date(primaryResponse.departures[2].scheduled_departure_utc)
  sched3 = new Date(primaryResponse.departures[3].scheduled_departure_utc)
  sched4 = new Date(primaryResponse.departures[4].scheduled_departure_utc)

  est0 = new Date(primaryResponse.departures[0].estimated_departure_utc)
  est1 = new Date(primaryResponse.departures[1].estimated_departure_utc)
  est2 = new Date(primaryResponse.departures[2].estimated_departure_utc)
  est3 = new Date(primaryResponse.departures[3].estimated_departure_utc)
  est4 = new Date(primaryResponse.departures[4].estimated_departure_utc)

  secondaryRequest0 = "/v3/pattern/run/"+ runRef0 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  secondaryRequest1 = "/v3/pattern/run/"+ runRef1 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  secondaryRequest2 = "/v3/pattern/run/"+ runRef2 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  secondaryRequest3 = "/v3/pattern/run/"+ runRef3 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  secondaryRequest4 = "/v3/pattern/run/"+ runRef4 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;

  Promise.all([
    fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest0 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest0, apiKey).toString()),
    fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest1 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest1, apiKey).toString()),
    fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest2 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest2, apiKey).toString()),
    fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest3 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest3, apiKey).toString()),
    fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest4 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest4, apiKey).toString())

  ]).then(allResponses => {
    Promise.all([
      allResponses[0].json(),
      allResponses[1].json(),
      allResponses[2].json(),
      allResponses[3].json(),
      allResponses[4].json()

    ]).then(data => {
      // console.log(data[0]);
      // console.log(data[1]);
      // console.log(data[2]);
      // console.log(data[3]);
      // console.log(data[4]);
      secondaryResponse0 = data[0];
      secondaryResponse1 = data[1];
      secondaryResponse2 = data[2];
      secondaryResponse3 = data[3];
      secondaryResponse4 = data[4];
      // console.log(temp0);
      // console.log(temp1);
      // console.log(temp2);
      // console.log(temp3);
      // console.log(temp4);
      // console.log(secondaryResponse0.departures[0].scheduled_departure_utc);
      // console.log(secondaryResponse1)
      // console.log(secondaryResponse2)
      // console.log(secondaryResponse3)
      // console.log(secondaryResponse4)
      console.log('Refreshed');
      console.log
      (
        `Mock transport passenger information display\t\t\t\t\t\t\t\t\t\tMaverik Grassby\n` +
        `Built using Public transport victorias API\n` +
        `\n` +
        `${userStationName} Station\t\t\t\t\t\tNext Departures\t\t\t\t\t\tT${clockNow24}\n` +
        `${date_toTime(sched0)}\t${secondaryResponse0.runs[runRef0].destination_name}\t${date_toUntil(est0, sched0)}\n` +
        `${date_toTime(sched1)}\t${secondaryResponse1.runs[runRef1].destination_name}\t${date_toUntil(est1, sched1)}\n` +
        `${date_toTime(sched2)}\t${secondaryResponse2.runs[runRef2].destination_name}\t${date_toUntil(est2, sched2)}\n` +
        `${date_toTime(sched3)}\t${secondaryResponse3.runs[runRef3].destination_name}\t${date_toUntil(est3, sched3)}\n` +
        `${date_toTime(sched4)}\t${secondaryResponse4.runs[runRef4].destination_name}\t${date_toUntil(est4, sched4)}\n`
      )
      // console.log(`Run Reference : ${runRef0}, Destination : ${secondaryResponse0.runs[runRef0].destination_name}, Departure : ${date_toTime(sched0)}, Departing : ${date_toUntil(est0, sched0)}m`);
      // console.log(`Run Reference : ${runRef1}, Destination : ${secondaryResponse1.runs[runRef1].destination_name}, Departure : ${date_toTime(sched1)}, Departing : ${date_toUntil(est1, sched1)}m`);
      // console.log(`Run Reference : ${runRef2}, Destination : ${secondaryResponse2.runs[runRef2].destination_name}, Departure : ${date_toTime(sched2)}, Departing : ${date_toUntil(est2, sched2)}m`);
      // console.log(`Run Reference : ${runRef3}, Destination : ${secondaryResponse3.runs[runRef3].destination_name}, Departure : ${date_toTime(sched3)}, Departing : ${date_toUntil(est3, sched3)}m`);
      // console.log(`Run Reference : ${runRef4}, Destination : ${secondaryResponse4.runs[runRef4].destination_name}, Departure : ${date_toTime(sched4)}, Departing : ${date_toUntil(est4, sched4)}m`);




      
    }).catch(error => {
      console.error(error);
    });
  }).catch(error => {
    console.error(error);
  });

})();



}, 1000);


// comRequest2 = "/v3/pattern/run/"+ runRef1 + "/route_type/0?expand=all&devid=" + devId;

// fetch("https://timetableapi.ptv.vic.gov.au" + comRequest2 + "&signature=" + CryptoJS.HmacSHA1(comRequest2, apiKey).toString())
//   .then((response) => response.json())
//   .then((json) => console.log(json));;
