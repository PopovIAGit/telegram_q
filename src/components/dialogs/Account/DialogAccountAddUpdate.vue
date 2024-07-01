<template>
  <q-dialog v-model="dialog.show" @hide="dialog.onHide">
    <q-card style="width: 600px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section class="q-dialog__header">
          <div class="q-dialog__header-content">
         
            <div class="q-dialog__title">
              {{
                dialog.method === "add"
                  ? "Новый аккаунт "
                  : "Изменить аккаунт"
              }}
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-dialog__body">
          <!-- Описание -->
          <div class="q-mb-md">
            <div class="label">
              {{ Account.fields.description.label }}
              {{ Account.fields.description.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.description"
              :min="Account.fields.description.min"
              :max="Account.fields.description.max"
              :required="Account.fields.description.required"
              :rules="[(val) => Account.fields.description.rules(val)]"
            />
          </div>

          <!-- Телефон -->
          <div class="q-mb-md">
            <div class="label">
              {{ Account.fields.phone.label }}
              {{ Account.fields.phone.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.phone"
              :mask="Account.fields.phone.mask"
              unmasked-value
              :min="Account.fields.phone.min"
              :max="Account.fields.phone.max"
              :required="Account.fields.phone.required"
              :rules="[(val) => Account.fields.phone.rules(val)]"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
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

import AccountClass from "src/utils/classes/Account.Class";

export default defineComponent({
  name: "DialogAccountAddUpdate",

  props: ["dialog"],

  emits: {
    onSave: null,
    onRemove: null,
  },

  setup() {
    const Account = new AccountClass();
    return {
      Account,
    };
    console.log("dialog", this.dialog);
  },

  methods: {

    async onSubmit() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Account.save(
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
      const result = await this.Account.delete(this.dialog.data.id);
      console.log(result);
      this.processing = false;
      this.$emit("onRemove", result);
    },
  },
});
</script>
