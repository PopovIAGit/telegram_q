<template>
  <q-page>
    <div class="container">
      <h1>Главная</h1>
      <div class="q-pa-md fit row wrap justify-center items-stretch content-stretch full-width" >

      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "IndexPage",
  components: {

  },
  setup() {

    return {

    };
  },

  async beforeMount() {
    const response = await this.$q.ws.sendRequest({
        type: "query",
        iface: "user",
        method: "update",
        args: {
          id: "1",
          login: "user",
        },
      });
      // Если ошибка получения списка тикетов
     console.log(response);

  },

  methods: {
}
});
</script>

<style lang="scss">
.example-row-column-width {
  .row > div {
    padding: 10px 15px;
  }
  .row + .row {
    margin-top: 1rem;
  }
}
</style>
