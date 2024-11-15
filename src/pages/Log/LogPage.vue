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
        <!-- Log -->
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
          v-if="ready"
          color="primary"
          binary-state-sort
          :rows="this.taskLog"
          :columns="tableColumns"
          :pagination="pagination"
          row-key="id"
          rows-per-page-label="Количество на странице"
          :rows-per-page-options="[10, 20, 50]"
          :loading="loading"
          @request="getData"
          :grid="$q.screen.lt.md"
          :filter="filterForSearch"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filterForSearch"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
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
import TaskClass from "src/utils/classes/Task.Class";
import { date, useQuasar } from "quasar";

export default {
  name: "LogPage",

  setup() {
    const Task = new TaskClass();
    const $q = useQuasar();

    const tableColumns = [
      {
        name: "id",
        label: "ID",
        field: "id",
        align: "left",
        sortable: true,
      },
      {
        name: "accountTask",
        label: "Название",
        field: (row) => [row.account_id, row.task_id, row.channel_id],
        format: (val) => {
          const accountId = val[0];
          const taskId = val[1];
          const channelId = val[2];

          const account = $q.appStore.accountList.find(
            (account) => account.id == accountId
          );
          const task = $q.appStore.taskList.find((task) => task.id == taskId);
          const channel = $q.appStore.chanelList.find(
            (channel) => channel.id == channelId
          );

          return [
            `Account: id ${accountId} , описание: ${account.description}`,
            `Task: id ${taskId} , описание: ${task.description}`,
            `Channel: id ${channelId} , описание: ${channel.description}`,
          ].join("\n");
        },
        align: "left",
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

    return {
      Task,
      showTaskLog: ref(true),
      // журнал
      taskLog: ref([]),
      pagination: ref({
        page: 1,
        rowsPerPage: 10,
      }),
      paginatedTaskLog: ref([]),
      filterForSearch: ref(""),
      loading: ref(false),
      ready: ref(false),
      rowAcc: ref(""),
      tableColumns,
    };
  },

  async beforeMount() {
    if (this.loading) return;
    this.loading = true;
    await this.getData();
    this.taskLog = this.taskLog.reverse();
    this.updatePaginatedTaskLog();
    this.ready = true;
    this.loading = false;
  },

  methods: {
    async getData() {
      // получение лог задач
      const resultTaskLog = await this.Task.getTaskLog();
      console.log(" resultTaskLog", resultTaskLog);

      if (resultTaskLog.success) {
        this.taskLog = resultTaskLog.taskLog.rows;
      } else {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: resultTaskLog.message,
          ok: {
            color: "red",
          },
        });
        this.taskLog = [];
      }
    },
    updatePaginatedTaskLog() {
      const start = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      const end = start + this.pagination.rowsPerPage;
      this.paginatedTaskLog = this.taskLog.slice(start, end);
    },
    formatDate(dateString, locale) {
      return date.formatDate(dateString, "DD-MM-YYYY HH:mm:ss", {
        locale,
      });
    },
  },
  watch: {
    pagination: {
      handler() {
        this.updatePaginatedTaskLog();
      },
      deep: true,
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
