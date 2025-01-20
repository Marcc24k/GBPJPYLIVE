function updateTime() {
    const estTimeElement = document.getElementById('est-time');
    const gmtTimeElement = document.getElementById('gmt-time');
    const marketStatusElement = document.getElementById('market-status');
    const marketTimerElement = document.getElementById('market-timer');
    const sessionStartElement = document.getElementById('session-start');
    const sessionCloseElement = document.getElementById('session-close');

    // Get the current time in UTC
    const now = new Date();

    // Calculate EST (UTC-5) time
    const estOffset = -5;
    const est = new Date(now.getTime() + estOffset * 60 * 60 * 1000);

    const gmt = now; // GMT time is the same as UTC time

    // Format the time as HH:mm:ss
    const formatTime = (date) => 
        date.toISOString().substr(11, 8); // Extract the time part from the ISO string

    estTimeElement.textContent = formatTime(est); // Display the formatted EST time
    gmtTimeElement.textContent = formatTime(gmt); // Display the formatted GMT time

    // Check if the market is open or closed
    const day = est.getUTCDay(); // Get the current day of the week (0-6, where 0 is Sunday)
    const hours = est.getUTCHours(); // Get the current hour in UTC
    const minutes = est.getUTCMinutes(); // Get the current minutes in UTC

    let marketStatus = "Market Open"; // Default market status
    let marketTimer = ""; // Initialize market timer

    if ((day === 5 && hours >= 17) || (day === 6) || (day === 0 && hours < 17)) {
        // If it's Friday after 5 PM, Saturday, or Sunday before 5 PM, the market is closed
        marketStatus = "Market Closed";
        document.getElementById("market-status").style.color = "red"; // Change the market status text color to red

        // Calculate time until market opens (5 PM Sunday)
        let nextOpen = new Date(est); // Create a new date object for the next market open time
        nextOpen.setUTCDate(est.getUTCDate() + ((7 - est.getUTCDay()) % 7)); // Set the date to the next Sunday
        nextOpen.setUTCHours(17, 0, 0, 0); // Set the time to 5 PM

        const timeUntilOpen = nextOpen - est; // Calculate the time difference in milliseconds
        const hoursUntilOpen = Math.floor(timeUntilOpen / (1000 * 60 * 60)); // Convert milliseconds to hours
        const minutesUntilOpen = Math.floor((timeUntilOpen % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
        marketTimer = `Market opens in ${hoursUntilOpen}h ${minutesUntilOpen}m`; // Set the market timer text
    } else {
        // Calculate time until market closes (5 PM Friday)
        let nextClose = new Date(est); // Create a new date object for the next market close time
        nextClose.setUTCDate(est.getUTCDate() + ((5 - est.getUTCDay() + 7) % 7)); // Set the date to the next Friday
        nextClose.setUTCHours(17, 0, 0, 0); // Set the time to 5 PM

        const timeUntilClose = nextClose - est; // Calculate the time difference in milliseconds
        const hoursUntilClose = Math.floor(timeUntilClose / (1000 * 60 * 60)); // Convert milliseconds to hours
        const minutesUntilClose = Math.floor((timeUntilClose % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
        marketTimer = `Market closes in ${hoursUntilClose}h ${minutesUntilClose}m`; // Set the market timer text
        document.getElementById("market-status").style.color = "green"; // Change the market status text color to green when open
    }

    // Display session start and close times
    const sessionStart = new Date(est);
    sessionStart.setUTCHours(19, 0, 0, 0); // 7:00 PM EST (00:00 UTC)
    const sessionClose = new Date(est);
    sessionClose.setUTCHours(4, 0, 0, 0); // 4:00 AM EST (09:00 UTC)

    sessionStartElement.textContent = `Session Start: ${formatTime(sessionStart)}`;
    sessionCloseElement.textContent = `Session Close: ${formatTime(sessionClose)}`;

    // Change text color based on session start time
    if (now >= sessionStart && now < sessionClose) {
        sessionStartElement.style.color = "green"; // Session is active
    } else {
        sessionStartElement.style.color = "red"; // Session is inactive
    }

    // Change text color based on session close time
    if (now >= sessionClose && now < sessionStart) {
        sessionCloseElement.style.color = "green"; // Session is active
    } else {
        sessionCloseElement.style.color = "red"; // Session is inactive
    }

    marketStatusElement.textContent = marketStatus; // Display the market status
    marketTimerElement.textContent = marketTimer; // Display the market timer
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial update
updateTime();