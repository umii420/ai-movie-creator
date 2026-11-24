(() => {
  const searchInput = document.getElementById("musicSearch");
  const resultsHost = document.getElementById("jamendoMusicResults");
  const connectButton = document.getElementById("jamendoConnect");
  const infoButton = document.getElementById("jamendoInfo");
  const playerTitle = document.querySelector(".player-label strong");
  const playerArtist = document.querySelector(".player-label small");
  const playButton = document.querySelector(".player-controls .play");
  const playerStatus = document.querySelector(".player-status");
  const playerCover = document.querySelector(".player-cover");
  if (!searchInput || !resultsHost) return;

  const audio = new Audio();
  audio.preload = "none";
  let timer = null;
  let activeTrack = null;

  function message(text) {
    resultsHost.replaceChildren();
    const note = document.createElement("p");
    note.className = "jamendo-music-message";
    note.textContent = text;
    resultsHost.appendChild(note);
  }

  function playTrack(track) {
    if (!track.audio) {
      message("This track does not currently provide a playable stream.");
      return;
    }
    activeTrack = track;
    audio.src = track.audio;
    audio.play().then(() => {
      if (playerTitle) playerTitle.textContent = track.name || "Unknown track";
      if (playerArtist) playerArtist.textContent = track.artist || "Independent artist";
      if (playerStatus) playerStatus.textContent = "JAMENDO • LICENSED TRACK";
      if (playerCover && track.image) {
        playerCover.style.backgroundImage = 'url("' + track.image.replace(/["\\]/g, "") + '")';
        playerCover.style.backgroundSize = "cover";
      }
      if (playButton) playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }).catch(() => message("Playback could not start. Please try another track."));
  }

  function renderTracks(tracks) {
    resultsHost.replaceChildren();
    if (!tracks.length) return message("No tracks found. Try another song, artist, or genre.");
    tracks.forEach(track => {
      const card = document.createElement("article");
      card.className = "jamendo-song-card";
      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      image.src = track.image || "";
      const details = document.createElement("div");
      details.className = "jamendo-song-details";
      const title = document.createElement("strong");
      title.textContent = track.name || "Unknown track";
      const artist = document.createElement("span");
      artist.textContent = track.artist || "Independent artist";
      const license = document.createElement("small");
      license.textContent = track.license ? "License details available" : "Check artist terms before reuse";
      if (track.license) {
        const link = document.createElement("a");
        link.href = track.license;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View license";
        link.className = "jamendo-license-link";
        details.append(title, artist, license, link);
      } else {
        details.append(title, artist, license);
      }
      const play = document.createElement("button");
      play.type = "button";
      play.className = "jamendo-song-play";
      play.textContent = "Play";
      play.disabled = !track.audio;
      play.addEventListener("click", () => playTrack(track));
      card.append(image, details, play);
      resultsHost.appendChild(card);
    });
  }

  async function search(term) {
    if (!term) {
      resultsHost.replaceChildren();
      return;
    }
    message("Searching Jamendo…");
    try {
      const response = await fetch("/api/jamendo-search?q=" + encodeURIComponent(term), {
        headers: { Accept: "application/json" }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Jamendo search failed.");
      renderTracks(data.tracks || []);
    } catch (error) {
      message(error.message || "Jamendo is temporarily unavailable.");
    }
  }

  searchInput.addEventListener("input", () => {
    clearTimeout(timer);
    const term = searchInput.value.trim();
    timer = setTimeout(() => search(term), 400);
  });

  if (connectButton) connectButton.addEventListener("click", () => {
    searchInput.focus();
    if (searchInput.value.trim()) search(searchInput.value.trim());
    else message("Search for a song, artist, or genre to explore Jamendo.");
  });
  if (infoButton) infoButton.addEventListener("click", () => {
    message("Jamendo provides independent music. Every track has its own license; check its license before using it in videos, downloads, or monetized content.");
  });

  if (playButton) playButton.addEventListener("click", () => {
    if (!activeTrack) return;
    if (audio.paused) audio.play().then(() => {
      playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }).catch(() => {});
    else {
      audio.pause();
      playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });
  audio.addEventListener("ended", () => {
    if (playButton) playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
  });
})();
