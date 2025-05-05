// Mapping of hour (0-23) to the corresponding code
// Not needed with the new formula, so it's commented out
// const codeMap = {
//     0: "NS287601000FW",
//     1: "NS287602010FW",
//     2: "NS287603020FW",
//     3: "NS287604030FW",
//     4: "NS287605040FW",
//     5: "NS287606050FW",
//     6: "NS287607060FW",
//     7: "NS287608070FW",
//     8: "NS287609080FW",
//     9: "NS287610090FW",
//     10: "NS287611100FW",
//     11: "NS287612110FW",
//     12: "NS287613120FW",
//     13: "NS287614130FW",
//     14: "NS287615140FW",
//     15: "NS287616150FW",
//     16: "NS287617160FW",
//     17: "NS287618170FW",
//     18: "NS287619180FW",
//     19: "NS287620190FW",
//     20: "NS287621200FW",
//     21: "NS287622210FW",
//     22: "NS287623220FW",
//     23: "NS287624230FW"
// };

// Function to update the displayed code based on the current hour
function updateCode() {
    const now = new Date();
    const currentHourUTC = now.getUTCHours(); // Get the hour in UTC as specified in the prompt

    // Apply the new formula: (Hora UTC + 1) * 1000 + (Hora UTC * 10)
    // This matches the logic provided in the Python example: (hora_actual + 1) * 1000 + hora_actual * 10
    const codeNumber = ((currentHourUTC + 1) * 1000) + (currentHourUTC * 10);
    const currentCode = `NS28760${codeNumber}FW`;

    // Find the input element by its ID
    const codeInputElement = document.getElementById('code-input');

    // Update the value of the input element
    if (codeInputElement) {
        codeInputElement.value = currentCode;
    }
}

// Function to copy the code to the clipboard
function copyCode() {
    const codeInputElement = document.getElementById('code-input');

    // Select the text in the input field
    codeInputElement.select();
    // For mobile devices or some browsers, setSelectionRange might be needed
    codeInputElement.setSelectionRange(0, 99999); // For mobile devices

    // Use the modern Clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(codeInputElement.value).then(() => {
            // Optional: Provide visual feedback to the user
            const copyButton = document.getElementById('copy-button');
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000); // Change back after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older methods if Clipboard API fails
            try {
                document.execCommand('copy');
                // Optional: Provide visual feedback
                const copyButton = document.getElementById('copy-button');
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000); // Change back after 2 seconds

            } catch (oldErr) {
                console.error('Failed to copy text using execCommand: ', oldErr);
                // Alert the user if copying failed completely
                alert("Failed to copy the code. Please copy it manually.");
            }
        });
    } else {
        // Fallback for browsers that don't support the Clipboard API
        try {
            document.execCommand('copy');
            // Optional: Provide visual feedback
            const copyButton = document.getElementById('copy-button');
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000); // Change back after 2 seconds
        } catch (oldErr) {
            console.error('Failed to copy text using execCommand: ', oldErr);
            // Alert the user if copying failed completely
            alert("Failed to copy the code. Please copy it manually.");
        }
    }
}

// --- DOM Ready Handler ---
document.addEventListener('DOMContentLoaded', () => {
    const spoilerElement = document.querySelector('.spoiler');
    const codeContainer = document.querySelector('.code-container');
    const copyButton = document.getElementById('copy-button');
    const imageElement = document.querySelector('img');
    const titleElement = document.querySelector('h2');
    const utcClockElement = document.querySelector('.utc-clock');
    const utcNoteElement = document.querySelector('.utc-note');
    const currentUtcTimeElement = document.getElementById('current-utc-time');
    const tableToggleElement = document.querySelector('.table-toggle');
    const tableContainer = document.querySelector('.table-container');

    // Update UTC clock
    function updateUTCClock() {
        const now = new Date();
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        currentUtcTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        // Highlight current hour row in table if table is visible
        if (tableContainer.style.display === 'block') {
            highlightCurrentHourRow();
        }
    }

    // Highlight the row corresponding to the current UTC hour
    function highlightCurrentHourRow() {
        const now = new Date();
        const currentHourUTC = now.getUTCHours();
        
        // Remove highlight from all rows
        const rows = document.querySelectorAll('.codes-table tbody tr');
        rows.forEach(row => row.classList.remove('highlight-row'));
        
        // Add highlight to current hour's row
        if (rows[currentHourUTC]) {
            rows[currentHourUTC].classList.add('highlight-row');
        }
    }

    // Update UTC clock immediately and then every second
    updateUTCClock();
    setInterval(updateUTCClock, 1000);

    // Ensure code is updated even if container is hidden
    updateCode();

    // Add event listener to the spoiler element
    if (spoilerElement && codeContainer) {
        spoilerElement.addEventListener('click', () => {
            // Hide the spoiler element
            spoilerElement.style.display = 'none';
            // Show the code container
            codeContainer.style.display = 'flex';
        });
    }

    // Add event listener to the table toggle
    if (tableToggleElement && tableContainer) {
        tableToggleElement.addEventListener('click', () => {
            // Toggle table display
            if (tableContainer.style.display === 'block') {
                tableContainer.style.display = 'none';
                tableToggleElement.textContent = 'Click to view all codes by hour';
            } else {
                tableContainer.style.display = 'block';
                tableToggleElement.textContent = 'Click to hide codes table';
                highlightCurrentHourRow(); // Highlight current hour when showing table
            }
        });
    }

    // Add event listener to the copy button
    if (copyButton) {
        copyButton.addEventListener('click', copyCode);
    }

    // --- Entry Animation Logic ---
    const elementsToAnimate = [
        imageElement, 
        titleElement, 
        utcClockElement, 
        spoilerElement, 
        tableToggleElement, 
        utcNoteElement
    ];
    
    let delay = 100; // Initial delay in ms
    const delayIncrement = 200; // Additional delay between elements

    elementsToAnimate.forEach(element => {
        if (element) {
            setTimeout(() => {
                element.classList.add('animated');
            }, delay);
            delay += delayIncrement;
        }
    });

    // Update the code every minute to ensure it changes at the hour mark
    setInterval(updateCode, 60000); // Update every 60 seconds (1 minute)
});