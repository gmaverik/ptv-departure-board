console.log('Custom Javascript Loaded');
var CryptoJS = require("crypto-js");

const devId = (keys.DEV_ID);
const apiKey = (keys.API_KEY);

var userStation = 1071;
var userPlatform = 1;
var primaryRequest;
var runRef0, runRef1, runRef2, runRef3, runRef4;
var primaryRequest;
var sorted = [];
var departureList = [];
var stoppingList = [];
var j = 0;
var currentRunRef = 000000;
var burnBar = document.getElementById("burning-bar");
var moving = false;


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
    userStationName =  stations[j].stationName;
    break;
  }
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

function id_toName(id)
{
  for (let m = 0; m < Object.keys(stations).length; m++) { 
    if(stations[m].stationId == id)
    {
      return stations[m].stationName;
    }
  }
};

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

  primaryRequest = "/v3/departures/route_type/0/stop/"+ userStation +"?platform_numbers=" + userPlatform + "&max_results=1000&expand=all" + "&devid=" + devId;

(async function() {
  const response = await fetch("http://timetableapi.ptv.vic.gov.au" + primaryRequest + "&signature=" + CryptoJS.HmacSHA1(primaryRequest, apiKey).toString());
  const json = await response.json();
  // console.info("http://timetableapi.ptv.vic.gov.au" + primaryRequest + "&signature=" + CryptoJS.HmacSHA1(primaryRequest, apiKey).toString())
  primaryResponse = json;
  userStationName = primaryResponse.stops[userStation].stop_name;
  for (let i = 0; i < Object.keys(primaryResponse).length; i++) { // avoids any service with a direction id of 99 (City Loop), they break the system
    if(primaryResponse.departures[i].direction_id != 99)
    {
      sorted[j] = i;
      j++;
    }
  };
// console.log(primaryResponse.stops[userStation].stop_name)
  // for (let j = 0; j < Object.keys(stations).length; j++) { 
  //   if(primaryResponse.stops[j].stop_id == userStation)
  //   {
  //     userStationName =  primaryResponse.stops[j].stop_name;   // console.log("The user station is: " + stopping_list[j].stationName);
  //     break;
  //   }
  //   // console.log("The user station is located at array index: " + stationArrayIndex);
  // }

  // console.log(Object.keys(primaryResponse).length);
  runRef0 = primaryResponse.departures[sorted[0]].run_ref;
  runRef1 = primaryResponse.departures[sorted[1]].run_ref;
  runRef2 = primaryResponse.departures[sorted[2]].run_ref;
  runRef3 = primaryResponse.departures[sorted[3]].run_ref;
  runRef4 = primaryResponse.departures[sorted[4]].run_ref;

  dest0 = primaryResponse.runs[runRef0].destination_name;
  dest1 = primaryResponse.runs[runRef1].destination_name;
  dest2 = primaryResponse.runs[runRef2].destination_name;
  dest3 = primaryResponse.runs[runRef3].destination_name;
  dest4 = primaryResponse.runs[runRef4].destination_name;
// console.log(runRef0);
  sched0 = new Date(primaryResponse.departures[sorted[0]].scheduled_departure_utc);
  sched1 = new Date(primaryResponse.departures[sorted[1]].scheduled_departure_utc);
  sched2 = new Date(primaryResponse.departures[sorted[2]].scheduled_departure_utc);
  sched3 = new Date(primaryResponse.departures[sorted[3]].scheduled_departure_utc);
  sched4 = new Date(primaryResponse.departures[sorted[4]].scheduled_departure_utc);

  est0 = new Date(primaryResponse.departures[sorted[0]].estimated_departure_utc);
  est1 = new Date(primaryResponse.departures[sorted[1]].estimated_departure_utc);
  est2 = new Date(primaryResponse.departures[sorted[2]].estimated_departure_utc);
  est3 = new Date(primaryResponse.departures[sorted[3]].estimated_departure_utc);
  est4 = new Date(primaryResponse.departures[sorted[4]].estimated_departure_utc);

  if(primaryResponse.runs[runRef0].express_stop_count >= 1) run0service = "Express"; else run0service = "Stops All";
  if(primaryResponse.runs[runRef1].express_stop_count >= 1) run1service = "Express"; else run1service = "Stops All";
  if(primaryResponse.runs[runRef2].express_stop_count >= 1) run2service = "Express"; else run2service = "Stops All";
  if(primaryResponse.runs[runRef3].express_stop_count >= 1) run3service = "Express"; else run3service = "Stops All";
  if(primaryResponse.runs[runRef4].express_stop_count >= 1) run4service = "Express"; else run4service = "Stops All";

  if(currentRunRef != runRef0)
  {
    console.log("New Service Detected");
    currentRunRef = runRef0;
    moving = false;
    document.getElementById("burning-bar").style.width = "0%";
    secondaryRequest = "/v3/pattern/run/" + currentRunRef + "/route_type/0/?expand=all&stop_id=" + userStation + "&include_skipped_stops=true" + "&devid=" + devId;

    (async function() {
      const response = await fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest, apiKey).toString());
      const json = await response.json();
      // console.info("http://timetableapi.ptv.vic.gov.au" + primaryRequest + "&signature=" + CryptoJS.HmacSHA1(primaryRequest, apiKey).toString())
      secondaryResponse = json;
      departureList = secondaryResponse.departures;
      stoppingList = [];
      departureList.sort(function(a, b){return a.departure_sequence - b.departure_sequence}); 


      for (let o = 0; o < departureList.length; o++)
      {
        if(departureList[o].stop_id == userStation)
        {
          departureList.splice(0, o+1);
        };
      };

      for (let k = 0; k < departureList.length; k++) { 
        if(departureList[k].skipped_stops.length != 0)
        {
          stoppingList.push(id_toName(departureList[k].stop_id));
          for (let l = 0; l < departureList[k].skipped_stops.length; l++) 
          {
           stoppingList.push("----");
          };
        }
        else
        {
          stoppingList.push(id_toName(departureList[k].stop_id))
        };
      }
      console.log(stoppingList);


    })();

  }

  else
  {
  
  };


  // console.log(primaryResponse)

  // secondaryRequest0 = "/v3/pattern/run/"+ runRef0 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  // secondaryRequest1 = "/v3/pattern/run/"+ runRef1 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  // secondaryRequest2 = "/v3/pattern/run/"+ runRef2 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  // secondaryRequest3 = "/v3/pattern/run/"+ runRef3 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;
  // secondaryRequest4 = "/v3/pattern/run/"+ runRef4 + "/route_type/0?expand=all&include_skipped_stops=true&devid=" + devId;

  console.log('Refreshed');
      console.log
      (
        `Mock transport passenger information display\t\t\t\t\t\t\t\t\t\tMaverik Grassby\n` +
        `Built using Public transport victorias API\n` +
        `\n` +
        `${userStationName} Station\t\t\t\t\t\tNext Departures\t\t\t\t\t\tT${clockNow24}\n` +
        `${date_toTime(sched0)}\t${dest0}\t${date_toUntil(est0, sched0)}\t${run0service} Via \n` +
        `${date_toTime(sched1)}\t${dest1}\t${date_toUntil(est1, sched1)}\t${run1service}\n` +
        `${date_toTime(sched2)}\t${dest2}\t${date_toUntil(est2, sched2)}\t${run2service}\n` +
        `${date_toTime(sched3)}\t${dest3}\t${date_toUntil(est3, sched3)}\t${run3service}\n` +
        `${date_toTime(sched4)}\t${dest4}\t${date_toUntil(est4, sched4)}\t${run4service}\n`
      );

      // if(date_toUntil(est0, sched0) <= 1)
      // {
      //   if(moving == false)
      //   {
      //     move()
      //     moving = true;
      //   }
      // };

})();

}, 1000);


// comRequest2 = "/v3/pattern/run/"+ runRef1 + "/route_type/0?expand=all&devid=" + devId;

// fetch("https://timetableapi.ptv.vic.gov.au" + comRequest2 + "&signature=" + CryptoJS.HmacSHA1(comRequest2, apiKey).toString())
//   .then((response) => response.json())
//   .then((json) => console.log(json));;



// Promise.all([
//   fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest0 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest0, apiKey).toString()),
//   fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest1 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest1, apiKey).toString()),
//   fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest2 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest2, apiKey).toString()),
//   fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest3 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest3, apiKey).toString()),
//   fetch("http://timetableapi.ptv.vic.gov.au" + secondaryRequest4 + "&signature=" + CryptoJS.HmacSHA1(secondaryRequest4, apiKey).toString())

// ]).then(allResponses => {
//   Promise.all([
//     allResponses[0].json(),
//     allResponses[1].json(),
//     allResponses[2].json(),
//     allResponses[3].json(),
//     allResponses[4].json()

//   ]).then(data => {
//     // console.log(data[0]);
//     // console.log(data[1]);
//     // console.log(data[2]);
//     // console.log(data[3]);
//     // console.log(data[4]);
//      // DO THE THING HERE
//   }).catch(error => {
//     console.error(error);
//   });
// }).catch(error => {
//   console.error(error);
// });
