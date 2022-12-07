console.log('Custom Javascript Loaded');
const userStation = 1016 //prompt("Station Id", 1016);
const userPlatform = 1 //prompt("Platform Number", 1);

//file version 108.a

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

function arrayIncludeDisplay(stopId, iterator) // Departure Stop List fill function 
{
  if(terminus != true)
  {
    if(stopsArray.length >= 18)
    {
      if(stopsArray.includes(stopId) == true)
      {
        document.getElementById('stopList'+ iterator).innerHTML = stationNames[stopId];
      }
      else 
      {
        document.getElementById('stopList'+ iterator).innerHTML = "---";
      };
    }
    else
    {
      if(iterator >= 5) iterator += 2;
      if(iterator >= 10) iterator += 2;
      if(stopsArray.includes(stopId) == true)
      {
        document.getElementById('stopList'+ iterator).innerHTML = stationNames[stopId];
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

const ptv = require('ptv-api');
const devId = (keys.DEVELOPERID);
const apiKey = (keys.APIKEY);
var stopsArray = new Array();
var mainDest;
let a;
let time;
var terminus = false;
ptvClient = ptv(devId, apiKey);

// console.log(stops[1012]);

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
  ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userPlatform] });
  }).then(res => {
    mainDeparturePlatform = res.body.departures[0].platform_number;
    mainDepartureDest = res.body.departures[0].direction_id;
    mainDepartureRunRef = res.body.departures[0].run_ref;

    var mainSTD = new Date(res.body.departures[0].scheduled_departure_utc);
    document.getElementById('mainSTD').innerHTML = date_toTime(mainSTD);
  
    var mainDepartureEstiTime = new Date(res.body.departures[0].estimated_departure_utc);    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userPlatform] });
    }).then(res => {
      if(res.body.departures[0].at_platform == true)
      {
        document.getElementById('mainETD').innerHTML = "now";
      }
      else
      {
        document.getElementById('mainETD').innerHTML = date_toUntil(mainDepartureEstiTime, mainSTD) + " min";
      };
    }).catch(console.error);
      
    ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [mainDepartureRunRef], route_type: 0 });
    }).then(res => {
      destinationStop = res.body.departures[res.body.departures.length-1].stop_id;

            ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [destinationStop], route_type: 0 });
            }).then(res => {
  
              // console.log(res.body.stop.stop_name)
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
    
            }).catch(console.error);

            ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [mainDepartureRunRef], route_type: 0,  });
            }).then(res => {
  
              var depArray = [];
              var depArray = [res.body.departures];
              depArray.sort(function(a, b){return a.departure_sequence - b.departure_sequence});
              stopsArray.length = 0;
              for (let i = 0; i < depArray[0].length; i++) 
              {
                  stopsArray.push(depArray[0][i].stop_id);
              };
              // console.log(stopsArray[stopsArray.length-1])

              clearDepartureBoard();
              arrayIncludeDisplay(1092, 0); // Heathmont
              arrayIncludeDisplay(1163, 1); // Ringwood
              arrayIncludeDisplay(1091, 2); // Heatherdale
              arrayIncludeDisplay(1128, 3); // Mitcham
              arrayIncludeDisplay(1148, 4); // Nunawading
              arrayIncludeDisplay(1023, 5); // Blackburn
              arrayIncludeDisplay(1111, 6); // Laburnum
              arrayIncludeDisplay(1026, 7); // Box Hill
              arrayIncludeDisplay(1129, 8); // Mont Albert
              arrayIncludeDisplay(1189, 9); // Surrey Hills
              arrayIncludeDisplay(1037, 10); // Chatham
              arrayIncludeDisplay(1033, 11); // Canterbury
              arrayIncludeDisplay(1057, 12); // East Camberwell
              arrayIncludeDisplay(1032, 13); // Camberwell
              arrayIncludeDisplay(1012, 14); // Auburn
              arrayIncludeDisplay(1080, 15); // Glenferrie
              arrayIncludeDisplay(1090, 16); // Hawthorn
              arrayIncludeDisplay(1030, 17); // Burnley
              arrayIncludeDisplay(1059, 18); // East Richmond
              arrayIncludeDisplay(1162, 19); // Richmond
              arrayIncludeDisplay(1071, 20); // Flinders Street


            }).catch(console.error);

}).catch(console.error);

}).catch(console.error);


// Sub0 Departure Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userPlatform] });
}).then(res => {
  
    sub0DepartureRunRef = res.body.departures[1].run_ref;
    //console.log("mainDepartureRunRef = " + mainDepartureRunRef);

    var sub0DepartureShedTime = new Date(res.body.departures[1].scheduled_departure_utc);
    document.getElementById('subSTD0').innerHTML = date_toTime(sub0DepartureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub0DepartureEstiTime = new Date(res.body.departures[1].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepartureEstiTime));
    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userPlatform] });
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
              else
              { 
                document.getElementById('subServ0').innerHTML = 'Express';
              };

            }).catch(console.error);

            ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [sub0DestinationStop], route_type: 0 });
            }).then(res => {
  
              if(res.body.stop.stop_name == "Parliament ")
              {
                document.getElementById('subTerm0').innerHTML = "Flinders Street ";
                mainDest = "Flinders Street ";
              }
              else
              {
                document.getElementById('subTerm0').innerHTML = res.body.stop.stop_name;
                mainDest = res.body.stop.stop_name;
              };              
              //console.log("finalDestinationName = " + res.body.stop.stop_name)
    
            }).catch(console.error);


      }).catch(console.error);

}).catch(console.error);



// Sub1 Departure Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userPlatform] });
}).then(res => {
  
    sub1DepartureRunRef = res.body.departures[2].run_ref;
    //console.log("mainDepartureRunRef = " + mainDepartureRunRef);

    var sub1DepartureShedTime = new Date(res.body.departures[2].scheduled_departure_utc);
    document.getElementById('subSTD1').innerHTML = date_toTime(sub1DepartureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub1DepartureEstiTime = new Date(res.body.departures[2].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepartureEstiTime));
    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userPlatform] });
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
          else
          { 
            document.getElementById('subServ1').innerHTML = 'Express';
          };
  
          }).catch(console.error);

            ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [sub1DestinationStop], route_type: 0 });
            }).then(res => {
  
              if(res.body.stop.stop_name == "Parliament ")
              {
                document.getElementById('subTerm1').innerHTML = "Flinders Street ";
                mainDest = "Flinders Street ";
              }
              else
              {
                document.getElementById('subTerm1').innerHTML = res.body.stop.stop_name;
                mainDest = res.body.stop.stop_name;
              };              
              //console.log("finalDestinationName = " + res.body.stop.stop_name)
    
            }).catch(console.error);
            

      }).catch(console.error);

}).catch(console.error);



// Sub2 Departure Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userPlatform] });
}).then(res => {
  
    sub2DepartureRunRef = res.body.departures[3].run_ref;
    //console.log("mainDepartureRunRef = " + mainDepartureRunRef);

    var sub2DepartureShedTime = new Date(res.body.departures[3].scheduled_departure_utc);
    document.getElementById('subSTD2').innerHTML = date_toTime(sub2DepartureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub2DepartureEstiTime = new Date(res.body.departures[3].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepartureEstiTime));
    
    
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: [userplatform] });
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

              if(res.body.runs[0].direction_id == 3)
              { 
                document.getElementById('subServ2').innerHTML = 'Stops All';
              }
              else if(res.body.runs[0].express_stop_count == 0)
              { 
                document.getElementById('subServ2').innerHTML = 'Stops All';
              }
              else
              { 
                document.getElementById('subServ2').innerHTML = 'Express';
              };

            }).catch(console.error);

            ptvClient.then(apis => { return apis.Stops.Stops_StopDetails({ stop_id: [sub2DestinationStop], route_type: 0 });
            }).then(res => {
  
              if(res.body.stop.stop_name == "Parliament ")
              {
                document.getElementById('subTerm2').innerHTML = "Flinders Street ";
                mainDest = "Flinders Street ";
              }
              else
              {
                document.getElementById('subTerm2').innerHTML = res.body.stop.stop_name;
                mainDest = res.body.stop.stop_name;
              };              
              //console.log("finalDestinationName = " + res.body.stop.stop_name)
    
            }).catch(console.error);

      }).catch(console.error);

}).catch(console.error);

console.log("Refreshed!");
}, 1000);
