const clientId = '';
const redirectURI = 'http://localhost:3000/'; 
let accessToken = '';

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        };

        const urlExpTime = window.location.href.match(/expires_in=([^&]*)/); 
        const urlToken = window.location.href.match(/access_token=([^&]*)/);
            
        if(urlExpTime && urlToken) {
            accessToken = urlToken[1];
            const expiresIn = Number(urlExpTime[1]);

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`)
        };
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(response => { 
            return response.json();
        })
        .then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            };

            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },

    savePlaylist(playlistName, trackURIs) {
        if(!playlistName || !trackURIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId = '';

        return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackURIs })
                })
            });
        });
    }
};

export default Spotify;