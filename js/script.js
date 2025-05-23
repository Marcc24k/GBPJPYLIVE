function updateTime() {
    // Get the HTML elements for displaying EST time
    const estTimeElement = document.getElementById('est-time');

    // Get the HTML elements for displaying GMT time
    const gmtTimeElement = document.getElementById('gmt-time');

    // Get the HTML element for displaying market status
    const marketStatusElement = document.getElementById('market-status');

    // Get the HTML element for displaying market timer
    const marketTimerElement = document.getElementById('market-timer');

    // Get the HTML element for displaying session start time
    const sessionStartElement = document.getElementById('session-start');

    // Get the HTML element for displaying session close time
    const sessionCloseElement = document.getElementById('session-close');

    // Get the current time in UTC
    const now = new Date();

    // Calculate GMT time
    const gmt = new Date(now.getTime());

  // Calculate EST (UTC-5 or UTC-4 during DST)
const isDST = (date) => {
    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return date.getTimezoneOffset() < Math.max(january, july);
};

const estOffset = isDST(now) ? -4 : -5; // Adjust for DST
const est = new Date(now.getTime() + estOffset * 60 * 60 * 1000);

    // Format the time as HH:mm:ss AM/PM
    const formatTime = (date) => {
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
        return strTime;
    };

    gmtTimeElement.textContent = formatTime(gmt); // Display the formatted GMT time
    estTimeElement.textContent = formatTime(est); // Display the formatted EST time

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
    sessionStart.setUTCHours(19, 0, 0, 0);// 7:00 PM EST (00:00 UTC)
    const sessionClose = new Date(est);
    sessionClose.setUTCHours(4, 0, 0, 0); // 4:00 AM EST (09:00 UTC)



    // Change text color based on session start time
    if (gmt >= sessionStart || gmt < sessionClose) {
        sessionStartElement.style.color = "#982dc9"; // Session is active
        sessionCloseElement.style.display = "none"; // Display session close time in dark red
        console.log("Session Inactive"); // Log session status
      
        
    }else {
        sessionCloseElement.style.color = "#982dc9"; // Session is inactive 
        sessionStartElement.style.display = "none"; // Session close time in green
        console.log("Session Active"); // Log session status

    }

// Display the session start time in the specified format
sessionStartElement.textContent = `Session Start: ${formatTime(sessionStart)}`;

// Display the session close time in the specified format
sessionCloseElement.textContent = `Session Close: ${formatTime(sessionClose)}`;

// Display the current market status (e.g., "Market Open" or "Market Closed")
marketStatusElement.textContent = marketStatus;

// Display the market timer (e.g., "Market opens in Xh Ym" or "Market closes in Xh Ym")
marketTimerElement.textContent = marketTimer;
}

// Function to set a cookie with SameSite=None
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=None;Secure";
}

// Example usage of setCookie function
setCookie('exampleCookie', 'exampleValue', 7);

// Update the time every second
setInterval(updateTime, 1000);

// Initial update
updateTime();

// Fetch and display Forex data
fetchForexData();