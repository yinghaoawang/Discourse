const addNoSleepOnMobile = async () => {
    // The wake lock sentinel.
    let wakeLock = null;

    // Function that attempts to request a screen wake lock.
    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                // console.log('Screen Wake Lock released:', wakeLock.released);
            });
            // console.log('Screen Wake Lock released:', wakeLock.released);
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            requestWakeLock();
        }
    });

    // Request a screen wake lock…
    await requestWakeLock();
};

export { addNoSleepOnMobile };
