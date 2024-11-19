<template>
  <q-dialog v-model="dialog.show" @hide="dialog.onHide">
    <q-card style="width: 600px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section class="q-dialog__header">
          <div class="q-dialog__header-content">
            <div class="q-dialog__title">
              {{
                dialog.method === "add" ? "Новый аккаунт " : "Изменить аккаунт"
              }}
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup @click="onClose" />
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
              hint="Описание аккаунта"
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
              fill-mask
              :min="Account.fields.phone.min"
              :max="Account.fields.phone.max"
              :required="Account.fields.phone.required"
              :rules="[(val) => Account.fields.phone.rules(val)]"
              hint="Телефон аккаунта"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </div>

          <!-- Описание -->
          <div class="q-mb-md">
            <div class="label">
              {{ Account.fields.response.label }}
              {{ Account.fields.response.required ? "*" : "" }}
            </div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="dialog.data.response"
              :min="Account.fields.response.min"
              :max="Account.fields.response.max"
              :required="Account.fields.response.required"
              :rules="[(val) => Account.fields.response.rules(val)]"
              hint="Сообщение для ответа"
            />
          </div>
          <!-- Код подтверждения -->
          <div class="q-mb-md" v-if="isActive">
            <div class="label">Sign Up Code *</div>
            <q-input
              outlined
              bg-color="white"
              hide-bottom-space
              v-model="code"
              mask="#####"
              unmasked-value
              min="5"
              max="5"
              required="true"
              :rules="[(val) => val !== null && val.length === 5]"
              hint="Код подтверждения приходит на телефон"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
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
            ><q-tooltip class="bg-negative">Удалить аккаунт</q-tooltip></q-btn
          >
          <q-btn
            class="q-btn--outline-muted"
            outline
            no-caps
            label="Отмена"
            @click="isActive = false"
            v-close-popup
          />
          <q-btn
            unelevated
            color="primary"
            no-caps
            type="submit"
            label="Сохранить"
            ><q-tooltip class="bg-primary" v-if="dialog.method === 'add'"
              >Создать новый аккаунт</q-tooltip
            >
            <q-tooltip class="bg-primary" v-else-if="dialog.method === 'update'"
              >Изменить аккаунт</q-tooltip
            ></q-btn
          >
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
      isActive: ref(false),
      code: ref(""),
      Account,
    };
  },

  methods: {
    async onSubmit() {
      if (this.processing) return;
      this.processing = true;
      if (this.dialog.method === "add") {
        this.dialog.data.owner_id = this.$q.appStore.user.id;
      }
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
      this.processing = false;
      this.$emit("onRemove", result);
    },

    async onActivate() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Account.activate(this.dialog.data.id);
      this.processing = false;

      if (result) {
        this.isActive = true;
      }
    },

    async onSignIn() {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Account.signIn(this.dialog.data.id, this.code);
      this.processing = false;
      if (result) {
        this.isActive = false;
        this.code = "";
      }
    },

    onClose() {
      this.code = "";
      this.isActive = false;
    },
  },
});
</script>
