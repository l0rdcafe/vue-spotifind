<template>
  <div class="results">
      <p class="title">Welcome, <span class="user">{{ data.name }}. </span><span v-if="data.isPlaying">You're listening to <span class="song">{{ data.song }}</span> by <span class="artist">{{ data.artist }}.</span></span><span v-else-if="!data.isPlaying">You are currently not playing anything. Please play a song on Spotify.</span>
      </p>
      <ul v-if="songInfo" class="info">
        <li class="info__item">Duration: <span class="info__item__data">{{ data.duration }}</span></li>
        <li class="info__item">Tempo: <span class="info__item__data">{{ songInfo[0] }} BPM</span></li>
        <li class="info__item">Key: <span class="info__item__data">{{ songInfo[1] }}</span></li>
        <li class="info__item" style="display: flex;">Danceability: <div class="info__item__danceability" :style="{'background-color': songInfo[2]}"></div></li>
      </ul>
      <div v-if="annots" class="annots" v-html="annots.annot">
      </div>
      <div v-if="annots" v-html="annots.embed" class="embed"></div>
      <i v-else-if="songInfo && data.isPlaying" class="fas fa-spinner fa-lg fa-2x fa-spin" />
  </div>
</template>

<script>
export default {
  name: "Results",
  props: ["data", "songInfo", "annots"]
};
</script>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  margin-bottom: 2%;
}
.title {
  font-size: 1.5rem;
  padding: 0 20%;
}

.user {
  color: #476dc5;
  font-weight: 700;
}

.song,
.artist {
  color: #118f19;
  font-weight: 700;
}

.info {
  list-style: none;
  display: flex;
  justify-content: space-around;
  padding: 0 1%;
  margin-top: 3%;
}

.info__item__data {
  color: purple;
  font-weight: 700;
  margin: 0;
}

.info__item__danceability {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-left: 2%;
}

.annots {
  padding: 0 10%;
  margin-top: 3%;
}

.annots iframe,
.annots img {
  max-width: 100%;
}

.embed a,
.annots a {
  color: #476dc5;
  text-decoration: none;
}

.fa-spin {
  margin-top: 3%;
}

@media (max-width: 768px) {
  .title {
    padding: 0 2%;
  }

  .info {
    font-size: 0.75rem;
    justify-content: space-between;
  }
}
</style>
