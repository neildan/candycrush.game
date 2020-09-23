<!--
  |--------------------------------------------------------------------------
  | @author Daniel Valencia <danielfelipeluis@outlook>
  |--------------------------------------------------------------------------
-->
<template>
  <div>
    <b-container id="main-container">
      <!-- Title -->
      <h1 id="title-main" class="color-yellow text-center mt-3 mb-4">Match Game</h1>

      <b-row align-h="center">
        <!-- Dashboard Panel-->
        <b-col sm="12" md="7" lg="8" xl="8" class="row justify-content-center">
          <div id="dashboard-panel">
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />

            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />

            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />

            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />

            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />

            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />

            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
            <img :src="imgCandy1" />
          </div>
        </b-col>

        <!-- Statistics Panel -->
        <b-col sm="12" md="5" lg="4" xl="4">
          <b-col cols="12" class="pl-4 pr-4">
            <b-row class="statistics">
              
              <!-- Score -->
              <b-col cols="4" md="12">
                <div class="box-game">
                  <p class="color-light-yellow">Score</p>
                  <p class="color-light-yellow">{{ score }}</p>
                </div>
              </b-col>

              <!-- Movements -->
              <b-col cols="4" md="12">
                <div class="box-game">
                  <p class="color-light-yellow">Movements</p>
                  <p class="color-light-yellow">{{ movements }}</p>
                </div>
              </b-col>

              <!-- Time -->
              <b-col cols="4" md="12">
                <div class="box-game">
                  <p class="color-light-yellow">Time</p>
                  <p
                    class="color-light-yellow"
                    id="timer"
                    data-minutes-left="2"
                  >{{ time }}</p>
                </div>
              </b-col>

              <b-col cols="12">
                <button id="btn-restart"><span class="font-game">Start</span></button>
              </b-col>
            </b-row>
          </b-col>
        </b-col>
      </b-row>
    </b-container>

    <!-- Unavailable -->
    <p id="mode-unavailable-text">No disponible en estas dimensiones</p>
  </div>
</template>

<script>
import img1 from "../assets/image/board_elements/candies/1.png";

export default {
  name: "Game",
  data() {
    return {
      imgCandy1: img1,
      score: 1503,
      movements: 203,
      time: "02:00",
    };
  },
  methods: {},
  mounted() {
    const $ = window.$;
    require("jquery-countdown-timer-control")($);
  },
};
</script>