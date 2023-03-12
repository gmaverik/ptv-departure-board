console.log('Custom Javascript Loaded');
// console.log(test);
var userStation = 1016 //prompt("Station Id", 1016);
var userPlatform = 1 //prompt("Platform Number", 1);

//file version 115.a

const urlQuery = window.location.search
const splitUrlQuery = urlQuery.split("/")
if(splitUrlQuery[0] == "?data")
{
  userPlatform = splitUrlQuery[2]
  userStation = splitUrlQuery[1]
}

// console.log(`${urlQuery}\n${splitUrlQuery}\n${urlStation}\n${urlPlatform}`)

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

function arrayIncludeDisplay(stopId, stopName, iterator) // Departure Stop List fill function 
{
  if(isNaN(totalStops) == true)
  {
    console.log("");  // Put Large 'Not in service' text in the centre of stopping list
  }
  else
  {

  if(terminus != true)
  {
    if(totalStops >= 22)
    {
      if(stopsArray.includes(stopId) == true)
      {
        document.getElementById('stopList'+ iterator).innerHTML = stopName;
        document.getElementById('stopList'+ iterator).style.fontSize = "100%";
      }
      else 
      {
        document.getElementById('stopList'+ iterator).innerHTML = "---";
        document.getElementById('stopList'+ iterator).style.fontSize = "100%";
      };
    }
    else if(totalStops >= 11)
    {
      if(iterator >= 7) iterator += 1;
      if(iterator >= 15) iterator += 1;
      if(stopsArray.includes(stopId) == true)
      {
        document.getElementById('stopList'+ iterator).innerHTML = stopName;
        document.getElementById('stopList'+ iterator).style.fontSize = "100%";
      }
      else 
      {
        document.getElementById('stopList'+ iterator).innerHTML = "---";
        document.getElementById('stopList'+ iterator).style.fontSize = "100%";
      }
    }
    else
    {
      if(iterator >= 5) iterator += 3;
      if(iterator >= 13) iterator += 3;
      if(stopsArray.includes(stopId) == true)
      {
        document.getElementById('stopList'+ iterator).innerHTML = stopName;
        document.getElementById('stopList'+ iterator).style.fontSize = "150%";
      }
      else 
      {
        document.getElementById('stopList'+ iterator).innerHTML = "---";
        document.getElementById('stopList'+ iterator).style.fontSize = "150%";
      };
    }
  }
  if(stopId == destinationStop)
  {
    terminus = true;
  };

  };
  // console.log(terminus);
};

function clearDepartureBoard() // Clears the Departure Stop Board 
{
  terminus = false;
  for (let i = 0; i < 21; i++)
  {
    document.getElementById('stopList'+ i).innerHTML = " ";
  };
};

function isCityLoop(terminus) // Checks if service is a city loop service or a direct to flinders street service
{
  if(stopsArray.includes(1155 || 1120 || 1068))
  {
      if(terminus == 1155 || 1120 || 1068)
      {
        return false;
      }
      else if(terminus == 1071 && stopsArray.includes(1155 || 1120 || 1068))
      {
        return true;
      }
      else
      {
        return;
      }
  }
};

const ptv = require('ptv-api');
const devId = (keys.DEVELOPERID);
const apiKey = (keys.APIKEY);
var stopsArray = new Array();
var mainDest;
let a;
let time;
var terminus = false;
var line_name;
var stopping_list = [];
var depArray = [];
var directionId;
var directionName;
var stationArrayIndex;
var stoppingListArray = new Array();
var totalStops;
ptvClient = ptv(devId, apiKey);

// console.log(stops[1012]);
// console.log(alameinLine);

setInterval(() => {

  a = new Date();
  h = a.getHours();
  m = a.getMinutes();
  if(h > 12) h = h - 12;
  if(m < 10) m = "0" + m;
  if(h == 24 || 0) h = "12";
  time = h + ':' + m;
  document.getElementById('time').innerHTML = time;

   // Main Departure Destination
  ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
  }).then(res => {
    mainDeparturePlatform = res.body.departures[0].platform_number;
    mainDepartureDest = res.body.departures[0].direction_id;
    mainDepartureRunRef = res.body.departures[0].run_ref;
    line_id = res.body.departures[0].route_id; // Which line it runs on
    // console.log(res.body.departures[0].route_id)

    // console.log(line_id);

    switch(line_id) {
      case 1: line_name = "alameinLine"; stopping_list = alameinLine;
        break;
      case 2: line_name = "belgraveLine"; stopping_list = belgraveLine;
        break;
      case 3: line_name = "craigieburnLine"; stopping_list = craigieburnLine;
        break;
      case 4: line_name = "cranbourneLine"; stopping_list = cranbourneLine;
        break;
      case 5: line_name = "merndaLine"; stopping_list = merndaLine;
        break;
      case 6: line_name = "frankstonLine"; stopping_list = frankstonLine;
        break;
      case 7: line_name = "glenWaverlyLine"; stopping_list = glenWaverlyLine;
        break;
      case 8: line_name = "hurstbridgeLine"; stopping_list = hurstbridgeLine;
        break;
      case 9: line_name = "lilydaleLine"; stopping_list = lilydaleLine;
        break;
      case 11: line_name = "pakenhamLine"; stopping_list = pakenhamLine;
        break;  
      case 12: line_name = "sandringhamLine"; stopping_list = sandringhamLine;
        break;
      case 13: line_name = "stonyPointLine"; stopping_list = stonyPointLine;
        break;
      case 14: line_name = "sunburyLine"; stopping_list = sunburyLine;
        break;
      case 15: line_name = "upfieldLine"; stopping_list = upfieldLine;
        break;
      case 16: line_name = "werribeeLine"; stopping_list = werribeeLine;
        break;
      case 17: line_name = "williamstownLine"; stopping_list = williamstownLine;
        break;
      case 1482: line_name = "showgroundsRacecourseLine"; stopping_list = showgroundsRacecourseLine;
        break;
    }

    // console.log(line_name);

    var mainSTD = new Date(res.body.departures[0].scheduled_departure_utc);
    document.getElementById('mainSTD').innerHTML = date_toTime(mainSTD);
  
    var mainDepartureEstiTime = new Date(res.body.departures[0].estimated_departure_utc);    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
    }).then(res => {
      if(res.body.departures[0].at_platform == true)
      {
        document.getElementById('mainETD').innerHTML = "now";
      }
      else
      {
        if(date_toUntil(mainDepartureEstiTime, mainSTD) == 0) document.getElementById('mainETD').innerHTML = "now";
        else
        {
          document.getElementById('mainETD').innerHTML = date_toUntil(mainDepartureEstiTime, mainSTD) + " min";
        }
      };
    }).catch(console.error);
      
    ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [mainDepartureRunRef], route_type: 0 });
    }).then(res => {
      destinationStop = res.body.departures[res.body.departures.length-1].stop_id;
            
            // console.log(mainDest);
            // console.log(destinationStop);

            ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [mainDepartureRunRef], route_type: 0,  });
            }).then(res => {
  
              depArray = [res.body.departures];
              depArray.sort(function(a, b){return a.departure_sequence - b.departure_sequence});
              stopsArray.length = 0;
              stoppingListArray.length = 0;
              for (let i = 0; i < depArray[0].length; i++) 
              {
                  stopsArray.push(depArray[0][i].stop_id);
              };
              directionId = res.body.departures[0].direction_id
              // console.log(directionId);
              if(directionId == 1)
              {
                directionName = "up";
              }
              else
              {
                directionName = "down";
              }
              // console.log("The user direction is: " + directionName)
              // console.log(stopsArray[stopsArray.length-1])
              if(directionName == "up")
              {
                totalStops = destArrayIndex-stationArrayIndex;
              }
              else
              {
                totalStops = stationArrayIndex;
              }
              // console.log(totalStops);

              // stopping_list = line_name
              // console.log(stationArrayIndex+1);
              // console.log(depArray[0].length-stationArrayIndex-3);
              // console.log(userStation);

              // console.log(Object.keys(stopping_list).length)

              for (let j = 0; j < Object.keys(stopping_list).length; j++) { 
                if(stopping_list[j].stationId == userStation)
                {
                  stationArrayIndex = j;
                  // console.log("The user station is: " + stopping_list[j].stationName);
                  break;
                }
                // console.log("The user station is located at array index: " + stationArrayIndex);
              }

              for (let q = 0; q < Object.keys(stopping_list).length; q++) { 
                if(stopping_list[q].stationId == destinationStop)
                {
                  destArrayIndex = q;
                  // console.log("The user station is: " + stopping_list[j].stationName);
                  break;
                }
                
                // console.log("The user station is located at array index: " + stationArrayIndex);
              }
              console.log(totalStops)
              // stoppingListArray.length = 0;
              if(directionName == "up")
              {
                for (let k = stationArrayIndex + 1; k < Object.keys(stopping_list).length; k++) {
                  stoppingListArray.push([stopping_list[k].stationId, stopping_list[k].stationName])
                }
              }
              else if(directionName == "down")
              {
                // for (let k = stationArrayIndex - 1; k < Object.keys(stopping_list).length; k--) {
                //   stoppingListArray.push([stopping_list[k].stationId, stopping_list[k].stationName])
                // }
                for (let m = stationArrayIndex - 1; m >= 0; m--) {
                  stoppingListArray.push([stopping_list[m].stationId, stopping_list[m].stationName])
                }
                // for (let l = stationArrayIndex - 1; l < stationArrayIndex; l--) {
                //   stoppingListArray.push([stopping_list[l].stationId, stopping_list[l].stationName])
                // }
                // console.log(line_id)
                // console.log(line_name)
                // console.log(stopping_list)
              }

              // console.log(stoppingListArray);



              // console.log(stopping_list[6].stationId == userStation);


              clearDepartureBoard();
              // console.log(stoppingListArray.length)
              for (let o = 0; o < stoppingListArray.length; o++) {
                fixedArray = stoppingListArray[o]
                arrayIncludeDisplay(fixedArray[0], fixedArray[1], o)
                // console.log(o)
                // console.log("iterator: " + o)
                // console.log("id: " + stoppingListArray[o])
                // console.log(fixedArray[0])
                // console.log("name: " + stoppingListArray[m].stationName)
              }

              

              // arrayIncludeDisplay(1092, 0); // Heathmont
              // arrayIncludeDisplay(1163, 1); // Ringwood
              // arrayIncludeDisplay(1091, 2); // Heatherdale
              // arrayIncludeDisplay(1128, 3); // Mitcham
              // arrayIncludeDisplay(1148, 4); // Nunawading
              // arrayIncludeDisplay(1023, 5); // Blackburn
              // arrayIncludeDisplay(1111, 6); // Laburnum
              // arrayIncludeDisplay(1026, 7); // Box Hill
              // arrayIncludeDisplay(1129, 8); // Mont Albert
              // arrayIncludeDisplay(1189, 9); // Surrey Hills
              // arrayIncludeDisplay(1037, 10); // Chatham
              // arrayIncludeDisplay(1033, 11); // Canterbury
              // arrayIncludeDisplay(1057, 12); // East Camberwell
              // arrayIncludeDisplay(1032, 13); // Camberwell
              // arrayIncludeDisplay(1012, 14); // Auburn
              // arrayIncludeDisplay(1080, 15); // Glenferrie
              // arrayIncludeDisplay(1090, 16); // Hawthorn
              // arrayIncludeDisplay(1030, 17); // Burnley
              // arrayIncludeDisplay(1059, 18); // East Richmond
              // arrayIncludeDisplay(1162, 19); // Richmond
              // arrayIncludeDisplay(1071, 20); // Flinders Street

              ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [destinationStop], route_type: 0 });
            }).then(res => {
  
              // console.log(res.body.stop.stop_name)
              if(isCityLoop(destinationStop) == true)
              {
                document.getElementById('mainTerm').innerHTML = "City Loop";
                mainDest = "City Loop ";
              }
              if(res.body.stop.stop_name == "Parliament ")
              {
                document.getElementById('mainTerm').innerHTML = "Flinders Street ";
                mainDest = "Flinders Street ";
              }
              else
              {
                document.getElementById('mainTerm').innerHTML = res.body.stop.stop_name;
                mainDest = res.body.stop.stop_name;
              };
              // console.log(mainDest);
    
            }).catch(console.error);


            }).catch(console.error);

}).catch(console.error);

}).catch(console.error);


// Sub0 Departure Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
}).then(res => {
  
    sub0DepartureRunRef = res.body.departures[1].run_ref;
    //console.log("mainDepartureRunRef = " + mainDepartureRunRef);

    var sub0DepartureShedTime = new Date(res.body.departures[1].scheduled_departure_utc);
    document.getElementById('subSTD0').innerHTML = date_toTime(sub0DepartureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub0DepartureEstiTime = new Date(res.body.departures[1].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepartureEstiTime));
    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
  }).then(res => {
    
    //console.log(res.body.departures[0].at_platform)
    if(res.body.departures[1].at_platform == true)
    {
      document.getElementById('subETD0').innerHTML = "now";
    }
    else{
      document.getElementById('subETD0').innerHTML = date_toUntil(sub0DepartureEstiTime, sub0DepartureShedTime) + " min";
    };
    
  }).catch(console.error);


      ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [sub0DepartureRunRef], route_type: 0 });
      }).then(res => {

          //console.log("routeLength = " + res.body.departures.length);
          sub0DestinationStop = res.body.departures[res.body.departures.length-1].stop_id;
          //console.log("finalDestinationId = " + destinationStop)
          
            ptvClient.then(apis => { return apis.Runs.Runs_ForRun({  run_id: [sub0DepartureRunRef] });
            }).then(res => {
              if(res.body.runs[0].express_stop_count == 0)
              { 
                document.getElementById('subServ0').innerHTML = 'Stops All';
              }
              // else if(res.body.runs[0].express_stop_count == 1)
              // { 
              //   document.getElementById('subServ0').innerHTML = 'Not Stopping at N/a';
              // }
              else
              { 
                if(isCityLoop(sub0DestinationStop) == true)
                {
                  document.getElementById('subServ0').innerHTML = 'Ltd Express Via Richmond';
                }
                else
                {
                  document.getElementById('subServ0').innerHTML = 'Ltd Express';
                };
              };

            }).catch(console.error);

            ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [sub0DestinationStop], route_type: 0 });
            }).then(res => {
              
              if(isCityLoop(sub0DestinationStop) == true)
              {
                document.getElementById('subTerm0').innerHTML = "City Loop";
                sub0Dest = "City Loop ";
              }
              if(res.body.stop.stop_name == "Parliament ")
              {
                document.getElementById('subTerm0').innerHTML = "Flinders Street ";
                sub0Dest = "Flinders Street ";
              }
              else
              {
                document.getElementById('subTerm0').innerHTML = res.body.stop.stop_name;
                sub0Dest = res.body.stop.stop_name;
              };

              // if(res.body.stop.stop_name == "Parliament ")
              // {
              //   document.getElementById('subTerm0').innerHTML = "Flinders Street (p)";
              //   sub0Dest = "Flinders Street ";
              // }
              // else
              // {
              //   document.getElementById('subTerm0').innerHTML = res.body.stop.stop_name;
              //   sub0Dest = res.body.stop.stop_name;
              // };              
              //console.log("finalDestinationName = " + res.body.stop.stop_name)
    
            }).catch(console.error);


      }).catch(console.error);

}).catch(console.error);



// Sub1 Departure Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
}).then(res => {
  
    sub1DepartureRunRef = res.body.departures[2].run_ref;
    //console.log("mainDepartureRunRef = " + mainDepartureRunRef);

    var sub1DepartureShedTime = new Date(res.body.departures[2].scheduled_departure_utc);
    document.getElementById('subSTD1').innerHTML = date_toTime(sub1DepartureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub1DepartureEstiTime = new Date(res.body.departures[2].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepartureEstiTime));
    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
  }).then(res => {
    
    //console.log(res.body.departures[0].at_platform)
    if(res.body.departures[2].at_platform == true)
    {
      document.getElementById('subETD1').innerHTML = "now";
    }
    else
    {
      document.getElementById('subETD1').innerHTML = date_toUntil(sub1DepartureEstiTime, sub1DepartureShedTime) + " min";
    };
    
  }).catch(console.error);


      ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [sub1DepartureRunRef], route_type: 0 });
      }).then(res => {

          //console.log("routeLength = " + res.body.departures.length);
          sub1DestinationStop = res.body.departures[res.body.departures.length-1].stop_id;
          //console.log("finalDestinationId = " + destinationStop)

          ptvClient.then(apis => { return apis.Runs.Runs_ForRun({  run_id: [sub1DepartureRunRef] });
        }).then(res => {
          //console.log(res.body.runs[0].express_stop_count)
          if(res.body.runs[0].express_stop_count == 0)
          { 
            document.getElementById('subServ1').innerHTML = 'Stops All';
          }
          // else if(res.body.runs[0].express_stop_count == 1)
          // { 
          //   document.getElementById('subServ1').innerHTML = 'Not Stopping at N/a';
          // }
          else
          { 
            if(isCityLoop(sub1DestinationStop) == true)
            {
              document.getElementById('subServ1').innerHTML = 'Ltd Express Via Richmond';
            }
            else
            {
              document.getElementById('subServ1').innerHTML = 'Ltd Express';
            };
          };
  
          }).catch(console.error);

            ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [sub1DestinationStop], route_type: 0 });
            }).then(res => {
  
              if(isCityLoop(sub1DestinationStop) == true)
              {
                document.getElementById('subTerm1').innerHTML = "City Loop";
                sub1Dest = "City Loop ";
              }
              if(res.body.stop.stop_name == "Parliament ")
              {
                document.getElementById('subTerm1').innerHTML = "Flinders Street ";
                sub1Dest = "Flinders Street ";
              }
              else
              {
                document.getElementById('subTerm1').innerHTML = res.body.stop.stop_name;
                sub1Dest = res.body.stop.stop_name;
              };

              // if(res.body.stop.stop_name == "Parliament ")
              // {
              //   document.getElementById('subTerm1').innerHTML = "Flinders Street (p)";
              //   sub1Dest = "Flinders Street ";
              // }
              // else
              // {
              //   document.getElementById('subTerm1').innerHTML = res.body.stop.stop_name;
              //   sub1Dest = res.body.stop.stop_name;
              // };              
              //console.log("finalDestinationName = " + res.body.stop.stop_name)
    
            }).catch(console.error);
            

      }).catch(console.error);

}).catch(console.error);



// Sub2 Departure Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
}).then(res => {
  
    sub2DepartureRunRef = res.body.departures[3].run_ref;
    //console.log("mainDepartureRunRef = " + mainDepartureRunRef);

    var sub2DepartureShedTime = new Date(res.body.departures[3].scheduled_departure_utc);
    document.getElementById('subSTD2').innerHTML = date_toTime(sub2DepartureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub2DepartureEstiTime = new Date(res.body.departures[3].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepartureEstiTime));
    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: [userStation], max_results: 4, platform_numbers: [userPlatform] });
  }).then(res => {
    
    //console.log(res.body.departures[0].at_platform)
    if(res.body.departures[3].at_platform == true)
    {
      document.getElementById('subETD2').innerHTML = "now";
    }
    else{
      document.getElementById('subETD2').innerHTML = date_toUntil(sub2DepartureEstiTime, sub2DepartureShedTime) + " min";
    };
    
  }).catch(console.error);


      ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [sub2DepartureRunRef], route_type: 0 });
      }).then(res => {

          //console.log("routeLength = " + res.body.departures.length);
          sub2DestinationStop = res.body.departures[res.body.departures.length-1].stop_id;
          //console.log("finalDestinationId = " + destinationStop)

            ptvClient.then(apis => { return apis.Runs.Runs_ForRun({  run_id: [sub2DepartureRunRef] });
            }).then(res => {

              if(res.body.runs[0].express_stop_count == 0)
              { 
                document.getElementById('subServ2').innerHTML = 'Stops All';
              }
              // else if(res.body.runs[0].express_stop_count == 1)
              // { 
              //   document.getElementById('subServ2').innerHTML = 'Not Stopping at N/a';
              // }
              else
              { 
                if(isCityLoop(sub2DestinationStop) == true)
                {
                  document.getElementById('subServ2').innerHTML = 'Ltd Express Via Richmond';
                }
                else
                {
                  document.getElementById('subServ2').innerHTML = 'Ltd Express';
                };
              };

            }).catch(console.error);

            ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [sub2DestinationStop], route_type: 0 });
            }).then(res => {
              
              if(isCityLoop(sub2DestinationStop) == true)
              {
                document.getElementById('subTerm2').innerHTML = "City Loop";
                sub2Dest = "City Loop ";
              }
              if(res.body.stop.stop_name == "Parliament ")
              {
                document.getElementById('subTerm2').innerHTML = "Flinders Street ";
                sub2Dest = "Flinders Street ";
              }
              else
              {
                document.getElementById('subTerm2').innerHTML = res.body.stop.stop_name;
                sub2Dest = res.body.stop.stop_name;
              };

              // if(res.body.stop.stop_name == "Parliament ")
              // {
              //   document.getElementById('subTerm2').innerHTML = "Flinders Street (p)";
              //   sub2Dest = "Flinders Street ";
              // }
              // else
              // {
              //   document.getElementById('subTerm2').innerHTML = res.body.stop.stop_name;
              //   sub2Dest = res.body.stop.stop_name;
              // };              
              //console.log("finalDestinationName = " + res.body.stop.stop_name)
    
            }).catch(console.error);

      }).catch(console.error);

}).catch(console.error);

console.log("Refreshed!");
}, 1000);
