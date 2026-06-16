// Thin wrapper around Phaser's sound manager so missing audio files
// (no real assets shipped yet) log a warning instead of throwing.
//
// Source CC0 SFX/music from: freesound.org, Pixabay Audio, FreePD.com.
// Drop files into public/assets/audio/ using the keys preloaded in
// BootScene (jump, coffee, stomp, hurt, win, bgm-beach).

function warnMissing(key) {
  console.warn(
    `[audio] "${key}" not loaded, skipping playback. Add public/assets/audio/${key}.mp3 (CC0: freesound.org, Pixabay Audio, FreePD.com).`
  );
}

export function isAudioReady(scene, key) {
  return scene.cache.audio.exists(key);
}

export function playSound(scene, key, config) {
  if (!isAudioReady(scene, key)) {
    warnMissing(key);
    return null;
  }
  return scene.sound.play(key, config);
}

export function addSound(scene, key, config) {
  if (!isAudioReady(scene, key)) {
    warnMissing(key);
    return null;
  }
  return scene.sound.add(key, config);
}
