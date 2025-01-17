function updateTime() {
    const estTimeElement = document.getElementById('est-time');
    const bstTimeElement = document.getElementById('bst-time');

    // Get the current time in UTC
    const now = new Date();

    // Calculate EST (UTC-5) time
    const estOffset = -5;
    const est = new Date(now.getTime() + estOffset * 60 * 60 * 1000);

    // Calculate BST (UTC+1) time
    const bstOffset = 1;
    const bst = new Date(now.getTime() + bstOffset * 60 * 60 * 1000);

    // Format the time as HH:mm:ss
    const formatTime = (date) => 
        date.toISOString().substr(11, 8);

    estTimeElement.textContent = formatTime(est);
    bstTimeElement.textContent = formatTime(bst);
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial update
updateTime();



