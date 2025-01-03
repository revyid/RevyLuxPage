        // Configuration
        const IPINFO_TOKEN = '612faf773381a7';

        // Helper function to get IP info
        async function getIpInfo(ip = '') {
            const url = `https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Could not retrieve location information');
            }

            const data = await response.json();
            const loc = data.loc ? data.loc.split(',') : [null, null];
            
            return {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country,
                latitude: loc[0],
                longitude: loc[1],
                organization: data.org,
                map_link: loc[0] && loc[1] ? `https://www.google.com/maps?q=${loc[0]},${loc[1]}` : null,
                hostname: data.hostname
            };
        }

        // Animate elements on page load
        document.addEventListener('DOMContentLoaded', () => {
            anime({
                targets: '.header',
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 1000,
                easing: 'easeOutExpo'
            });

            anime({
                targets: '.search-container',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 1000,
                delay: 200,
                easing: 'easeOutExpo'
            });

            anime({
                targets: '.info-card',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 1000,
                delay: 400,
                easing: 'easeOutExpo'
            });

            fetchData();
        });

        const ipInput = document.getElementById('ipInput');
        ipInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                fetchData(ipInput.value);
            }
        });

        async function fetchData(ip = '') {
            const loading = document.querySelector('.loading');
            const errorMessage = document.getElementById('errorMessage');
            const infoCard = document.getElementById('infoCard');

            loading.style.display = 'flex';
            errorMessage.style.display = 'none';
            infoCard.style.opacity = '0.5';

            try {
                const data = await getIpInfo(ip);
                const infoDiv = document.getElementById('info');
                
                infoDiv.innerHTML = `
                    <div class="info-item">
                        <h3>
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                            </svg>
                            IP Address
                        </h3>
                        <p>${data.ip}</p>
                    </div>
                    <div class="info-item">
                        <h3>
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            Location
                        </h3>
                        <p>${data.city}, ${data.region}, ${data.country}</p>
                    </div>
                    <div class="info-item">
                        <h3>
                            <svg viewBox="0 0 24 24">
                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                            </svg>
                            Organization
                        </h3>
                        <p>${data.organization || 'N/A'}</p>
                    </div>
                    <div class="info-item">
                        <h3>
                            <svg viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            Hostname
                        </h3>
                        <p>${data.hostname || 'N/A'}</p>
                    </div>
                `;

                if (data.map_link) {
                    infoDiv.innerHTML += `
                        <div class="info-item" style="grid-column: 1 / -1; text-align: center;">
                            <a href="${data.map_link}" target="_blank" class="map-button">
                                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
                                </svg>
                                View on Google Maps
                            </a>
                        </div>
                    `;
                }

anime({
                    targets: '.info-item',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: anime.stagger(100),
                    duration: 800,
                    easing: 'easeOutExpo'
                });

            } catch (error) {
                errorMessage.textContent = error.message || 'Error fetching data. Please try again.';
                errorMessage.style.display = 'block';
            } finally {
                loading.style.display = 'none';
                infoCard.style.opacity = '1';
            }
        }
