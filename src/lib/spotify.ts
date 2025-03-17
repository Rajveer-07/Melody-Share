const CLIENT_ID = "20abdc95aa1a47db9bd68a1a27fc39b6";
const CLIENT_SECRET = "38bfa455eb934fd590e5cf99af950a1e";

let accessToken = "";
let tokenExpirationTime = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpirationTime = Date.now() + (data.expires_in * 1000);
  return accessToken;
}

export async function searchSongs(query: string) {
  const token = await getAccessToken();
  
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.tracks.items;
}

export function getSpotifyEmbedUrl(trackId: string) {
  return `https://open.spotify.com/embed/track/${trackId}`;
}
