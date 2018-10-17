<template>
  <div class="main">
      <img src="../assets/icon.png" alt="SpotiFind icon" />
      <h3 class="main__subheading">Sign in to your Spotify account to get information about your currently playing track</h3>
      <button @click="handleAuth">SIGN IN</button>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  props: ["handleAuth"]
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 30%;
}

.main img {
  width: 30%;
}

.main button {
  padding: 2%;
  border: 1px solid #008f30;
  background-color: #118f19;
  transition: opacity 0.25s;
  cursor: pointer;
  color: #fff;
  font-weight: 700;
  border-radius: 50px;
  box-shadow: 2px 4px 7px #ccc;
}

.main button:hover {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .main {
    padding: 0 10%;
  }

  .main img {
    width: 40%;
  }

  .main button {
    padding: 3%;
  }
}
</style>
