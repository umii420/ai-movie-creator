(() => {
  const searchInput = document.getElementById("musicSearch");
  const resultsHost = document.getElementById("appleMusicResults");
  const connectButton = document.getElementById("appleMusicConnect");
  const playerTitle = document.querySelector(".player-label strong");
  const playerArtist = document.querySelector(".player-label small");
  const playButton = document.querySelector(".player-controls .play");
  const playerStatus = document.querySelector(".player-status");
  if (!searchInput || !resultsHost || !connectButton) return;

  let musicKitReady = null;
  let searchTimer = null;
  let currentMusic = null;

  function showMessage(message) {
    resultsHost.replaceChildren();
    const note = document.createElement("p");
    note.className = "apple-music-message";
    note.textContent = message;
    resultsHost.appendChild(note);
  }

  async function initializeMusicKit() {
    if (musicKitReady) return musicKitReady;
    musicKitReady = (async () => {
      const response = await fetch("/api/apple-music-token", { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok || !data.token) throw new Error(data.error || "Apple Music setup is incomplete.");

      if (!window.MusicKit) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Apple Music player could not load."));
          document.head.appendChild(script);
        });
      }

      await window.MusicKit.configure({
        developerToken: data.token,
        storefrontId: "pk",
        app: { name: "TITAN AI", build: "1.0.0" }
      });
      return window.MusicKit.getInstance();
    })().catch(error => {
      musicKitReady = null;
      throw error;
    });
    return musicKitReady;
  }

  function renderSongs(songs) {
    resultsHost.replaceChildren();
    if (!songs.length) {
      showMessage("No songs found. Try another search.");
      return;
    }

    songs.forEach(song => {
      const attributes = song.attributes || {};
      const card = document.createElement("article");
      card.className = "apple-song-card";

      const artwork = document.createElement("img");
      artwork.alt = "";
      artwork.loading = "lazy";
      if (attributes.artwork && attributes.artwork.url) {
        artwork.src = attributes.artwork.url
          .replace("{w}", "120")
          .replace("{h}", "120");
      }

      const details = document.createElement("div");
      details.className = "apple-song-details";
      const title = document.createElement("strong");
      title.textContent = attributes.name || "Unknown song";
      const artist = document.createElement("span");
      artist.textContent = attributes.artistName || "Unknown artist";
      const preview = document.createElement("small");
      preview.textContent = attributes.previews && attributes.previews.length
        ? "Preview available"
        : "Preview unavailable";

      const play = document.createElement("button");
      play.type = "button";
      play.className = "apple-song-play";
      play.textContent = "Preview";
      play.disabled = !(attributes.previews && attributes.previews.length);
      play.addEventListener("click", async () => {
        try {
          const music = await initializeMusicKit();
          await music.setQueue({ song: song.id });
          await music.play();
          currentMusic = music;
          if (playerTitle) playerTitle.textContent = attributes.name || "Apple Music";
          if (playerArtist) playerArtist.textContent = attributes.artistName || "Preview";
          if (playerStatus) playerStatus.textContent = "APPLE MUSIC PREVIEW";
          if (playButton) playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } catch (error) {
          showMessage(error.message || "This preview could not be played.");
        }
      });

      details.append(title, artist, preview);
      card.append(artwork, details, play);
      resultsHost.appendChild(card);
    });
  }

  async function searchCatalog(term) {
    if (!term) {
      resultsHost.replaceChildren();
      return;
    }
    showMessage("Searching Apple Music…");
    try {
      const music = await initializeMusicKit();
      const response = await music.api.search(term, { types: "songs", limit: 20 });
      const songs = response && response.songs && response.songs.data
        ? response.songs.data
        : [];
      renderSongs(songs);
    } catch (error) {
      showMessage(error.message || "Apple Music search is temporarily unavailable.");
    }
  }

  connectButton.addEventListener("click", async () => {
    connectButton.disabled = true;
    connectButton.textContent = "Connecting…";
    try {
      await initializeMusicKit();
      connectButton.innerHTML = '<i class="fa-brands fa-apple"></i> Apple Music Ready';
      showMessage("Apple Music is ready. Search for a song to hear an available preview.");
    } catch (error) {
      connectButton.disabled = false;
      connectButton.textContent = "Connect Apple Music";
      showMessage(error.message || "Apple Music setup is not complete.");
    }
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    const term = searchInput.value.trim();
    searchTimer = setTimeout(() => searchCatalog(term), 450);
  });

  if (playButton) {
    playButton.addEventListener("click", async () => {
      if (!currentMusic) return;
      try {
        if (currentMusic.isPlaying) {
          await currentMusic.pause();
          playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        } else {
          await currentMusic.play();
          playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
      } catch (error) {
        if (playerStatus) playerStatus.textContent = "PLAYBACK UNAVAILABLE";
      }
    });
  }
})();
