yesterday_infections = 0;
yesterday_deaths = 0;
yesterday_recoveries = 0;
// scale = 2;
yesterday_custom_text = {};
timeString = '';
yesterday_time = '';
yesterday_bubbles = [];
yesterday_url = "https://teaof.life/corona/data/";
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
var my_date = yesterday.getDate();
// var my_date = 31;
var my_month = yesterday.getMonth() + 1;
var my_year = yesterday.getFullYear();
yesterday_url += (my_date).toString() + "0" + my_month.toString() + my_year.toString() + ".csv";
// document.getElementById('yesterday_date').innerHTML = "昨天 (" + (my_date).toString() + ".0" + my_month.toString() + ")";
state_bubbles = [];
bubbles = [];

today_bubbles = [];
today_custom_text = {};
today_infections = 0;
today_deaths = 0;
today_recoveries = 0;
today_time = '';
today_url = "https://d3sid3u2apar25.cloudfront.net/current.v3.csv";

var result;


var bubble_map = new Datamap({
  element: document.getElementById('canvas'),
  scope: 'deu',
  responsive: true,
  geographyConfig: {
    popupOnHover: true,
    highlightOnHover: false,
    borderColor: '#444',
    borderWidth: 0.5,
  },
  fills: {
    defaultFill: "#f4f4eb",
    high: '#d14f69', //EB3550
    middle: '#6FE88E',
    low: '#4D4D4D',
    subhigh: 'rgb(166, 189, 219)', //EBA19E
  },
  bubblesConfig: {
    fillOpacity: 0.2,
    borderWidth: 2.0,
    borderOpacity: 1,
    borderColor: '#d14f69',
    popupOnHover: true,
    radius: null,
    popupTemplate: function(geography, data) {
      return '<div class="hoverinfo"><strong>' + data.name + '</strong></div>';
    },
  },
  // data: {
  // 'Sachsen': { fillKey: 'defautlFill' },
  // },
  setProjection: function(element) {
    var projection = d3.geo.mercator()
      .center([16.0, 52]) // always in [East Latitude, North Longitude]
      .scale(2600);
    // .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    var path = d3.geo.path().projection(projection);
    return {
      path: path,
      projection: projection
    };
  }
});


  d3.csv(today_url, function(data) {

// function setup(argument)
// {
  scale = 0.4;

    for (var i = data.length - 1; i >= 0; i--) {
      if ((data[i].parent == "de") && (data[i].label != "Repatriierte")) {
        if (data[i].date > today_time) {
          today_time = data[i].date;
        }
        state = data[i].label;
        count = parseInt(data[i].confirmed);
        recovered = parseInt(data[i].recovered);
        dead = parseInt(data[i].deaths);
        if (data[i].id == "de.xx") {
          today_infections += (count);
          today_recoveries += (recovered);
          today_deaths += (dead);
          continue;
        }
        if (isNaN(count)) {
          count = 0;
        }
        if (isNaN(recovered)) {
          recovered = 0;
        }
        if (isNaN(dead)) {
          dead = 0;
        }
        today_infections += (count);
        today_recoveries += (recovered);
        today_deaths += (dead);
        count_node = {
          centered: state,
          fillKey: "high",
          borderColor: '#d14f69',
          radius: Math.sqrt(count) * scale,
          value: count,
          type: "2",
          info: "确诊",
        };
        today_bubbles.push(count_node);
        recovered_node = {
          centered: state,
          fillKey: "middle",
          borderColor: '#6FE88E',
          radius: Math.sqrt(recovered) * scale,
          value: recovered,
          type: "1",
          info: "治愈",
        };
        today_bubbles.push(recovered_node);
        dead_node = {
          centered: state,
          fillKey: "low",
          borderColor: '#4D4D4D',
          radius: Math.sqrt(dead) * scale,
          value: dead,
          type: "0",
          info: "死亡",
        };
        today_bubbles.push(dead_node);
        today_custom_text[state] = count;

      }
    }

    today_bubbles.sort(function(a, b) {
      if (a.type > b.type) {
        return -1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });

    // // document.getElementById('time').innerHTML = today_time;
    // document.getElementById('total_number').innerHTML = today_infections.toLocaleString();
    // document.getElementById('death_number').innerHTML = today_deaths.toLocaleString();
    // document.getElementById('recovery_number').innerHTML = today_recoveries.toLocaleString();
    // // console.log(today_bubbles.length);



    today_bubbles.sort(function(a, b) {
      if (a.type > b.type) {
        return -1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });

    yesterday_bubbles.sort(function(a, b) {
      if (a.type > b.type) {
        return -1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });

    // only start drawing bubbles on the map when map has rendered completely.
    // bubble_map.labels({'customLabelText': yesterday_custom_text});
    bubble_map.bubbles(today_bubbles, {
      popupTemplate: function(geo, data) {
        return `<div class="hoverinfo">${data.centered}: ${data.info}${data.value}</div>`;
      }
    });
    bubble_map.labels({'customLabelText': today_custom_text, "fontSize": 40, "labelColor": "#4D4D4D",});



  // d3.csv(yesterday_url, function(data) {
  //   for (var i = data.length - 1; i >= 0; i--) {
  //     if ((data[i].parent == "Deutschland") && (data[i].label != "Repatriierte")) {
  //       if (data[i].date > yesterday_time) {
  //         yesterday_time = data[i].date;
  //       }
  //       state = data[i].label;
  //       count = parseInt(data[i].confirmed);
  //       recovered = parseInt(data[i].recovered);
  //       dead = parseInt(data[i].deaths);
  //       if (state == "nicht zugeordnet") {
  //         yesterday_infections += (count);
  //         yesterday_recoveries += (recovered);
  //         yesterday_deaths += (dead);
  //         continue;
  //       }
  //       if (isNaN(count)) {
  //         count = 0;
  //       }
  //       if (isNaN(recovered)) {
  //         recovered = 0;
  //       }
  //       if (isNaN(dead)) {
  //         dead = 0;
  //       }
  //       yesterday_infections += (count);
  //       yesterday_recoveries += (recovered);
  //       yesterday_deaths += (dead);
  //       count_node = {
  //         centered: state,
  //         fillKey: "high",
  //         borderColor: '#d14f69',
  //         radius: Math.sqrt(count) * scale,
  //         value: count,
  //         type: "2",
  //         info: "确诊",
  //       };
  //       yesterday_bubbles.push(count_node);
  //       recovered_node = {
  //         centered: state,
  //         fillKey: "middle",
  //         borderColor: '#6FE88E',
  //         radius: Math.sqrt(recovered) * scale,
  //         value: recovered,
  //         type: "1",
  //         info: "治愈",
  //       };
  //       yesterday_bubbles.push(recovered_node);
  //       dead_node = {
  //         centered: state,
  //         fillKey: "low",
  //         borderColor: '#4D4D4D',
  //         radius: Math.sqrt(dead) * scale,
  //         value: dead,
  //         type: "0",
  //         info: "死亡",
  //       };
  //       yesterday_bubbles.push(dead_node);
  //       yesterday_custom_text[state] = count;

  //     }
  //   }

  //   yesterday_bubbles.sort(function(a, b) {
  //     if (a.type > b.type) {
  //       return -1;
  //     }
  //     if (a.value > b.value) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   // document.getElementById('time').innerHTML = yesterday_time;
  //   // document.getElementById('total_number').innerHTML = yesterday_infections;
  //   // document.getElementById('death_number').innerHTML = yesterday_deaths;
  //   // document.getElementById('recovery_number').innerHTML = yesterday_recoveries;

  //   // document.getElementById('infection_increase').innerHTML = today_infections - yesterday_infections;
  //   // document.getElementById('recovery_increase').innerHTML = today_recoveries - yesterday_recoveries;
  //   // document.getElementById('death_increase').innerHTML = today_deaths - yesterday_deaths;
  //   // console.log(today_bubbles.length);
 

  //   // document.getElementById('total_number').innerHTML = today_infections.toLocaleString();
  //   // document.getElementById('death_number').innerHTML = today_deaths.toLocaleString();
  //   // document.getElementById('recovery_number').innerHTML = today_recoveries.toLocaleString();

  //   // document.getElementById('infection_increase').innerHTML = "新增" + (today_infections - yesterday_infections).toLocaleString();
  //   // document.getElementById('recovery_increase').innerHTML = "新增" + (today_recoveries - yesterday_recoveries).toLocaleString();
  //   // document.getElementById('death_increase').innerHTML = "新增" + (today_deaths - yesterday_deaths).toLocaleString();

  //   today_bubbles.sort(function(a, b) {
  //     if (a.type > b.type) {
  //       return -1;
  //     }
  //     if (a.value > b.value) {
  //       return -1;
  //     }
  //     return 0;
  //   });

  //   yesterday_bubbles.sort(function(a, b) {
  //     if (a.type > b.type) {
  //       return -1;
  //     }
  //     if (a.value > b.value) {
  //       return -1;
  //     }
  //     return 0;
  //   });

  //   // only start drawing bubbles on the map when map has rendered completely.
  //   // bubble_map.labels({'customLabelText': yesterday_custom_text});
  //   bubble_map.bubbles(today_bubbles, {
  //     popupTemplate: function(geo, data) {
  //       return `<div class="hoverinfo">${data.centered}: ${data.info}${data.value}</div>`;
  //     }
  //   });
  //   bubble_map.labels({'customLabelText': today_custom_text, "fontSize": 40});
  // });



  });



  // setTimeout(() => {

  //   document.getElementById('total_number').innerHTML = today_infections.toLocaleString();
  //   document.getElementById('death_number').innerHTML = today_deaths.toLocaleString();
  //   document.getElementById('recovery_number').innerHTML = today_recoveries.toLocaleString();

  //   today_bubbles.sort(function(a, b) {
  //     if (a.type > b.type) {
  //       return -1;
  //     }
  //     if (a.value > b.value) {
  //       return -1;
  //     }
  //     return 0;
  //   });

  //   yesterday_bubbles.sort(function(a, b) {
  //     if (a.type > b.type) {
  //       return -1;
  //     }
  //     if (a.value > b.value) {
  //       return -1;
  //     }
  //     return 0;
  //   });

  //   if (today_infections - yesterday_infections >= 0) {
  //     document.getElementById('infection_increase').innerHTML = "新增" + (today_infections - yesterday_infections).toLocaleString();
  //   } else {
  //     document.getElementById('infection_increase').innerHTML = (today_infections - yesterday_infections).toLocaleString();
  //   }
  //   document.getElementById('recovery_increase').innerHTML = "新增" + (today_recoveries - yesterday_recoveries).toLocaleString();
  //   document.getElementById('death_increase').innerHTML = "新增" + (today_deaths - yesterday_deaths).toLocaleString();
  //   // only start drawing bubbles on the map when map has rendered completely.
  //   // bubble_map.labels({'customLabelText': yesterday_custom_text});
  //   bubble_map.bubbles(today_bubbles, {
  //     popupTemplate: function(geo, data) {
  //       return `<div class="hoverinfo">${data.centered}: ${data.info}${data.value}</div>`;
  //     }
  //   });
  //   // bubble_map.labels({'customLabelText': today_custom_text, "fontSize": 40});
  // }, 1500);



// }

// document.addEventListener('DOMContentLoaded', function() {
//   var checkbox = document.querySelector('input[type="checkbox"]');

//   checkbox.addEventListener('change', function() {
//     if (checkbox.checked) {
//       removeElementsByClass("labels");
//       bubble_map.labels({
//         'customLabelText': today_custom_text,
//         "fontSize": 40
//       });
//       // document.getElementById('total_number').innerHTML = today_infections.toLocaleString();
//       // document.getElementById('recovery_number').innerHTML = today_recoveries.toLocaleString();
//       // document.getElementById('death_number').innerHTML = today_deaths.toLocaleString();
//       // document.getElementById('time').innerHTML = today_time;
//       // if (today_infections - yesterday_infections >= 0) {
//       //   document.getElementById('infection_increase').innerHTML = "新增" + (today_infections - yesterday_infections).toLocaleString();
//       // } else {
//       //   document.getElementById('infection_increase').innerHTML = (today_infections - yesterday_infections).toLocaleString();
//       // }
//       // document.getElementById('recovery_increase').innerHTML = "新增" + (today_recoveries - yesterday_recoveries).toLocaleString();
//       // document.getElementById('death_increase').innerHTML = "新增" + (today_deaths - yesterday_deaths).toLocaleString();
//       today_bubbles.sort(function(a, b) {
//         if (a.type > b.type) {
//           return -1;
//         }
//         if (a.value > b.value) {
//           return -1;
//         }
//         return 0;
//       });
//       bubble_map.bubbles(today_bubbles, {
//         popupTemplate: function(geo, data) {
//           return `<div class="hoverinfo">${data.centered}: ${data.info}${data.value}</div>`;
//         }
//       });
//     } else {
//       removeElementsByClass("labels");
//       bubble_map.labels({
//         'customLabelText': yesterday_custom_text,
//         "fontSize": 40
//       });
//       // if (today_infections - yesterday_infections >= 0) {
//       //   document.getElementById('infection_increase').innerHTML = "新增" + (today_infections - yesterday_infections).toLocaleString();
//       // } else {
//       //   document.getElementById('infection_increase').innerHTML = (today_infections - yesterday_infections).toLocaleString();
//       // }

//       // document.getElementById('recovery_increase').innerHTML = "新增" + (today_recoveries - yesterday_recoveries).toLocaleString();
//       // document.getElementById('death_increase').innerHTML = "新增" + (today_deaths - yesterday_deaths).toLocaleString();
//       // document.getElementById('total_number').innerHTML = yesterday_infections;
//       // document.getElementById('recovery_number').innerHTML = yesterday_recoveries;
//       // document.getElementById('death_number').innerHTML = yesterday_deaths;
//       // document.getElementById('time').innerHTML = yesterday_time;
//       // document.getElementById('infection_increase').innerHTML = "";
//       // document.getElementById('recovery_increase').innerHTML = "";
//       // document.getElementById('death_increase').innerHTML = "";
//       yesterday_bubbles.sort(function(a, b) {
//         if (a.type > b.type) {
//           return -1;
//         }
//         if (a.value > b.value) {
//           return -1;
//         }
//         return 0;
//       });
//       bubble_map.bubbles(yesterday_bubbles, {
//         popupTemplate: function(geo, data) {
//           return `<div class="hoverinfo">${data.centered}: ${data.info}${data.value}</div>`;
//         }
//       });
//     }
//   });
// });


// function removeElementsByClass(className) {
//   var elements = document.getElementsByClassName(className);
//   for (var i = elements.length - 1; i >= 0; i--) {
//     elements[i].innerHTML = "";
//   }
// }