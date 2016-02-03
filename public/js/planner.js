// $(document).ready(function() {
// 	var itinerary = [{}];
// // Select and set the events
// 	$('#things-to-do').on('click', 'button', function(){
// 		var $button = $(this).siblings('select');
// 	 	var val = $button.val();
// 	 	var attr = $button.attr('name');

// 	 	if(attr==='hotel') setHotel(val);
// 	 	if(attr==='activities') addActivity(val);
// 	 	if(attr==='restaurants') addRestaurant(val);

// 	 	var $element = $('<div class="itinerary-item"><span class="title">'+val+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');

// 	 	$("#"+attr+' ul').append($element);

// 	 	//still need to update map with marker
// 	 	//updateMap()
// 	})

// // Remove an item
// 	$('#day-plan').on('click', '.remove', function(){
// 		var $item = $(this).parent();
// 		var type = $item.parent().attr('id');
// 		var name = $item.find('span').text();

// 		$item.remove();

// 		removeItem(type, name);
// 		//need to remove marker
// 		//updateMap();
// 	})

// // Add a day
// 	$('#add-day').on('click', function(){
// 		var num = $('.day-number').last().text();
// 		var newNum = Number(num)+1;

// 		var $newDay = $('<button class="btn btn-circle day-btn day-number">'+newNum+'</button>');
// 		$newDay.insertBefore(this);
		
// 		itinerary.push({});

// 		switchDay($newDay, newNum);
// 	})

// // Switch active day
// 	$('.day-buttons').on('click', '.day-number', function() {
// 		var day = $(this).text();
// 		switchDay($(this), day);
// 	});

// 	function switchDay(newDay, dayNum) {
// 		$('.current-day').removeClass('current-day');
// 		newDay.addClass('current-day');
// 		$('#day-title span').text('Day '+dayNum);

// 		var dayPlan = itinerary[dayNum-1];
// 		var $hotel = $('#hotel ul');
// 		var $acts = $('#activities ul');
// 		var $rests = $('#restaurants ul');

// 		$hotel.children().remove();
// 		$acts.children().remove();
// 		$rests.children().remove();

// 		if(dayPlan.hotel) {
// 			$hotel.append($(generateHTML(dayPlan.hotel[0].name)));
// 		}

// 		if(dayPlan.activities) {
// 			dayPlan.activities.forEach(function (act) {
// 				$acts.append(generateHTML(act.name))
// 			})
// 		}

// 		if(dayPlan.restaurants) {
// 			dayPlan.restaurants.forEach(function (rest) {
// 				$rests.append(generateHTML(rest.name))
// 			})
// 		}

// 		function generateHTML(name) {
// 			return '<div class="itinerary-item"><span class="title">'+name+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>'
// 		}

// 		//render day-plan with current day's itinerary
// 		//pull new day
// 		//updateMap()
// 	}

// 	// function logDayToItinerary() {
// 	// 	var $plan;
// 	// }

// 	function setHotel(name) {
// 		var day = getCurrentDay();
// 		var hotel = findItem(hotels, name, day);

// 		itinerary[day-1].hotel = [hotel];
// 	}
	
// 	function addActivity(val) {
// 		var day = getCurrentDay();
// 		var act = findItem(activities, val, day);
		
// 		if(itinerary[day-1].activities)
// 			itinerary[day-1].activities.push(act);
// 		else itinerary[day-1].activities = [act];
// 	}

// 	function addRestaurant(val) {
// 		var day = getCurrentDay();
// 		var rest = findItem(restaurants, val, day);
		
// 		if(itinerary[day-1].restaurants)
// 			itinerary[day-1].restaurants.push(rest);
// 		else itinerary[day-1].restaurants = [rest];
// 	}

// 	function findItem(globalList, val, day) {
// 		var item;
// 		for (var i = 0; i < globalList.length; i++) {
// 			if(globalList[i].name===val) {
// 				item = globalList[i];
// 				break;
// 			}
// 		}

// 		return item;
// 	}

// 	function removeItem(type, name) {
// 		var day = getCurrentDay();
// 		var item;
// 		var index;
// 		if (type==='hotel') item = findItem(hotels, name, day);
// 		if (type==='activities') item = findItem(activities, name, day);
// 		if (type==='restaurants') item = findItem(restaurants, name, day);

// 		index = itinerary[day-1][type].indexOf(item);
// 		itinerary[day-1][type].splice(index, 1);
// 		console.log(itinerary);
// 	}

// 	function removeDay() {
// 		var day = getCurrentDay();
// 		itinerary.splice(day-1, 1);

// 		//remove current day's button
// 		//adjust remaining days 
// 		//move .current-day to another day
// 		//only allow removal of day 1 when there are at least 2 days
// 	}

// 	function getCurrentDay() {
// 		return Number($('.current-day').text());
// 	}
// })

