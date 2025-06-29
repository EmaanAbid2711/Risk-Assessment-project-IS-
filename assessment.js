document.addEventListener('DOMContentLoaded', () => {
    const assessmentForm = document.getElementById('assessment-form');
    const resultsSection = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const recommendationsElement = document.getElementById('recommendations');

    assessmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(assessmentForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3001/api/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok) {
                // Show results
                assessmentForm.style.display = 'none';
                scoreElement.textContent = result.score;
                displayRecommendations(result.score);
                resultsSection.style.display = 'block';
            } else {
                alert('Failed to submit assessment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the assessment');
        }
    });

    function displayRecommendations(score) {
        let riskLevel = '';
        if (score <= 20) riskLevel = 'Low Risk';
        else if (score <= 40) riskLevel = 'Moderate Risk';
        else if (score <= 60) riskLevel = 'Medium Risk';
        else if (score <= 80) riskLevel = 'High Risk';
        else riskLevel = 'Very High Risk';

        recommendationsElement.innerHTML = `
            <h3>${riskLevel}</h3>
            <p>Based on your score of ${score}, here are our recommendations:</p>
            <ul>
                <li>Use a password manager to create and store strong, unique passwords</li>
                <li>Enable two-factor authentication on all important accounts</li>
                <li>Regularly review app permissions and revoke unnecessary access</li>
                ${score > 40 ? '<li>Consider using a VPN for public WiFi connections</li>' : ''}
                ${score > 60 ? '<li>Conduct a complete digital footprint audit</li>' : ''}
            </ul>
        `;
    }

    async function checkAuthStatus() {
        try {
            const response = await fetch('http://localhost:3001/api/assessments', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Auth check error:', error);
            window.location.href = 'index.html';
        }
    }

    // Call the auth check on page load
    checkAuthStatus();
});
