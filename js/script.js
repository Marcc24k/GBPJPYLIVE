function updateTime() {
    const estTimeElement = document.getElementById('est-time');
    const gmtTimeElement = document.getElementById('gmt-time');
    const marketStatusElement = document.getElementById('market-status');
    const marketTimerElement = document.getElementById('market-timer');

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

    // Check if the market is open or closed
    const day = est.getUTCDay();
    const hours = est.getUTCHours();
    const minutes = est.getUTCMinutes();

    let marketStatus = "Market Open";
    let marketTimer = "";

    if ((day === 5 && hours >= 17) || (day === 6) || (day === 0 && hours < 17)) {
        marketStatus = "Market Closed";
        document.getElementById("market-status").style.color = "red";

        // Calculate time until market opens (5 PM Sunday)
        let nextOpen = new Date(est);
        nextOpen.setUTCDate(est.getUTCDate() + ((7 - est.getUTCDay()) % 7));
        nextOpen.setUTCHours(17, 0, 0, 0);

        const timeUntilOpen = nextOpen - est;
        const hoursUntilOpen = Math.floor(timeUntilOpen / (1000 * 60 * 60));
        const minutesUntilOpen = Math.floor((timeUntilOpen % (1000 * 60 * 60)) / (1000 * 60));
        marketTimer = `Market opens in ${hoursUntilOpen}h ${minutesUntilOpen}m`;
    } else {
        // Calculate time until market closes (5 PM Friday)
        let nextClose = new Date(est);
        nextClose.setUTCDate(est.getUTCDate() + ((5 - est.getUTCDay() + 7) % 7));
        nextClose.setUTCHours(17, 0, 0, 0);

        const timeUntilClose = nextClose - est;
        const hoursUntilClose = Math.floor(timeUntilClose / (1000 * 60 * 60));
        const minutesUntilClose = Math.floor((timeUntilClose % (1000 * 60 * 60)) / (1000 * 60));
        marketTimer = `Market closes in ${hoursUntilClose}h ${minutesUntilClose}m`;
    }

    marketStatusElement.textContent = marketStatus;
    marketTimerElement.textContent = marketTimer;
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial update
updateTime();