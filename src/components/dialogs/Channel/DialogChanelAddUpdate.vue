<template>
  <q-dialog v-model="dialog.show" @hide="dialog.onHide">
    <q-card style="width: 600px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section class="q-dialog__header">
          <div class="q-dialog__header-content">

            <div class="q-dialog__title">
              {{
    dialog.method === "add"
      ? "Новый канал "
      : "Изменить канал"
  }}
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
            <q-input outlined bg-color="white" hide-bottom-space v-model="dialog.data.description"
              :min="Chanel.fields.description.min" :max="Chanel.fields.description.max"
              :required="Chanel.fields.description.required" :rules="[(val) => Chanel.fields.description.rules(val)]" />
          </div>

          <!-- Адресс -->
          <div class="q-mb-md">
            <div class="label">
              {{ Chanel.fields.url.label }}
              {{ Chanel.fields.url.required ? "*" : "" }}
            </div>
            <q-input outlined bg-color="white" hide-bottom-space v-model="dialog.data.url"
              :mask="Chanel.fields.url.mask" unmasked-value :min="Chanel.fields.url.min" :max="Chanel.fields.url.max"
              :required="Chanel.fields.url.required" :rules="[(val) => Chanel.fields.url.rules(val)]">

            </q-input>
          </div>
          <!-- Список тасков на канале -->
          <div class="q-mb-md" v-if="dialog.method === 'update'">
            <div class="label">
              Список тасков на канале
            </div>
            <q-select outlined bg-color="white" hide-bottom-space v-model="model" :options="options" readonly>
              
            </q-select>
          </div>
        </q-card-section>
        <q-card-section class="q-dialog__footer">
          <q-btn unelevated color="negative" no-caps label="Удалить" @click="onRemove"
            v-if="dialog.method === 'update'" />
          <q-btn class="q-btn--outline-muted" outline no-caps label="Отмена" v-close-popup />
          <q-btn unelevated color="primary" no-caps type="submit" label="Сохранить" />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";

import ChanelClass from "src/utils/classes/Chanel.Class";

export default defineComponent({
  name: "DialogChanelAddUpdate",

  props: ["dialog"],

  emits: {
    onSaveChanel: null,
    onRemoveChanel: null,
  },

  setup() {
    const Chanel = new ChanelClass();
    return {
      Chanel,
    };
  },

  methods: {

    async onSubmit() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Chanel.save(
        this.dialog.method,
        this.dialog.data,
        this.dialog.dataWas
      );
      this.processing = false;
      console.log(result);
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
