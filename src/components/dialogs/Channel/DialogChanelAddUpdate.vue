<template>
  <q-dialog v-model="dialog.show" @hide="dialog.onHide">
    <q-card style="width: 600px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section class="q-dialog__header">
          <div class="q-dialog__header-content">
            <div class="q-dialog__title">
              {{ dialog.method === "add" ? "Новый канал " : "Изменить канал" }}
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-dialog__body">
          <!-- Описание -->
          <div class="q-mb-md">
            <div class="label">
              {{ Chanel.fields.description.label }}
              {{ Chanel.fields.description.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.description"
              :min="Chanel.fields.description.min"
              :max="Chanel.fields.description.max"
              :required="Chanel.fields.description.required"
              :rules="[(val) => Chanel.fields.description.rules(val)]"
              hint="Описание канала"
            />
          </div>

          <!-- Адресс -->
          <div class="q-mb-md">
            <div class="label">
              {{ Chanel.fields.url.label }}
              {{ Chanel.fields.url.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.url"
              :mask="Chanel.fields.url.mask"
              unmasked-value
              :min="Chanel.fields.url.min"
              :max="Chanel.fields.url.max"
              :required="Chanel.fields.url.required"
              :rules="[(val) => Chanel.fields.url.rules(val)]"
              hint="Адресс канала"
            >
            </q-input>
          </div>
          <!-- Список тасков на канале -->
          <div class="q-mb-md" v-if="dialog.method === 'update'">
            <div class="label">Список задач на канале</div>
            <q-select
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="selectedOption"
              :options="options"
              label="подключенные задачи"
              :loading="isLoading"
              @focus="onPopupShow()"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-dialog__footer">
          <q-btn
            unelevated
            color="negative"
            no-caps
            label="Удалить"
            @click="onRemove"
            v-if="dialog.method === 'update'"
          >
            <q-tooltip class="bg-negative">Удалить канал</q-tooltip></q-btn
          >
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
            type="submit"
            label="Сохранить"
            ><q-tooltip class="bg-primary" v-if="dialog.method === 'add'"
              >Создать новый канал</q-tooltip
            >
            <q-tooltip class="bg-primary" v-else-if="dialog.method === 'update'"
              >Изменить канал</q-tooltip
            >
          </q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";

import ChanelClass from "src/utils/classes/Chanel.Class";
import TaskClass from "src/utils/classes/Task.Class";

export default defineComponent({
  name: "DialogChanelAddUpdate",

  props: ["dialog"],

  emits: {
    onSaveChanel: null,
    onRemoveChanel: null,
  },

  setup() {
    const Chanel = new ChanelClass();
    const Task = new TaskClass();
    return {
      Chanel,
      Task,
      selectedOption: ref(null),
      options: ref([]),
      isLoading: ref(false),
    };
  },

  methods: {
    async onPopupShow() {
      this.isLoading = true;
      try {
        this.options = await this.onGetChanelTaskList();
      } catch (error) {
        console.log(error);
        // Handle the error here
      } finally {
        this.isLoading = false;
      }
    },
    async onGetChanelTaskList() {
      const result = await this.Task.chanelTaskList(this.dialog.data.id);
      console.log("result", result);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
        return [];
      } else {
        return result.task.rows
          .map((item) => {
            const task = this.$q.appStore.taskList.find(
              (task) => task.id === item.task_id
            );
            // return {
            //   label: task.id + " - " + task.description,
            //   value: task.id,
            // };
            if (task && task.is_deleted === 0) {
              return {
                label: task.id + " - " + task.description,
                value: task.id,
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);
      }
    },
    async onSubmit() {
      if (this.processing) return;
      this.processing = true;
      if (this.dialog.method === "add") {
        this.dialog.data.owner_id = this.$q.appStore.user.id;
      }

      const result = await this.Chanel.save(
        this.dialog.method,
        this.dialog.data,
        this.dialog.dataWas
      );
      this.processing = false;
      this.$emit("onSaveChanel", result);
    },

    async onRemove() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Chanel.delete(this.dialog.data.id);

      this.processing = false;
      this.$emit("onRemoveChanel", result);
    },
  },
});
</script>
