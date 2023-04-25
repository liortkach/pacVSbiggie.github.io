  // mute music button
  function handleMuteMusic(){

    if (isMusicPlaying) {
        // Mute the music
        currentMusic.muted = true;
        isMusicPlaying = false;
      }
       else {
        currentMusic.muted = false;
        isMusicPlaying = true;
      }
      
      // Update the button img
      var btn = document.getElementById("mute-btn");
      if (isMusicPlaying) {
        btn.style.backgroundImage = "url('images/speaker-filled-audio-tool.png')";
    } else {
        btn.style.backgroundImage = "url('images/volume-off-indicator.png')";
      }
 }

 function triggerEndedEvent(audioElement) {
  const endedEvent = new Event('ended');
  audioElement.dispatchEvent(endedEvent);
}

function switchMusic(musicToPlay){

    currentMusic.pause();
    currentMusic = musicToPlay;

    if (!gamePaused)
    {
      currentMusic.currentTime = 0;
    }

    if( !isMusicPlaying ){
        currentMusic.muted = true;
    } else {
      currentMusic.muted = false;
    }

    currentMusic.play();

}