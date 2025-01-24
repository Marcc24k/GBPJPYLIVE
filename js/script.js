function updateTime() {
    const estTimeElement = document.getElementById('est-time');
    const gmtTimeElement = document.getElementById('gmt-time');
    const marketStatusElement = document.getElementById('market-status');
    const marketTimerElement = document.getElementById('market-timer');
    const sessionStartElement = document.getElementById('session-start');
    const sessionCloseElement = document.getElementById('session-close');

    // Get the current time in UTC
    const now = new Date();

    // Calculate GMT time
    const gmt = new Date(now.getTime());

    // Calculate EST (UTC-5) time
    const estOffset = -5;
    const est = new Date(now.getTime() + estOffset * 60 * 60 * 1000);

    // Format the time as HH:mm:ss AM/PM
    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
        return strTime;
    };

    gmtTimeElement.textContent = formatTime(gmt); // Display the formatted GMT time
    estTimeElement.textContent = formatTime(est); // Display the formatted EST time

    // Check if the market is open or closed
    const day = est.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)
    const hours = est.getHours(); // Get the current hour in EST
    const minutes = est.getMinutes(); // Get the current minutes in EST

    let marketStatus = "Market Open"; // Default market status
    let marketTimer = ""; // Initialize market timer

    if ((day === 5 && hours <= 17) || (day === 6) || (day === 0 && hours > 17)) {
        // If it's Friday after 5 PM, Saturday, or Sunday before 5 PM, the market is closed
        marketStatus = "Market Closed";
        document.getElementById("market-status").style.color = "red"; // Change the market status text color to red

        // Calculate time until market opens (5 PM Sunday)
        let nextOpen = new Date(gmt); // Create a new date object for the next market open time
        nextOpen.setUTCDate(gmt.getUTCDate() + ((7 - gmt.getUTCDay()) % 7)); // Set the date to the next Sunday
        nextOpen.setUTCHours(22, 0, 0, 0); // Set the time to 5 PM EST (22:00 UTC)

        const timeUntilOpen = nextOpen - gmt; // Calculate the time difference in milliseconds
        const hoursUntilOpen = Math.floor(timeUntilOpen / (1000 * 60 * 60)); // Convert milliseconds to hours
        const minutesUntilOpen = Math.floor((timeUntilOpen % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
        marketTimer = `Market opens in ${hoursUntilOpen}h ${minutesUntilOpen}m`; // Set the market timer text
    } else {
        // Calculate time until market closes (5 PM Friday)
        let nextClose = new Date(gmt); // Create a new date object for the next market close time
        nextClose.setUTCDate(gmt.getUTCDate() + ((5 - gmt.getUTCDay() + 7) % 7)); // Set the date to the next Friday
        nextClose.setUTCHours(22, 0, 0, 0); // Set the time to 5 PM EST (22:00 UTC)

        const timeUntilClose = nextClose - gmt; // Calculate the time difference in milliseconds
        const hoursUntilClose = Math.floor(timeUntilClose / (1000 * 60 * 60)); // Convert milliseconds to hours
        const minutesUntilClose = Math.floor((timeUntilClose % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
        marketTimer = `Market closes in ${hoursUntilClose}h ${minutesUntilClose}m`; // Set the market timer text
        document.getElementById("market-status").style.color = "green"; // Change the market status text color to green when open
    }

    // Display session start and close times
    const sessionStart = new Date(est);
    sessionStart.setHours(19, 0, 0, 0); // 7:00 PM EST
    const sessionClose = new Date(est);
    sessionClose.setHours(4, 0, 0, 0); // 4:00 AM EST

    sessionStartElement.textContent = `Session Start: ${formatTime(sessionStart)}`;
    sessionCloseElement.textContent = `Session Close: ${formatTime(sessionClose)}`;

    // Change text color based on session start time
    // if (est >= sessionStart && est < sessionClose) {
    //     // sessionStartElement.style.color = "green"; // Session is active
    //     sessionCloseElement.style.color = "darkred"; // Display session close time in dark red
    // } else {
    //     // sessionStartElement.style.color = "red"; // Session is inactive
    //     sessionCloseElement.style.color = "green"; // Session close time in green
    // }

    marketStatusElement.textContent = marketStatus; // Display the market status
    marketTimerElement.textContent = marketTimer; // Display the market timer
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial update
updateTime();