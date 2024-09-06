<template>
  <q-dialog
    v-model="dialog.show"
    @hide="dialog.onHide"
    @before-hide="onBeforeHide"
    @before-show="onBeforeShow"
  >
    <q-card style="width: 600px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section class="q-dialog__header">
          <div class="q-dialog__header-content">
            <div class="q-dialog__title">
              {{
                dialog.method === "add"
                  ? "Новыое расписание "
                  : "Изменение расписания"
              }}
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
              hint="Описание должно быть от 2 до 3000 символов"
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
            <q-select
              outlined
              hint="Можно выбрать несколько дней"
              bg-color="white"
              multiple
              map-options
              hide-bottom-space
              :options="weekDaysOptions"
              option-value="value"
              v-model="weeksDay"
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
            <div class="row">
              <div class="col q-pr-md">
                <q-input
                  mask="time"
                  :rules="['time']"
                  outlined
                  bg-color="white"
                  hide-bottom-space
                  v-model="timeStart"
                  :required="Schedule.fields.workingTime.required"
                  hint="Время начала работы"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="timeStart" format24h>
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Закрыть"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  mask="time"
                  :rules="['time']"
                  outlined
                  bg-color="white"
                  hide-bottom-space
                  v-model="timeEnd"
                  :required="Schedule.fields.workingTime.required"
                  hint="Время окончания работы"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="timeEnd" format24h>
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Закрыть"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
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
              hint="Частота выполнения в минутах"
              v-model="frequency"
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
      weeksDay: ref([]),
      timeStart: ref(null),
      timeEnd: ref(null),
      frequency: ref(null),
      weekDaysOptions: ref([
        { label: "Понедельник", value: 1 },
        { label: "Вторник", value: 2 },
        { label: "Среда", value: 3 },
        { label: "Четверг", value: 4 },
        { label: "Пятница", value: 5 },
        { label: "Суббота", value: 6 },
        { label: "Воскресенье", value: 7 },
      ]),
    };
  },

  methods: {
    async onSubmit() {
      if (this.dialog.method === "add") {
        this.dialog.data.owner_id = this.$q.appStore.user.id;
      }

      if (this.processing) return;
      this.processing = true;

      this.dialog.data.frequency = Number(this.frequency * 1000 * 60);
      this.dialog.data.weeksDay = this.weeksDay.map((day) => day.value);
      this.dialog.data.workingTime = [this.timeStart, this.timeEnd];

      const result = await this.Schedule.save(
        this.dialog.method,
        this.dialog.data,
        this.dialog.dataWas
      );
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

    onBeforeHide() {
      this.weeksDay = [];
      this.timeStart = null;
      this.timeEnd = null;
      this.frequency = null;
    },

    onBeforeShow() {
      if (this.dialog.method === "update") {
        this.weeksDay = this.dialog.data.weeksDay.map((day) => {
          return { label: this.weekDaysOptions[day - 1].label, value: day };
        });
        this.timeStart = this.dialog.data.workingTime[0]
          .split(":")
          .slice(0, 2)
          .join(":");
        this.timeEnd = this.dialog.data.workingTime[1]
          .split(":")
          .slice(0, 2)
          .join(":");
        this.frequency = this.dialog.data.frequency / 1000;
      }
    },
  },
});
</script>
