document.getElementById('sendAbsenceBtn').addEventListener('click', async () => {
    const netID = document.getElementById('netIDInput').value.trim();
    const date = new Date().toISOString().split('T')[0]; 

    if (!netID) {
        alert('Please enter a NetID.');
        return;
    }

    try {
        const response = await fetch('/api/absenceinform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ netID, date })
        });

        if (response.ok) {
            alert('Email successfully sent!');
        } else {
            alert('Email failed to send.');
        }
    } catch (error) {
        alert('Email failed to send.');
    }
});
