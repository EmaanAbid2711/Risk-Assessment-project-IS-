document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('history-list');
    const tipsContent = document.getElementById('tips-content');
    const logoutBtn = document.getElementById('logout');

    // Load assessment history
    loadAssessmentHistory();

    // Load privacy tips
    loadPrivacyTips();

    // Handle logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('http://localhost:3001/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = 'index.html'; // Redirect to login page after logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    // Check auth status
    checkAuthStatus();
});

async function loadAssessmentHistory() {
    try {
        const response = await fetch('http://localhost:3001/api/assessments', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const assessments = await response.json();
            console.log("Fetched assessments:", assessments);  // Debugging log
            if (assessments.length === 0) {
                displayAssessments([]);
            } else {
                displayAssessments(assessments);
            }
        } else {
            console.error('Failed to load assessments');
            displayAssessments([]);
        }
    } catch (error) {
        console.error('Error fetching assessments:', error);
        displayAssessments([]);
    }
}

function displayAssessments(assessments) {
    const historyList = document.getElementById('history-list');

    if (assessments.length === 0) {
        historyList.innerHTML = '<p>No assessments found. <a href="assessment.html">Take your first assessment</a></p>';
        return;
    }

    let html = '<div class="assessment-grid">';
    assessments.forEach(assessment => {
        const date = new Date(assessment.created_at).toLocaleDateString(); // Make sure field is correct
        html += `
            <div class="assessment-card">
                <h3>Assessment from ${date}</h3>
                <div class="score">Score: ${assessment.riskScore ?? 'N/A'}/100</div>
                <div class="details">
                    <p><strong>Location Sharing:</strong> ${assessment.sharesLocation ?? 'N/A'}</p>
                    <p><strong>Social Media:</strong> ${assessment.usesSocialMedia ?? 'N/A'}</p>
                    <p><strong>Accounts:</strong> ${assessment.numberOfAccounts ?? 'N/A'}</p>
                    <p><strong>Uses Public Wifi:</strong> ${assessment.usesPublicWifi ?? 'N/A'}</p>
                    <p><strong>Password Habits:</strong> ${assessment.passwordHabits ?? 'N/A'}</p>
                    <p><strong>2FA Enabled:</strong> ${assessment.twoFactorEnabled ?? 'N/A'}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';

    historyList.innerHTML = html;
}

async function loadPrivacyTips() {
    try {
        // Replace with actual tips API if needed
        displayTips([1, 2, 3, 4, 5]);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayTips(tips) {
    const tipsContent = document.getElementById('tips-content');

    let html = '<div class="tips-grid">';
    tips.forEach(tip => {
        html += `
            <div class="tip-card">
                <h3>For scores </h3>
                <div class="tip-content"></div>
            </div>
        `;
    });
    html += '</div>';

    tipsContent.innerHTML = html;
}

async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:3001/api/assessments', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.href = 'index.html'; // Redirect to login if not authenticated
        }
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'index.html'; // Redirect to login if error occurs
    }
}
