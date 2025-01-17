function updateTime() {
    const estTimeElement = document.getElementById('est-time');
    const gmtTimeElement = document.getElementById('gmt-time');

    // Get the current time in UTC
    const now = new Date();

    // Calculate EST (UTC-5) time
    const estOffset = -5;
    const est = new Date(now.getTime() + estOffset * 60 * 60 * 1000);

    // GMT time is the same as UTC time
    const gmt = now;

    // Format the time as HH:mm:ss
    const formatTime = (date) => 
        date.toISOString().substr(11, 8);

    estTimeElement.textContent = formatTime(est);
    gmtTimeElement.textContent = formatTime(gmt);
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial update
updateTime();
