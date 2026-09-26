(function () {
  "use strict";

  const scene = document.querySelector("#raScene");
  const status = document.querySelector("#raStatus");
  const targetShort = document.querySelector("#target-curto");
  const targetLongo = document.querySelector("#target-longo");
  const targetAudio = document.querySelector("#target-audio");
  const shortVideo = document.querySelector("#video-curto");
  const longVideo = document.querySelector("#video-longo");
  const audio = document.querySelector("#audio-desc");

  const tracked = { curto: false, longo: false, marker: false };

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function playMedia(media) {
    try {
      const result = media?.play();
      if (result?.catch) result.catch(() => {});
    } catch { /* ignore */ }
  }

  // Prioridade: vídeo da página 06 > vídeo da página 04. O áudio só
  // toca com mira exclusiva no marcador (página fora de quadro).
  function update() {
    if (tracked.marker && !tracked.longo) {
      shortVideo?.pause();
      longVideo?.pause();
      targetAudio?.setAttribute("visible", "true");
      playMedia(audio);
      setStatus("Audiodescrição tocando.");
    } else if (tracked.longo) {
      audio?.pause();
      targetAudio?.setAttribute("visible", "false");
      shortVideo?.pause();
      playMedia(longVideo);
      setStatus("Página 06 reconhecida. Vídeo ativado.");
    } else if (tracked.curto) {
      audio?.pause();
      targetAudio?.setAttribute("visible", "false");
      longVideo?.pause();
      playMedia(shortVideo);
      setStatus("Página 04 reconhecida. Vídeo ativado.");
    } else {
      shortVideo?.pause();
      longVideo?.pause();
      audio?.pause();
      targetAudio?.setAttribute("visible", "false");
      setStatus("Aponte novamente para a página da cartilha.");
    }
  }

  function bindTarget(target, key) {
    target?.addEventListener("targetFound", () => { tracked[key] = true; update(); });
    target?.addEventListener("targetLost", () => { tracked[key] = false; update(); });
  }

  bindTarget(targetShort, "curto");
  bindTarget(targetLongo, "longo");
  bindTarget(targetAudio, "marker");

  scene?.addEventListener("arReady", () => setStatus("Câmera pronta."));
  scene?.addEventListener("arError", () => setStatus("Não foi possível iniciar a câmera."));
})();
