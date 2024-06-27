<template>
  <router-view />
  <dialog-component/>
</template>

<script>
import { defineComponent } from 'vue'
import { useAppStore } from 'stores/app'
import { useHelperTablesStore } from 'stores/helperTables'
import { useDialogStore } from 'stores/dialog'
import WebSocketAsPromised from 'websocket-as-promised'

import DialogComponent from 'components/dialogs/DialogComponent'

import UserClass from 'src/utils/classes/User.Class'

export default defineComponent({
  name: 'App',

  components: {
    DialogComponent
  },

  setup () {
    const User = new UserClass();
    return {
      User
    }
  },

  async beforeMount () {

    /** STORES */
    this.$q.appStore = useAppStore();
    this.$q.helperTablesStore = useHelperTablesStore();
    this.$q.dialogStore = useDialogStore();

    /** WS */
    const wssServer = 'wss://sinthy.fvds.ru:3033';
    this.$q.ws = new WebSocketAsPromised(wssServer, {
      packMessage: data => JSON.stringify(data),
      unpackMessage: data => JSON.parse(data),
      attachRequestId: (data, requestId) => Object.assign({id: requestId}, data),
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


    /** AUTH */
    const resultAuth = await this.User.auth();
    // Если не авторизовались
    if (!resultAuth.success) {
      // Ничего не делаем
    }
    // Если авторизованы
    else {
      // Выполняем подготовительные действия, доступные только после успешной авторизации
      const resultAuthAfter = await this.User.authAfter();
      // Если ошибка

      /** Получаем все списки данных для работы **/

    }
    this.$q.appStore.set({
      ready: true
    });

    /** SPLASH SCREEN **/
    // Убираем splash screen
    window['splash-screen'].classList.add('ready');
    setTimeout(() => {
      window['splash-screen'].classList.add('fade');
      setTimeout(() => {
        window['splash-screen'].remove();
      }, 700);
    }, 1000);

  },

  methods: {
  }
})
</script>
