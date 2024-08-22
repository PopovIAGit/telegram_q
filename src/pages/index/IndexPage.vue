<template>
  <q-page>
    <div class="container">
      <h1>Главная</h1>
      <div
        class="q-pa-md fit row wrap justify- between items-stretch content-stretch full-width"
      >
        <!-- аккаунты -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Aкаутны</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showAccount !== true ? 'visibility_off' : 'visibility'"
              @click="showAccount = !showAccount"
            />
            <q-btn flat round dense icon="add" @click="showAccountAdd" />
          </q-toolbar>

          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showAccount">
              <q-item
                v-for="tgAccount in listOfTgAccounts"
                :key="tgAccount.id"
                v-ripple
                class="drawer-left__menu"
              >
                <!-- модальное окно -->
                <div class="q-pa-md q-gutter-sm">
                  <q-dialog v-model="inception">
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">Введите код активации</div>
                      </q-card-section>

                      <q-card-section class="q-pa-md">
                        <div class="q-mb-md">
                          Введите код пришедший на Телефон
                        </div>

                        <q-input
                          mask="#####"
                          v-model="code"
                          outlined
                          bg-color="white"
                          hide-bottom-space
                        ></q-input>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn
                          class="q-btn--outline-muted"
                          outline
                          no-caps
                          label="Отмена"
                          v-close-popup
                        />
                        <q-btn
                          unelevated
                          color="primary"
                          no-caps
                          label="Отправить"
                          @click="onSignIn(tgAccount.id, code)"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>
                <q-item-section>
                  <q-item-label>{{ tgAccount.id }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ tgAccount.phone }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    tgAccount.description
                  }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label v-if="tgAccount.active">
                    <!-- <q-icon
                      :name="
                        tgAccount.active !== 0
                          ? 'radio_button_checked'
                          : 'radio_button_unchecked'
                      "
                      :color="tgAccount.active !== 0 ? 'green' : 'grey'"
                    /> -->
                    <q-btn
                      flat
                      round
                      dense
                      icon="verified"
                      disabled
                      :color="tgAccount.active !== 0 ? 'green' : 'grey'"
                    >
                      <q-tooltip color="bg-accent">Активирован</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label v-else>
                    <q-btn
                      flat
                      round
                      dense
                      icon="verified"
                      @click="showAccountActive(tgAccount)"
                    >
                      <q-tooltip color="bg-accent">Активировать</q-tooltip>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      @click="showAccountUpdate(tgAccount)"
                      ><q-tooltip color="bg-accent"
                        >Редактировать</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <!-- каналы -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Каналы</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showChannel !== true ? 'visibility_off' : 'visibility'"
              @click="showChannel = !showChannel"
            />
            <q-btn flat round dense icon="add" @click="showChanelAdd" />
          </q-toolbar>
          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showChannel">
              <q-item
                v-for="tgChannel in listOfTgChanals"
                :key="tgChannel.id"
                v-ripple
                class="drawer-left__menu"
              >
                <q-item-section>
                  <q-item-label>{{
                    tgChannel && tgChannel.id ? tgChannel.id : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    tgChannel && tgChannel.url ? tgChannel.url : "N/A"
                  }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    tgChannel && tgChannel.description
                      ? tgChannel.description
                      : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <!-- <q-icon
                      :name="
                        tgChannel && tgChannel.active !== 0
                          ? 'radio_button_checked'
                          : 'radio_button_unchecked'
                      "
                      :color="
                        tgChannel && tgChannel.active !== 0 ? 'green' : 'grey'
                      "
                    /> -->
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      @click="showChanelUpdate(tgChannel)"
                      ><q-tooltip color="bg-accent"
                        >Редактировать</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <!-- Задачи -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Задачи</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showTask !== true ? 'visibility_off' : 'visibility'"
              @click="showTask = !showTask"
            />
            <q-btn flat round dense icon="add" @click="showTaskAdd" />
          </q-toolbar>
          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showTask">
              <q-item
                v-for="tgTask in listOfTasks"
                :key="tgTask.id"
                v-ripple
                class="drawer-left__menu"
              >
                <q-item-section>
                  <q-item-label>{{
                    tgTask && tgTask.id ? tgTask.id : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    tgTask && tgTask.message ? tgTask.message : "N/A"
                  }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    tgTask && tgTask.description ? tgTask.description : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-btn flat round dense icon="link"
                      ><q-tooltip color="bg-accent"
                        >Подключить канал</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-btn flat round dense icon="timer"
                      ><q-tooltip color="bg-accent"
                        >Расписание</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      @click="showTaskUpdate(tgTask)"
                      ><q-tooltip color="bg-accent"
                        >Редактировать</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>

        <!-- Log -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Log</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showTaskLog !== true ? 'visibility_off' : 'visibility'"
              @click="showTaskLog = !showTaskLog"
            />
            <q-btn flat round dense icon="add" @click="showTaskAdd" />
          </q-toolbar>
          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showTaskLog">
              <q-item
                v-for="tgTask in taskLog"
                :key="tgTask.id"
                v-ripple
                class="drawer-left__menu"
              >
                <q-item-section>
                  <q-item-label>{{ tgTask.id }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    Task: id {{ tgTask.task_id }} , описание:
                    {{
                      this.listOfTasks.find((task) => task.id == tgTask.task_id)
                        .description
                    }}
                  </q-item-label>

                  <q-item-label caption lines="1"
                    >Channel: id {{ tgTask.channel_id }} , описание:
                    {{
                      this.listOfTgChanals.find(
                        (channel) => channel.id == tgTask.channel_id
                      ).description
                    }}</q-item-label
                  >
                  <q-item-label caption lines="1"
                    >Account: id {{ tgTask.account_id }} , описание:
                    {{
                      this.listOfTgAccounts.find(
                        (account) => account.id == tgTask.account_id
                      ).description
                    }}</q-item-label
                  >
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    >Дата: {{ formatDate(tgTask.date, "ru") }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
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
      @onSaveChanel="onChanelSave"
      @onRemoveChanel="onChanelRemove"
    />
    <dialog-task-add-update
      :dialog="dialogTaskAddUpdate"
      @onSave="onTaskSave"
      @onRemove="onTaskRemove"
    />
  </q-page>
</template>



<script>
// TODO:1.  В заданиях при подключении канала не отображать уже подключённые;
// TODO:2.  Не понятно, что канал подключился к заданию;
// TODO:3.  Вывести отдельным окном или таблицей уже подключенные каналы, и предусмотреть отключение канала от задания (в api я добавлю);
// TODO:5.  Добавить расписание.

import { defineComponent, ref } from "vue";
import { date } from "quasar";

import AccountClass from "src/utils/classes/Account.Class";
import ChanelClass from "src/utils/classes/Chanel.Class";
import TaskClass from "src/utils/classes/Task.Class";
import DialogAccountAddUpdate from "components/dialogs/Account/DialogAccountAddUpdate";
import DialogChanelAddUpdate from "components/dialogs/Channel/DialogChanelAddUpdate";
import DialogTaskAddUpdate from "components/dialogs/Task/DialogTaskAddUpdate";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "IndexPage",
  components: {
    DialogAccountAddUpdate,
    DialogChanelAddUpdate,
    DialogTaskAddUpdate,
  },
  setup() {
    const Account = new AccountClass();
    const Chanel = new ChanelClass();
    const Task = new TaskClass();

    const dialogAccountAddUpdateDefault = Account.dialogAddUpdateDefault;
    const dialogChanelAddUpdateDefault = Chanel.dialogAddUpdateDefault;
    const dialogTaskAddUpdateDefault = Task.dialogAddUpdateDefault;

    return {
      listOfTgAccounts: ref([]),
      listOfTgChanals: ref([]),
      listOfTasks: ref([]),
      showAccount: ref(true),
      showChannel: ref(true),
      showTask: ref(true),
      showTaskLog: ref(true),
      Account,
      Chanel,
      Task,
      dialogAccountAddUpdateDefault,
      dialogAccountAddUpdate: ref({}),
      dialogChanelAddUpdateDefault,
      dialogChanelAddUpdate: ref({}),
      dialogTaskAddUpdateDefault,
      dialogTaskAddUpdate: ref({}),
      code: ref(),
      inception: ref(false),
      taskLog: ref([]),
    };
  },

  async beforeMount() {
    this.getData();
    // this.testPass();
  },

  methods: {
    async getData() {
      const responseTgAccounts = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgAccount",
        method: "getList",
        args: {},
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
        this.listOfTgAccounts = responseTgAccounts.args.rows.map((account) => {
          if (account.description === null) {
            account.description = "";
          }
          return account;
        });
        this.$q.appStore.set({ accountList: this.listOfTgAccounts });
      }

      const responseTgChannel = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgChannel",
        method: "getList",
        args: {},
      });
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
        this.listOfTgChanals = responseTgChannel.args.rows.map((channel) => {
          if (channel.description === null) {
            channel.description = "";
          }
          if (channel.url === null) {
            channel.url = "";
          }
          return channel;
        });
        this.$q.appStore.set({ listOfTgChanals: this.listOfTgChanals });
      }

      const responseTasks = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgTask",
        method: "getList",
        args: {},
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
        this.$q.appStore.set({ taskList: this.listOfTasks });
      }

      const resultTaskLog = await this.Task.getTaskLog();
      if (resultTaskLog.success) {
        this.taskLog = resultTaskLog.taskLog.rows;
      }

      const responseUser = await this.$q.ws.sendRequest({
        type: "query",
        iface: "user",
        method: "getList",
        args: {},
      });

      console.log("userList", responseUser);
    },
    formatDate(dateString, locale) {
      return date.formatDate(dateString, "DD-MM-YYYY HH:mm:ss", {
        locale,
      });
    },
    // Account
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
        dataWas: structuredClone(Account),
        data: structuredClone(Account),
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
    showAccountActive(Account) {
      this.onActivate(Account.id);
      this.inception = true;
    },
    async onActivate(id) {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Account.activate(id);
      this.processing = false;

      if (!result.success) {
        this.inception = false;
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      }
    },

    async onSignIn(id, code) {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Account.signIn(id, code);
      this.processing = false;
      if (!result.success) {
        this.inception = false;
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.code = null;
        this.inception = false;
        this.getData();
      }
    },
    // Chanel
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
      const excludeFields = ["isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogChanelAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogChanelAddUpdateDefault.data[key];
        }
      });

      this.dialogChanelAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogChannelAddUpdate = structuredClone(
            this.dialogChanelAddUpdateDefault
          )),
        dataWas: structuredClone(Chenal),
        data: structuredClone(Chenal),
      };
    },
    onChanelSave(result) {
      console.log(result);
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.chanel) {
        this.$q.dialogStore.set({
          show: true,
          title: "Канал сохронен",
        });
        this.dialogChanelAddUpdate.show = false;
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
        this.dialogChanelAddUpdate.show = false;
        this.getData();
      }
    },
    // task
    showTaskAdd() {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogTaskAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogTaskAddUpdateDefault.data[key];
        }
      });

      this.dialogTaskAddUpdate = {
        show: true,
        method: "add",
        onHide: () =>
          (this.dialogTaskAddUpdate = structuredClone(
            this.dialogTaskAddUpdateDefault
          )),
        data,
      };
    },
    showTaskUpdate(Task) {
      const excludeFields = ["isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogTaskAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogTaskAddUpdateDefault.data[key];
        }
      });

      this.dialogTaskAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogTaskAddUpdate = structuredClone(
            this.dialogTaskAddUpdateDefault
          )),
        dataWas: structuredClone(Task),
        data: structuredClone(Task),
      };
    },
    onTaskSave(result) {
      console.log(result);
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.task) {
        this.$q.dialogStore.set({
          show: true,
          title: "Task сохронен",
        });
        this.dialogTaskAddUpdate.show = false;
        this.getData();
      }
    },
    onTaskRemove(result) {
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
          title: "Task удален",
        });
        this.dialogTaskAddUpdate.show = false;
        this.getData();
      }
    },
  },
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
