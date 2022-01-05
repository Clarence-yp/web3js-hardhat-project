<template>
  <div class="app" id="app">
    <div class="container mx-auto">
      <div class="header-container">
        <p class="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
        <p class="sub-text">Team up to protect the Metaverse!</p>
        <div class="connect-wallet-container">
          <img
            src="<https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv>"
            alt="Monty Python Gif"
          />
          <button class="cta-button connect-wallet-button" @click="connect">
            Connect Wallet To Get Started
          </button>
        </div>
      </div>
      <div class="footer-container">
        <img
          alt="Twitter Logo"
          class="twitter-logo"
          src="./assets/twitter-logo.svg"
        />
        <a
          class="footer-text"
          :href="twitter_link"
          target="_blank"
          rel="noreferrer"
          >built by @{{ twitter_handle }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      twitter_handle: "Shehan_Atuk",
      twitter_link: "<https://twitter.com/Shehan_Atuk>",
    };
  },
    methods: {
      async connect() {
        await this.$store.dispatch("connect", true);
      },
    },
      async mounted(){
        await this.$store.dispatch("connect", false);
      },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
