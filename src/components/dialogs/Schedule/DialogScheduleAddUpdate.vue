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
              {{ Schedule.fields.description.label }}
              {{ Schedule.fields.description.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.description"
              :min="Schedule.fields.description.min"
              :max="Schedule.fields.description.max"
              :required="Schedule.fields.description.required"
              :rules="[(val) => Schedule.fields.description.rules(val)]"
            />
          </div>
          <!-- Дни недели -->
          <div class="q-mb-md">
            <div class="label">
              {{ Schedule.fields.weeksDay.label }}
              {{ Schedule.fields.weeksDay.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.weeksDay"
              :min="Schedule.fields.weeksDay.min"
              :max="Schedule.fields.weeksDay.max"
              :required="Schedule.fields.weeksDay.required"
              :rules="[(val) => Schedule.fields.weeksDay.rules(val)]"
            />
          </div>
          <!-- Время работы -->
          <div class="q-mb-md">
            <div class="label">
              {{ Schedule.fields.workingTime.label }}
              {{ Schedule.fields.workingTime.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.workingTime"
              :min="Schedule.fields.workingTime.min"
              :max="Schedule.fields.workingTime.max"
              :required="Schedule.fields.workingTime.required"
              :rules="[(val) => Schedule.fields.workingTime.rules(val)]"
            />
          </div>
          <!-- Частота -->
          <div class="q-mb-md">
            <div class="label">
              {{ Schedule.fields.frequency.label }}
              {{ Schedule.fields.frequency.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              type="number"
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.frequency"
              :min="Schedule.fields.frequency.min"
              :max="Schedule.fields.frequency.max"
              :required="Schedule.fields.frequency.required"
              :rules="[(val) => Schedule.fields.frequency.rules(val)]"
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

import ScheduleClass from "src/utils/classes/Schedule.Class";

export default defineComponent({
  name: "DialogScheduleAddUpdate",

  props: ["dialog"],

  emits: {
    onSave: null,
    onRemove: null,
  },
  setup() {
    const Schedule = new ScheduleClass();

    return {
      Schedule,
    };
  },

  methods: {
    async onSubmit() {
      if (this.dialog.method === "add") {
        this.dialog.data.owner_id = this.$q.appStore.user.id;
      }

      if (this.processing) return;
      this.processing = true;

      console.log("dialog.data", this.dialog.data);

      // const result = await this.Schedule.save(
      //   this.dialog.method,
      //   this.dialog.data,
      //   this.dialog.dataWas
      // );
      this.processing = false;
      this.$emit("onSave", result);
    },

    async onRemove() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Schedule.delete(this.dialog.data.id);
      this.processing = false;
      this.$emit("onRemove", result);
    },
  },
});
</script>
