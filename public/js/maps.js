function initialize_gmaps() {

  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(40.705189, -74.009209);

  // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    // styles: styleArr
  };

  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById('map-canvas');

  // initialize a new Google Map with the options
  var map = new google.maps.Map(map_canvas_obj, mapOptions);

  // add the marker to the map
  var marker = new google.maps.Marker({
    position: myLatlng,
    title: 'Hello World!'
  });

  // draw some locations on the map
  function drawLocation(location, opts) {
    if (typeof opts !== 'object') {
      opts = {};
    }
    opts.position = new google.maps.LatLng(location[0], location[1]);
    opts.map = map;
    var marker = new google.maps.Marker(opts);
  }

  var hotelLocation = [];
  var restaurantLocations = [];
  var activityLocations = [];

  drawLocation(hotelLocation, {
    icon: '/images/lodging_0star.png'
  });
  restaurantLocations.forEach(function(loc) {
    drawLocation(loc, {
      icon: '/images/restaurant.png'
    });
  });
  activityLocations.forEach(function(loc) {
    drawLocation(loc, {
      icon: '/images/star-3.png'
    });
  });

  return map;
}

$(document).ready(function() {
  var map = initialize_gmaps();
  var markers = [];
  var itinerary = [{}];

// Select and set the events
  $('#things-to-do').on('click', 'button', function(){
    var $button = $(this).siblings('select');
    var val = $button.val();
    var attr = $button.attr('name');

    if(attr==='hotel') {
      setHotel(val);
      addMarker(findItem(hotels, val, getCurrentDay()));
    }
    if(attr==='activities') {
      addActivity(val);
      addMarker(findItem(activities, val, getCurrentDay()));
    }
    if(attr==='restaurants') {
      addRestaurant(val);
      addMarker(findItem(restaurants, val, getCurrentDay()));
    }

    var $element = $('<div class="itinerary-item"><span class="title">'+val+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');

    $("#"+attr+' ul').append($element);

    //still need to update map with marker

    //updateMap()
  })

// Remove an item
  $('#day-plan').on('click', '.remove', function(){
    var $item = $(this).parent();
    var type = $item.parent().parent().attr('id');
    var name = $item.find('span').text();
    console.log($item);
    $item.remove();

    removeItem(type, name);
    //need to remove marker
    removeMarker(name);
  })

// Add a day
  $('#add-day').on('click', function(){
    var num = $('.day-number').last().text();
    var newNum = Number(num)+1;

    var $newDay = $('<button class="btn btn-circle day-btn day-number">'+newNum+'</button>');
    $newDay.insertBefore(this);
    
    itinerary.push({});

    switchDay($newDay, newNum);
    updateMap(newNum);
  })

// Switch active day
  $('.day-buttons').on('click', '.day-number', function() {
    var day = $(this).text();
    switchDay($(this), day);
  });

  function switchDay(newDay, dayNum) {
    $('.current-day').removeClass('current-day');
    newDay.addClass('current-day');
    $('#day-title span').text('Day '+dayNum);

    var dayPlan = itinerary[dayNum-1];
    var $hotel = $('#hotel ul');
    var $acts = $('#activities ul');
    var $rests = $('#restaurants ul');

    $hotel.children().remove();
    $acts.children().remove();
    $rests.children().remove();

    if(dayPlan.hotel && dayPlan.hotel[0]) {
      $hotel.append($(generateHTML(dayPlan.hotel[0].name)));
    }

    if(dayPlan.activities) {
      dayPlan.activities.forEach(function (act) {
        $acts.append(generateHTML(act.name))
      })
    }

    if(dayPlan.restaurants) {
      dayPlan.restaurants.forEach(function (rest) {
        $rests.append(generateHTML(rest.name))
      })
    }

    function generateHTML(name) {
      return '<div class="itinerary-item"><span class="title">'+name+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>'
    }

    //render day-plan with current day's itinerary
    //pull new day
    //remove markers
    updateMap(dayNum);
  }

  // function logDayToItinerary() {
  //  var $plan;
  // }

  function setHotel(name) {
    var day = getCurrentDay();
    var hotel = findItem(hotels, name, day);

    itinerary[day-1].hotel = [hotel];
  }
  
  function addActivity(val) {
    var day = getCurrentDay();
    var act = findItem(activities, val, day);
    
    if(itinerary[day-1].activities)
      itinerary[day-1].activities.push(act);
    else itinerary[day-1].activities = [act];
  }

  function addRestaurant(val) {
    var day = getCurrentDay();
    var rest = findItem(restaurants, val, day);
    
    if(itinerary[day-1].restaurants)
      itinerary[day-1].restaurants.push(rest);
    else itinerary[day-1].restaurants = [rest];
  }

  function findItem(globalList, val, day) {
    var item;
    for (var i = 0; i < globalList.length; i++) {
      if(globalList[i].name===val) {
        item = globalList[i];
        break;
      }
    }

    return item;
  }

  function removeItem(type, name) {
    var day = getCurrentDay();
    var item;
    var index;
    if (type==='hotel') item = findItem(hotels, name, day);
    if (type==='activities') item = findItem(activities, name, day);
    if (type==='restaurants') item = findItem(restaurants, name, day);

    index = itinerary[day-1][type].indexOf(item);
    itinerary[day-1][type].splice(index, 1);
  }

  function removeDay() {
    var day = getCurrentDay();
    itinerary.splice(day-1, 1);

    //remove current day's button
    //adjust remaining days 
    //move .current-day to another day
    //only allow removal of day 1 when there are at least 2 days
  }

  function getCurrentDay() {
    return Number($('.current-day').text());
  }

  function addMarker(obj) {
    var myLatlng = new google.maps.LatLng(obj.place[0].location[0], obj.place[0].location[1]);
    var marker = new google.maps.Marker({
      position: myLatlng,
      name: obj.name
    });
    markers.push(marker);
    marker.setMap(map);
    console.log(marker);
  }

  function removeMarker(name) {
    var marker;

    markers.forEach(function (m) {
      if (m.name===name) marker = m;
    })

    marker.setMap(null);
  }

  function updateMap(dayNumber) {
    var dayPlan = itinerary[dayNumber-1];

    removeAllMarkers();

    if(dayPlan.hotel && dayPlan.hotel[0]) {
      addMarker(dayPlan.hotel[0]);
    }
    if(dayPlan.activities) {
      dayPlan.activities.forEach(function (act) {
        addMarker(act);
      });
    }
    if(dayPlan.restaurants) {
      dayPlan.restaurants.forEach(function (rest) {
        addMarker(rest);
      });
    }
  }

  function removeAllMarkers() {
    markers.forEach(function (marker){
      marker.setMap(null);
    })
    markers = [];
  }
});

// var styleArr = [{
//   featureType: 'landscape',
//   stylers: [{ saturation: -100 }, { lightness: 60 }]
// }, {
//   featureType: 'road.local',
//   stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
// }, {
//   featureType: 'transit',
//   stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
// }, {
//   featureType: 'administrative.province',
//   stylers: [{ visibility: 'off' }]
// }, {
//   featureType: 'water',
//   stylers: [{ visibility: 'on' }, { lightness: 30 }]
// }, {
//   featureType: 'road.highway',
//   elementType: 'geometry.fill',
//   stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
// }, {
//   featureType: 'road.highway',
//   elementType: 'geometry.stroke',
//   stylers: [{ visibility: 'off' }]
// }, {
//   featureType: 'poi.park',
//   elementType: 'geometry.fill',
//   stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
// }];
