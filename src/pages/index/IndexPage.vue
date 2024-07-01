<template>
  <q-page>
    <div class="container">
      <h1>Главная</h1>
      <div class="q-pa-md fit row wrap justify- between items-stretch content-stretch full-width">
        <!-- аккаунты -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Aкаутны</q-toolbar-title>
            <q-btn flat round dense :icon="showAccount !== true ? 'visibility_off' :   'visibility'" @click="showAccount = !showAccount" />
            <q-btn flat round dense icon="add" @click="showAccountAdd" />
          </q-toolbar>
          <q-list bordered separator v-if="showAccount">
            <q-item v-for="tgAccount in listOfTgAccounts" :key="tgAccount.id" clickable v-ripple
              class="drawer-left__menu">
              <q-item-section>
                <q-item-label>{{ tgAccount.id }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ tgAccount.phone }}</q-item-label>
                <q-item-label caption lines="1">{{ tgAccount.description }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-icon :name="tgAccount.active !== 0 ? 'radio_button_checked' : 'radio_button_unchecked'"
                    :color="tgAccount.active !== 0 ? 'green' : 'grey'" />
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-btn flat round dense icon="edit" @click="showAccountUpdate(tgAccount)" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <!-- каналы -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Каналы</q-toolbar-title>
            <q-btn flat round dense :icon="showChannel !== true ? 'visibility_off' :   'visibility'" @click="showChannel = !showChannel" />
            <q-btn flat round dense icon="add" @click="showChanelAdd" />
          </q-toolbar>
          <q-list bordered separator v-if="showChannel">
            <q-item v-for="tgChannel in listOfTgChanals" :key="tgChannel.id" clickable v-ripple
              class="drawer-left__menu">
              <q-item-section>
                <q-item-label>{{ tgChannel && tgChannel.id ? tgChannel.id : 'N/A' }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ tgChannel && tgChannel.url ? tgChannel.url : 'N/A' }}</q-item-label>
                <q-item-label caption lines="1">{{ tgAccount && tgAccount.description ? tgAccount.description : 'N/A'
                  }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-icon
                    :name="tgChannel && tgChannel.active !== 0 ? 'radio_button_checked' : 'radio_button_unchecked'"
                    :color="tgChannel && tgChannel.active !== 0 ? 'green' : 'grey'" />
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-btn flat round dense icon="edit" @click="showChanelUpdate(tgChannel)" />
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </div>
        <!-- Задачи -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Задачи</q-toolbar-title>
            <q-btn flat round dense :icon="showTask !== true ? 'visibility_off' :   'visibility'" @click="showTask = !showTask" />
            <q-btn flat round dense icon="add" @click="addChannel" />
          </q-toolbar>
          <q-list bordered separator v-if="showTask">
            <q-item v-for="tgTask in listOfTasks" :key="tgTask.id" clickable v-ripple class="drawer-left__menu">
              <q-item-section>
                <q-item-label>{{ tgTask && tgTask.id ? tgTask.id : 'N/A' }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ tgTask && tgTask.url ? tgTask.url : 'N/A' }}</q-item-label>
                <q-item-label caption lines="1">{{ tgTask && tgTask.description ? tgTask.description : 'N/A'
                  }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-icon :name="tgTask && tgTask.active !== 0 ? 'radio_button_checked' : 'radio_button_unchecked'"
                    :color="tgTask && tgTask.active !== 0 ? 'green' : 'grey'" />
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-btn flat round dense icon="edit" @click="editChannel" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
    <dialog-account-add-update
    :dialog="dialogAccountAddUpdate"
    @onSave="onAccountSave"
    @onRemove="onAccountRemove"
  />
  <dialog-chanel-add-update
    :dialog="dialogChanelAddUpdate"
    @onSave="onChanelSave"
    @onRemove="onChanelRemove"
  />
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

import AccountClass from 'src/utils/classes/Account.Class'
import ChanelClass from 'src/utils/classes/Chanel.Class'
import DialogAccountAddUpdate from 'components/dialogs/Account/DialogAccountAddUpdate'
import DialogChanelAddUpdate from 'components/dialogs/Channel/DialogChanelAddUpdate'
import { useRoute } from "vue-router";

export default defineComponent({
  name: "IndexPage",
  components: {
    DialogAccountAddUpdate,
    DialogChanelAddUpdate
  },
  setup() {

    const Account = new AccountClass();
    const Chanel = new ChanelClass();

    const dialogAccountAddUpdateDefault = Account.dialogAddUpdateDefault;
    const dialogChanelAddUpdateDefault = Chanel.dialogAddUpdateDefault;

    return {
      listOfTgAccounts: ref([]),
      listOfTgChanals: ref([]),
      listOfTasks: ref([]),
      showAccount: ref(true),
      showChannel: ref(true),
      showTask: ref(true),
      Account,
      Chanel,
      dialogAccountAddUpdateDefault,
      dialogAccountAddUpdate: ref({}),
      dialogChanelAddUpdateDefault,
      dialogChanelAddUpdate: ref({}),
    };
  },

  async beforeMount() {
    this.getData();
  },

  methods: {

    async getData(){
      const responseTgAccounts = await this.$q.ws.sendRequest({
      type: 'query',
      iface: 'tgAccount',
      method: 'getList',
      args: {}
    });

    if (responseTgAccounts.type === "error") {
      this.$q.dialogStore.set({
        show: true,
        title: "Ошибка",
        text: "Ошибка получения списка аккаунтов",
        ok: {
          color: "red",
        },
      });
    } else if (responseTgAccounts.type === "answer") {
      this.listOfTgAccounts = responseTgAccounts.args.rows.map(account => {
        if (account.description === null) {
            account.description = '';
        }
        return account;
    });

    }

    const responseTgChannel = await this.$q.ws.sendRequest({
      type: 'query',
      iface: 'tgChannel',
      method: 'getList',
      args: {}
    })
    console.log(responseTgChannel);
    if (responseTgChannel.type === "error") {
      this.$q.dialogStore.set({
        show: true,
        title: "Ошибка",
        text: "Ошибка получения списка каналов",
        ok: {
          color: "red",
        },
      });
    } else if (responseTgChannel.type === "answer") {
      this.listOfTgChanals = responseTgChannel.args.rows.map(channel => {
        if (channel.description === null) {
            channel.description = '';
        }
        if (channel.url === null) {
            channel.url = '';
        }
        return channel;
      });
    }

    const responseTasks = await this.$q.ws.sendRequest({
      type: 'query',
      iface: 'task',
      method: 'getList',
      args: {}
    });
    if (responseTasks.type === "error") {
      this.$q.dialogStore.set({
        show: true,
        title: "Ошибка",
        text: "Ошибка получения списка задач",
        ok: {
          color: "red",
        },
      });
    } else if (responseTasks.type === "answer") {
      this.listOfTasks = responseTasks.args.rows;
    }


    },

    showAccountAdd() {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogAccountAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogAccountAddUpdateDefault.data[key];
        }
      });
      this.dialogAccountAddUpdate = {
        show: true,
        method: "add",
        onHide: () =>
          (this.dialogAccountAddUpdate = structuredClone(
            this.dialogAccountAddUpdateDefault
          )),
        data,
      };
    },
    showAccountUpdate(Account) {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogAccountAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogAccountAddUpdateDefault.data[key];
        }
      });
      this.dialogAccountAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogAccountAddUpdate = structuredClone(
            this.dialogAccountAddUpdateDefault
          )),
          dataWas:structuredClone(Account),
          data:structuredClone(Account)
      };
    },
    onAccountSave(result) {

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.Account) {

        this.$q.dialogStore.set({
          show: true,
          title: "Аккаунт сохронен",
        });
        this.dialogAccountAddUpdate.show = false;
        this.getData();
      }
    },
    onAccountRemove(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success) {

        this.$q.dialogStore.set({
          show: true,
          title: "Аккаунт удален",
        });
        this.dialogAccountAddUpdate.show = false;
        this.getData();
      }
    },
    showChanelAdd() {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogChanelAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogChanelAddUpdateDefault.data[key];
        }
      });

      this.dialogChanelAddUpdate = {
        show: true,
        method: "add",
        onHide: () =>
          (this.dialogChannelAddUpdate = structuredClone(
            this.dialogChanelAddUpdateDefault
          )),
        data,
      };
    },
    showChanelUpdate(Chenal) {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogChanelAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogChanelAddUpdateDefault.data[key];
        }
      });
      this.dialogChannelAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogChannelAddUpdate = structuredClone(
            this.dialogChanelAddUpdateDefault
          )),
          dataWas:structuredClone(Chenal),
          data:structuredClone(Chenal)
      };
    },
    onChanelSave(result) {

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.Account) {

        this.$q.dialogStore.set({
          show: true,
          title: "Канал сохронен",
        });
        this.dialogAccountAddUpdate.show = false;
        this.getData();
      }
    },
    onChanelRemove(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success) {

        this.$q.dialogStore.set({
          show: true,
          title: "Канал удален",
        });
        this.dialogAccountAddUpdate.show = false;
        this.getData();
      }
    },
  }
});
</script>

<style lang="scss">
.example-row-column-width {
  .row>div {
    padding: 10px 15px;
  }

  .row+.row {
    margin-top: 1rem;
  }
}
</style>
