import { createAudioPlayer } from "expo-audio";

const timesUpSource = require("@/assets/sounds/times-up.mp3");

let timesUpPlayer: ReturnType<typeof createAudioPlayer> | null = null;
let stopTimeout: ReturnType<typeof setTimeout> | null = null;

export function playTimesUpSound(durationMs = 3000) {
  if (stopTimeout) {
    clearTimeout(stopTimeout);
    stopTimeout = null;
  }
  if (timesUpPlayer) {
    try {
      timesUpPlayer.pause();
      timesUpPlayer.remove();
    } catch {
      // ignore
    }
    timesUpPlayer = null;
  }

  const player = createAudioPlayer(timesUpSource);
  timesUpPlayer = player;
  player.play();

  stopTimeout = setTimeout(() => {
    try {
      player.pause();
    } catch {
      // ignore
    }
  }, durationMs);
}

export function cleanupTimesUpSound() {
  if (stopTimeout) {
    clearTimeout(stopTimeout);
    stopTimeout = null;
  }
  if (timesUpPlayer) {
    try {
      timesUpPlayer.pause();
      timesUpPlayer.remove();
    } catch {
      // ignore
    }
    timesUpPlayer = null;
  }
}
