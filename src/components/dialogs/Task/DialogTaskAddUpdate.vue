<template>
  <q-dialog v-model="dialog.show" @hide="dialog.onHide">
    <q-card style="width: 600px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section class="q-dialog__header">
          <div class="q-dialog__header-content">
            <div class="q-dialog__title">
              {{ dialog.method === "add" ? "Новый таск " : "Изменить таск" }}
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-dialog__body">
          <!-- Описание -->
          <div class="q-mb-md">
            <div class="label">
              {{ Task.fields.description.label }}
              {{ Task.fields.description.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.description"
              :min="Task.fields.description.min"
              :max="Task.fields.description.max"
              :required="Task.fields.description.required"
              :rules="[(val) => Task.fields.description.rules(val)]"
            />
          </div>

          <!-- message -->
          <div class="q-mb-md">
            <div class="label">
              {{ Task.fields.message.label }}
              {{ Task.fields.message.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.message"
              :mask="Task.fields.message.mask"
              unmasked-value
              :min="Task.fields.message.min"
              :max="Task.fields.message.max"
              :required="Task.fields.message.required"
              :rules="[(val) => Task.fields.message.rules(val)]"
            >
            </q-input>
          </div>
          <!-- chanelId -->
          <div class="q-mb-md">
            <div class="label">
              {{ Task.fields.chanelId.label }}
              {{ Task.fields.chanelId.required ? "*" : "" }}
            </div>
            <q-select
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.chanelId"
              :required="Task.fields.chanelId.required"
              :options="filteredOptions"
            >
            </q-select>
          </div>
          <!-- chanelAddList -->
          <div class="q-mb-md" v-if="dialog.method === 'update'">
            <div class="label">Лист подключенных каналов</div>
            <q-list bordered separator>
              <q-item
                v-for="tgChannel in onGetListAddChanels()"
                :key="tgChannel.id"
                v-ripple
              >
                <q-item-section>{{ tgChannel.channel_id }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-section class="q-dialog__footer">
          <q-btn
            unelevated
            color="primary"
            no-caps
            @click="onAdd"
            label="Добавить канал к таску"
            v-if="dialog.method === 'update'"
          />
          <q-btn
            unelevated
            color="negative"
            no-caps
            label="Удалить"
            @click="onRemove"
            v-if="dialog.method === 'update'"
          />
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
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";

import TaskClass from "src/utils/classes/Task.Class";

export default defineComponent({
  name: "DialogTaskAddUpdate",

  props: ["dialog"],

  emits: {
    onSave: null,
    onRemove: null,
  },
  setup() {
    const Task = new TaskClass();

    return {
      Task,
      ListAddChanels: ref([]),
    };
  },
  computed: {
    filteredOptions() {
      return this.$q.appStore.listOfTgChanals
        .filter(
          (item) =>
            !this.ListAddChanels.some(
              (tgChannel) => tgChannel.channel_id === item.id
            )
        )
        .map((item) => ({
          label: item.description,
          value: item.id,
        }));
    },
  },

  methods: {
    async onGetListAddChanels() {
      const result = await this.Task.taskChanelList(this.dialog.data.id);
      this.ListAddChanels = result.task.rows;
      console.log(this.ListAddChanels);
      return this.ListAddChanels;
    },
    async onSubmit() {
      if (this.dialog.method === "add") {
        this.dialog.data.userId = 1;
      }
      console.log(this.dialog);
      if (this.processing) return;
      this.processing = true;
      const result = await this.Task.save(
        this.dialog.method,
        this.dialog.data,
        this.dialog.dataWas
      );
      if (this.dialog.data.chanelId) {
        const result2 = await this.Task.addTaskToChannel(
          this.dialog.data.chanelId.value,
          this.dialog.data.id
        );
        console.log("123", result2);
      }

      this.processing = false;
      this.$emit("onSave", result);
    },

    async onRemove() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Task.delete(this.dialog.data.id);
      this.processing = false;
      this.$emit("onRemove", result);
    },
    async onAdd() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Task.addTaskToChannel(
        this.dialog.data.chanelId.value,
        this.dialog.data.id
      );
      console.log("123", result);
      this.processing = false;
      this.onGetListAddChanels();
    },
  },
});
</script>
