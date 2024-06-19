<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useAppStore } from 'stores/app'
import { useHelperTablesStore } from 'stores/helperTables'
import { useDialogStore } from 'stores/dialog'
import WebSocketAsPromised from 'websocket-as-promised'



export default defineComponent({
  name: 'App',

  async beforeMount() {

    /** WS */
    const wssServer = 'wss://sinthy.fvds.ru:3031';
    this.$q.ws = new WebSocketAsPromised(wssServer, {
      packMessage: data => JSON.stringify(data),
      unpackMessage: data => JSON.parse(data),
      attachRequestId: (data, requestId) => Object.assign({ id: requestId }, data),
      extractRequestId: data => data && data.id
    });
    // Пробуем подключиться к серверу
    try {
      await this.$q.ws.open();
    }
    // Если ошибка подключения, то сообщаем и прерываем дальнейшее выполнение
    catch (e) {
      console.log(e);
      this.$q.dialogStore.set({
        show: true,
        title: 'Ошибка',
        text: 'Ошибка подключения к серверу ' + wssServer,
        ok: {
          color: 'red'
        }
      });
      window['splash-screen'].classList.add('ready', 'error');
      return;
    }
  },



})
</script>
