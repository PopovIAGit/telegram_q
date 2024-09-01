<template>
  <q-dialog v-model="dialog.show" @hide="dialog.onHide">
    <q-card style="width: 600px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section class="q-dialog__header">
          <div class="q-dialog__header-content">
            <div class="q-dialog__title">
              {{
                dialog.method === "add" ? "Новая задача " : "Изменить задачу"
              }}
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
              hint="Описание задачи"
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
              hint="Сообщение для отправки"
            >
            </q-input>
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
            <q-tooltip class="bg-negative">Удалить задачу</q-tooltip></q-btn
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
          >
            <q-tooltip class="bg-primary" v-if="dialog.method === 'add'"
              >Создать новую задачу</q-tooltip
            >
            <q-tooltip class="bg-primary" v-else-if="dialog.method === 'update'"
              >Изменить задачу</q-tooltip
            >
          </q-btn>
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
      selectedOption: ref(null),
      options: ref([]),
      isLoading: ref(false),
      ListAddChanels: ref([]),
    };
  },

  methods: {
    async onSubmit() {
      if (this.dialog.method === "add") {
        this.dialog.data.owner_id = this.$q.appStore.user.id;
        this.dialog.data.userId = this.$q.appStore.user.id;
      }

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
  },
});
</script>
