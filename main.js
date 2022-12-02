console.log('Custom Javascript Loaded');

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

function arrayIncludeDisplay(stopId, stationName, iterator) // Departure Stop List fill function
{
  if(terminus != true)
  {
    if(stopsArray.length >= 18)
    {
      if(stopsArray.includes(stopId) == true)
      {
        document.getElementById('stopList'+ iterator).innerHTML = stationName;
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
        document.getElementById('stopList'+ iterator).innerHTML = stationName;
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
const devid = (keys.DEVELOPERID);
const apikey = (keys.APIKEY);
var stopsArray = new Array();
var mainDest;
let a;
let time;
var terminus = false;

setInterval(() => {

  a = new Date();
  h = a.getHours();
  m = a.getMinutes();
  if(h > 12) h = h - 12;
  if(m < 10) m = "0" + m;
  if(h == 24 || 0) h = "12";
  time = h + ':' + m;
  document.getElementById('time').innerHTML = time;

  ptvClient = ptv(devid, apikey); // Main Departure Destination
  ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: 1 });
  }).then(res => {
    mainDepaturePlatform = res.body.departures[0].platform_number;
    mainDepatureDest = res.body.departures[0].direction_id;
    mainDepatureRunRef = res.body.departures[0].run_ref;

    var mainSTD = new Date(res.body.departures[0].scheduled_departure_utc);
    document.getElementById('mainSTD').innerHTML = date_toTime(mainSTD);
  
    var mainDepatureEstiTime = new Date(res.body.departures[0].estimated_departure_utc);    
    
    ptvClient = ptv(devid, apikey); 
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: 1 });
    }).then(res => {
      if(res.body.departures[0].at_platform == true)
      {
        document.getElementById('mainETD').innerHTML = "now";
      }
      else
      {
        document.getElementById('mainETD').innerHTML = date_toUntil(mainDepatureEstiTime, mainSTD) + " min";
      };
    }).catch(console.error);
      
    ptvClient = ptv(devid, apikey); 
    ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [mainDepatureRunRef], route_type: 0 });
    }).then(res => {
      destinationStop = res.body.departures[res.body.departures.length-1].stop_id;

      ptvClient = ptv(devid, apikey); 
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
            ptvClient = ptv(devid, apikey); 
            ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [mainDepatureRunRef], route_type: 0,  });
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
              // if(stopsArray[stopsArray.length-1] == 1155)

              clearDepartureBoard();
              arrayIncludeDisplay(1092, 'Heathmont', 0);
              arrayIncludeDisplay(1163, 'Ringwood', 1);
              arrayIncludeDisplay(1091, 'Heatherdale', 2);
              arrayIncludeDisplay(1128, 'Mitcham', 3);
              arrayIncludeDisplay(1148, 'Nunawading', 4);
              arrayIncludeDisplay(1023, 'Blackburn', 5);
              arrayIncludeDisplay(1111, 'Laburnum', 6);
              arrayIncludeDisplay(1026, 'Box Hill', 7);
              arrayIncludeDisplay(1129, 'Mont Albert', 8);
              arrayIncludeDisplay(1189, 'Surrey Hills', 9);
              arrayIncludeDisplay(1037, 'Chatham', 10);
              arrayIncludeDisplay(1033, 'Canterbury', 11);
              arrayIncludeDisplay(1057, 'East Camberwell', 12);
              arrayIncludeDisplay(1032, 'Camberwell', 13);
              arrayIncludeDisplay(1012, 'Auburn', 14);
              arrayIncludeDisplay(1080, 'Glenferrie', 15);
              arrayIncludeDisplay(1090, 'Hawthorn', 16);
              arrayIncludeDisplay(1030, 'Burnley', 17);
              arrayIncludeDisplay(1059, 'East Richmond', 18);
              arrayIncludeDisplay(1162, 'Richmond', 19);
              arrayIncludeDisplay(1071, 'Flinders Street', 20);


            }).catch(console.error);

            // document.getElementById('stopList'+0).innerHTML = "test";
            // var testArray = [stop : 1, order : 9]
            // console.log(testArray)
            
            // console.log(testArray[0])
            
// for (let i = 0; i < stopsArray.length; i++) {
  //  console.log(stopsArray[i])
  // document.getElementById('stopList'+[i]).innerHTML = stopsArray[i];
// }

}).catch(console.error);

}).catch(console.error);


ptvClient = ptv(devid, apikey); // Sub0 Depature Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: 1 });
}).then(res => {
  
    sub0DepatureRunRef = res.body.departures[1].run_ref;
    //console.log("mainDepatureRunRef = " + mainDepatureRunRef);

    var sub0DepatureShedTime = new Date(res.body.departures[1].scheduled_departure_utc);
    document.getElementById('subSTD0').innerHTML = date_toTime(sub0DepatureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub0DepatureEstiTime = new Date(res.body.departures[1].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepatureEstiTime));
    
    
    ptvClient = ptv(devid, apikey); 
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: 1 });
  }).then(res => {
    
    //console.log(res.body.departures[0].at_platform)
    if(res.body.departures[1].at_platform == true)
    {
      document.getElementById('subETD0').innerHTML = "now";
    }
    else{
      document.getElementById('subETD0').innerHTML = date_toUntil(sub0DepatureEstiTime, sub0DepatureShedTime) + " min";
    };
    
  }).catch(console.error);


      ptvClient = ptv(devid, apikey); 
      ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [sub0DepatureRunRef], route_type: 0 });
      }).then(res => {

          //console.log("routeLength = " + res.body.departures.length);
          sub0DestinationStop = res.body.departures[res.body.departures.length-1].stop_id;
          //console.log("finalDestinationId = " + destinationStop)
          
            ptvClient = ptv(devid, apikey); 
            ptvClient.then(apis => { return apis.Runs.Runs_ForRun({  run_id: [sub0DepatureRunRef] });
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

            ptvClient = ptv(devid, apikey); 
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



ptvClient = ptv(devid, apikey); // Sub1 Depature Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: 1 });
}).then(res => {
  
    sub1DepatureRunRef = res.body.departures[2].run_ref;
    //console.log("mainDepatureRunRef = " + mainDepatureRunRef);

    var sub1DepatureShedTime = new Date(res.body.departures[2].scheduled_departure_utc);
    document.getElementById('subSTD1').innerHTML = date_toTime(sub1DepatureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub1DepatureEstiTime = new Date(res.body.departures[2].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepatureEstiTime));
    
    
    ptvClient = ptv(devid, apikey); 
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: 1 });
  }).then(res => {
    
    //console.log(res.body.departures[0].at_platform)
    if(res.body.departures[2].at_platform == true)
    {
      document.getElementById('subETD1').innerHTML = "now";
    }
    else
    {
      document.getElementById('subETD1').innerHTML = date_toUntil(sub1DepatureEstiTime, sub1DepatureShedTime) + " min";
    };
    
  }).catch(console.error);


      ptvClient = ptv(devid, apikey); 
      ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [sub1DepatureRunRef], route_type: 0 });
      }).then(res => {

          //console.log("routeLength = " + res.body.departures.length);
          sub1DestinationStop = res.body.departures[res.body.departures.length-1].stop_id;
          //console.log("finalDestinationId = " + destinationStop)

          ptvClient = ptv(devid, apikey); 
          ptvClient.then(apis => { return apis.Runs.Runs_ForRun({  run_id: [sub1DepatureRunRef] });
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

            ptvClient = ptv(devid, apikey); 
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



ptvClient = ptv(devid, apikey); // Sub2 Depature Destination
ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numbers: 1 });
}).then(res => {
  
    sub2DepatureRunRef = res.body.departures[3].run_ref;
    //console.log("mainDepatureRunRef = " + mainDepatureRunRef);

    var sub2DepatureShedTime = new Date(res.body.departures[3].scheduled_departure_utc);
    document.getElementById('subSTD2').innerHTML = date_toTime(sub2DepatureShedTime);
    //console.log("mainSTD = " + date_toTime(mainSTD));

    var sub2DepatureEstiTime = new Date(res.body.departures[3].estimated_departure_utc);
    //console.log("mainETD   = " + date_toUntil(mainDepatureEstiTime));
    
    
    ptvClient = ptv(devid, apikey); 
    ptvClient.then(apis => { return apis.Departures.Departures_GetForStop({ route_type: 0, stop_id: 1016, max_results: 4, platform_numberss: 1 });
  }).then(res => {
    
    //console.log(res.body.departures[0].at_platform)
    if(res.body.departures[3].at_platform == true)
    {
      document.getElementById('subETD2').innerHTML = "now";
    }
    else{
      document.getElementById('subETD2').innerHTML = date_toUntil(sub2DepatureEstiTime, sub2DepatureShedTime) + " min";
    };
    
  }).catch(console.error);


      ptvClient = ptv(devid, apikey); 
      ptvClient.then(apis => { return apis.Patterns.Patterns_GetPatternByRun({ run_id: [sub2DepatureRunRef], route_type: 0 });
      }).then(res => {

          //console.log("routeLength = " + res.body.departures.length);
          sub2DestinationStop = res.body.departures[res.body.departures.length-1].stop_id;
          //console.log("finalDestinationId = " + destinationStop)

          ptvClient = ptv(devid, apikey); 
            ptvClient.then(apis => { return apis.Runs.Runs_ForRun({  run_id: [sub2DepatureRunRef] });
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

            ptvClient = ptv(devid, apikey); 
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
