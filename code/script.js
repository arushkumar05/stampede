// Define departure times for each bus stop
const busTimings = {
    goodyear: ["09:00", "12:00", "14:10", "17:30", "23:25"],
    maincircle: ["10:00", "13:00", "16:00", "18:00"],
    flintloop: ["11:00", "14:30", "16:30"]
};

function convertTo24HourFormat(time, meridian) {
    const [hour, minute] = time.split(':');
    let newHour = parseInt(hour, 10);

    if (meridian === 'pm' && newHour !== 12) {
        newHour += 12;
    } else if (meridian === 'am' && newHour === 12) {
        newHour = 0;
    }

    return `${newHour.toString().padStart(2, '0')}:${minute}`;
}

function calculateNextBusTime(selectedBusStop, selectedUserTime) {
    const selectedBusTimings = busTimings[selectedBusStop];

    let nextBusTime;

    if (selectedUserTime === "1") {
        // If user selects "Current time," find the next closest bus departure time after the current time
        const currentTime = new Date();
        const currentFormattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}`;

        nextBusTime = selectedBusTimings.find(time => time > currentFormattedTime) || selectedBusTimings[0];
    } else {
        // If the user selects a specific time, find the closest departure time based on the selected time
        const [selectedTime, meridian] = selectedUserTime.split(' ');
        const selectedTime24Hour = convertTo24HourFormat(selectedTime, meridian);
        
        const sortedBusTimings = [...selectedBusTimings].sort();
        nextBusTime = sortedBusTimings.find(time => time >= selectedTime24Hour) || sortedBusTimings[0];
    }

    const [nextHour, nextMinute] = nextBusTime.split(':');
    const nextBusDateTime = new Date();
    nextBusDateTime.setHours(nextHour, nextMinute, 0, 0);

    let timeDifference = Math.floor((nextBusDateTime - new Date()) / (60 * 1000));

    if (timeDifference < 0) {
        timeDifference += 24 * 60;  // Add 24 hours if the next bus time is in the past
    }

    const hours = Math.floor(timeDifference / 60);
    const minutes = timeDifference % 60;

    const formattedTimeDifference = `${hours} hours ${minutes} mins`;

    document.querySelector('#bus-time').textContent = nextBusTime;
    document.querySelector('.stop').textContent = `from ${selectedBusStop}`;
    document.querySelector('.time').textContent = `Departing in ${formattedTimeDifference}`;
}

document.addEventListener('DOMContentLoaded', function () {
    var busStopDropdown = document.getElementById('bus-stop');
    var userTimeDropdown = document.getElementById('user-time');

    function updateBusTime() {
        const selectedBusStop = busStopDropdown.value;
        const selectedUserTime = userTimeDropdown.value;
        calculateNextBusTime(selectedBusStop, selectedUserTime);
    }

    busStopDropdown.addEventListener('change', updateBusTime);
    userTimeDropdown.addEventListener('change', updateBusTime);

    // Initial calculation based on default values
    const initialBusStop = busStopDropdown.value;
    const initialUserTime = userTimeDropdown.value;
    calculateNextBusTime(initialBusStop, initialUserTime);

    // Update every minute
    setInterval(updateBusTime, 60000);
});