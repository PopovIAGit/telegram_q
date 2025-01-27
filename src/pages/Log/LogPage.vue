<template>
  <q-page>
    <div class="container">
      <q-breadcrumbs>
        <template v-slot:separator>
          <q-icon name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Журнал" />
      </q-breadcrumbs>
      <h1>Журнал</h1>
      <div>
        <!-- Log List -->
        <!-- <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Log</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showTaskLog !== true ? 'visibility_off' : 'visibility'"
              @click="showTaskLog = !showTaskLog"
            />
          </q-toolbar>
          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showTaskLog">
              <q-item
                v-for="tgTask in paginatedTaskLog"
                :key="tgTask.id"
                v-ripple
                class="drawer-left__menu justify-between"
              >
                <q-item-section class="col-1">
                  <q-item-label>{{ tgTask.id }}</q-item-label>
                </q-item-section>
                <q-item-section class="col-4 .col-md-auto">
                  <q-item-label>
                    Task: id {{ tgTask.task_id }} , описание:
                    {{
                      this.$q.appStore.taskList.find(
                        (task) => task.id == tgTask.task_id
                      ).description
                    }}
                  </q-item-label>

                  <q-item-label caption lines="1"
                    >Channel: id {{ tgTask.channel_id }} , описание:
                    {{
                      this.$q.appStore.chanelList.find(
                        (channel) => channel.id == tgTask.channel_id
                      ).description
                    }}</q-item-label
                  >
                  <q-item-label caption lines="1"
                    >Account: id {{ tgTask.account_id }} , описание:
                    {{
                      this.$q.appStore.accountList.find(
                        (account) => account.id == tgTask.account_id
                      ).description
                    }}</q-item-label
                  >
                </q-item-section>
                <q-item-section class="col-4">
                  <q-item-label class="text-wrap">
                    Сообщение:
                    <a v-if="tgTask.url" :href="tgTask.url" target="_blank">{{
                      tgTask.url
                    }}</a>
                    <span v-else>{{ tgTask.url }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section class="col">
                  <q-item-label
                    >Дата: {{ formatDate(tgTask.date, "ru") }}</q-item-label
                  >
                </q-item-section>
                <q-item-section class="col">
                  <q-item-label
                    >Статус:
                    {{ tgTask.success ? "Успешно" : "Ошибка" }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
          <q-pagination
            class="q-pa-sm justify-center"
            direction-links
            boundary-links
            flat
            color="grey"
            active-color="primary"
            v-model="pagination.page"
            :max="Math.ceil(taskLog.length / pagination.rowsPerPage)"
            :max-pages="6"
            :rows-per-page-options="[10, 20, 50]"
            @update:model-value="updatePagination"
          />
        </div> -->
        <!-- LogTable -->
        <q-table
          color="primary"
          binary-state-sort
          :rows="this.taskLog"
          :columns="tableColumns"
          v-model:pagination="pagination"
          row-key="id"
          rows-per-page-label="Количество на странице"
          :rows-per-page-options="[5, 10, 20, 50]"
          :loading="loading"
          @request="getData"
          :grid="$q.screen.lt.md"
          :filter="filterForSearch"
        >
          <!-- <template v-slot:top-right>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filterForSearch"
              placeholder="Поиск"
              bg-color="white"
              hide-bottom-space
              autocomplete="off"
            >
              <template v-slot:append>
                <q-icon
                  v-if="filterForSearch !== ''"
                  name="close"
                  @click="search({ reset: true })"
                  class="cursor-pointer"
                />
                <q-icon
                  name="search"
                  @click="searchUser"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </template> -->
          <template v-slot:body-cell-accountTask="props">
            <q-td :props="props">
              <div>
                Аккаунт: {{ props.row.account_id }}
                {{
                  this.$q.appStore.accountList.find(
                    (account) => account.id == props.row.account_id
                  ).description
                }}
              </div>
              <div>
                Задача: {{ props.row.task_id }}
                {{
                  this.$q.appStore.taskList.find(
                    (task) => task.id == props.row.task_id
                  ).description
                }}
              </div>
              <div>
                Канал: {{ props.row.channel_id }}
                {{
                  this.$q.appStore.chanelList.find(
                    (channel) => channel.id == props.row.channel_id
                  ).description
                }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-url="props">
            <q-td :props="props">
              <div>
                <a
                  v-if="props.value"
                  :href="props.value"
                  color="purple"
                  :label="props.value"
                  target="_blank"
                  >{{ props.value }}</a
                >
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-success="props">
            <q-td :props="props">
              <q-badge
                :color="props.value == 'успешно' ? 'green' : 'red'"
                :label="props.value"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AccountClass from "src/utils/classes/Account.Class";
import ChanelClass from "src/utils/classes/Chanel.Class";
import TaskClass from "src/utils/classes/Task.Class";
import { date, useQuasar } from "quasar";

export default {
  name: "LogPage",

  setup() {
    const Task = new TaskClass();
    const Account = new AccountClass();
    const Chanel = new ChanelClass();
    const $q = useQuasar(); // для работы с квазаром
    const query = useRoute().query;

    const tableColumns = [
      {
        name: "id",
        label: "ID",
        field: "id",
        align: "left",
        sortable: true,
      },
      // {
      //   name: "accountTask",
      //   label: "Название",
      //   field: (row) => [row.account_id, row.task_id, row.channel_id],
      //   format: (val) => {
      //     const accountId = val[0];
      //     const taskId = val[1];
      //     const channelId = val[2];

      //     const account = $q.appStore.accountList.find(
      //       (account) => account.id == accountId
      //     );
      //     const task = $q.appStore.taskList.find((task) => task.id == taskId);
      //     const channel = $q.appStore.chanelList.find(
      //       (channel) => channel.id == channelId
      //     );

      //     return [
      //       `Account: id ${accountId} , описание: ${account.description}`,
      //       `Task: id ${taskId} , описание: ${task.description}`,
      //       `Channel: id ${channelId} , описание: ${channel.description}`,
      //     ].join("\n");
      //   },
      //   align: "left",
      // },
      {
        name: "Account",
        label: "Аккаунт",
        field: "account_id",
        align: "left",
        format: (val) => {
          if (val === null) {
            return "Аккаунт не указан";
          }

          const account = $q.appStore.accountList.find(
            (account) => account.id == val
          );
          return ` id ${account.id} ,  ${account.description}`;
        },
      },
      {
        name: "Channel",
        label: "Канал",
        field: "channel_id",
        align: "left",

        format: (val) => {
          console.log("Searching for channel with id:", val);
          console.log("Channel list:", $q.appStore.chanelList);

          if (val === null) {
            return "Канал не указан";
          }

          const channel = $q.appStore.chanelList.find(
            (channel) => channel.id == val
          );

          if (!channel) {
            console.warn("Channel not found for id:", val);
            return "Канал не указан";
          }

          return `id ${channel.id}, ${channel.description}`;
        },
      },
      {
        name: "Task",
        label: "Задача",
        field: "task_id",
        align: "left",

        format: (val) => {
          if (val === null) {
            return "Задача не указана";
          }

          const task = $q.appStore.taskList.find((task) => task.id == val);
          return `id ${task.id} , ${task.description}`;
        },
      },
      {
        name: "url",
        label: "Сообщение",
        field: "url",
        align: "left",
      },
      {
        name: "date",
        label: "Дата",
        field: "date",
        align: "left",
        sortable: true,
        format: (val) => {
          const date = new Date(val);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const seconds = date.getSeconds().toString().padStart(2, "0");
          return `${day}.${month}.${year}  ${hours}:${minutes}:${seconds}`;
        },
      },
      {
        name: "success",
        label: "Статус",
        field: "success",
        align: "left",
        sortable: true,
        format: (val) => {
          let status = "";
          switch (val) {
            case 0:
              status = "ошибка";
              break;
            case 1:
              status = "успешно";
              break;
            default:
              status = "неизвестный статус";
              break;
          }

          return status;
        },
      },
    ];

    const pagination = {
      page: query.page ? parseInt("" + query.page) : 1,
      rowsPerPage: query.rowsPerPage ? parseInt("" + query.rowsPerPage) : 5,
      sortBy: query.sortBy || "id",
      descending: query.descending ? query.descending === "true" : true,
      rowsNumber: 0,
    };

    let filterForSearch = ref({});

    if (query.filter) {
      try {
        filterForSearch = JSON.parse(query.filter);
      } catch (e) {}
    }
    const search = ref(query.search || "");

    return {
      // objects
      Task,
      Account,
      Chanel,
      // списки
      listOfTgAccounts: ref([]),
      listOfTgChanals: ref([]),
      listOfTasks: ref([]),
      taskLog: ref([]),
      // таблица
      tableColumns, // описание столбцов таблицы
      // журнал
      pagination: ref(pagination),
      paginatedTaskLog: ref([]), //
      filterForSearch, // строка поиска
      search,
      // признак
      loading: ref(false), // признак загрузки данных
      ready: ref(false), // признак готовности данных
      rowAcc: ref(""),
    };
  },

  async beforeMount() {
    await this.getData();
  },

  beforeRouteUpdate(to, from, next) {
    if (to.fullPath === "/log") {
      this.pagination.page = 1;
      this.pagination.sortBy = "id";
      this.pagination.descending = true;
      this.filterForSearch = "";
      next();
      setTimeout(() => {
        this.getTableData();
      }, 100);
    } else {
      next();
    }
  },

  methods: {
    async getData(props, params) {
      if (this.loading) return;
      this.loading = true;

      let { page, rowsPerPage, sortBy, descending } = props
        ? props.pagination
        : this.pagination;

      if (params && params.where) {
        where = params.where;
      }
      //#region получение списка аккаунтов
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
      //#endregion
      //#region получение списка каналов
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
        console.log("this.listOfTgChanals", this.listOfTgChanals);

        this.$q.appStore.set({ chanelList: this.listOfTgChanals });
      }
      //#endregion
      //#region получение списка задач
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
      //#endregion

      //#region получение лог задач

      this.$router.replace({
        query: {
          rowsPerPage,
          page,
          sortBy,
          descending,
          search: this.$route.query.search,
        },
      });
      const resultTaskLog = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgTask",
        method: "getLogList",
        args: {
          limit: rowsPerPage,
          offset: (page - 1) * rowsPerPage,
          search: this.$route.query.search,
          order: [[sortBy, descending ? "DESC" : "ASC"]],
        },
      });

      if (resultTaskLog.type === "answer") {
        this.taskLog = resultTaskLog.args.rows;
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.rowsNumber = resultTaskLog.args.count;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;
        this.pagesNumber = Math.ceil(
          resultTaskLog.args.count / this.pagination.rowsPerPage
        );
      } else {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка!",
          text: resultTaskLog.message,
          ok: {
            color: "red",
          },
        });
        this.taskLog = [];
      }
      //#endregion
      this.ready = true;
      this.loading = false;
    },
    search() {
      console.log("search", this.filterForSearch);
    },
    formatDate(dateString, locale) {
      return date.formatDate(dateString, "DD-MM-YYYY HH:mm:ss", {
        locale,
      });
    },
  },
  computed: {
    paginatedTaskLog() {
      return this.taskLog.map((task) => ({
        ...task,
        accountTask: `${task.account_id} (${task.task_id})`,
      }));
    },
  },
};
</script>
