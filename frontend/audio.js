const bgMusic = document.getElementById("bgMusic");

window.addEventListener("load", () => {
  bgMusic.volume = 0.2; // lower volume to improve autoplay chance
  bgMusic.play().catch(() => {
    console.log(
      "Autoplay blocked by browser. Music will play on first interaction.",
    );

    // fallback: play music on first user interaction
    const playOnInteraction = () => {
      bgMusic.play();
      document.removeEventListener("click", playOnInteraction);
      document.removeEventListener("keydown", playOnInteraction);
    };

    document.addEventListener("click", playOnInteraction);
    document.addEventListener("keydown", playOnInteraction);
  });
});
