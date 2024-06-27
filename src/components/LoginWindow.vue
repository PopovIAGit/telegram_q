<template>
  <div class="login-window">
    <q-form @submit="onSubmit">
      <div class="q-mb-md">
        <div class="label">Телефон</div>
        <!-- Телефон -->
        <q-input
          outlined
          bg-color="white"
          hide-bottom-space
          v-model="login"
          :min="User.fields.password.min"
          :max="User.fields.password.max"
          :required="User.fields.password.required"
          :rules="[(val) => User.fields.password.rules(val)]"
        >
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
      <!-- Пароль -->
      <div class="q-mb-md">
        <div class="label">
          {{ User.fields.password.label }}
          {{ User.fields.password.required ? "*" : "" }}
        </div>
        <q-input
          outlined
          bg-color="white"
          hide-bottom-space
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :min="User.fields.password.min"
          :max="User.fields.password.max"
          :required="User.fields.password.required"
          :rules="[(val) => User.fields.password.rules(val)]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </div>
      <div class="q-mb-lg row justify-between items-center">
        <q-checkbox v-model="remember" label="Запомнить" />
        <span class="text-primary cursor-pointer">Забыли пароль?</span>
      </div>
      <q-btn
        unelevated
        no-caps
        color="primary"
        class="full-width"
        type="submit"
        label="Войти"
      />
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick } from "vue";

import UserClass from "src/utils/classes/User.Class";

export default defineComponent({
  name: "LoginWindow",

  setup() {
    const User = new UserClass();

    const freeUserId = (Math.floor(Math.random() * 10000) + 100).toString();
    const roomId = freeUserId;
    return {
      User,
      // Form fields
      login: ref("Root"),
      password: ref("root"),
      remember: ref(false),
      // Show password
      showPassword: ref(false),
      msgDataToSend: ref(""),
      freeUserId,
      roomId,
      messages: ref([]),
      scrollAreaRef: ref(null),
    };
  },

  async beforeMount() {

  },

  methods: {
    async onSubmit() {
      const result = await this.User.login({
        login: this.login,
        password: this.password,
      });
      // Если ошибка логина TODO
      if (!result.success) {
      }
      // Если успешный логин
      else if (result.success) {

        // Выполняем подготовительные действия, доступные только после успешной авторизации
        const resultAuthAfter = await this.User.authAfter();
        // Если ошибка
        if (!resultAuthAfter.success) {
          if (resultAuthAfter.message) {
            this.$q.dialogStore.set({
              show: true,
              title: "Ошибка",
              html: resultAuthAfter.message,
              ok: {
                color: "red",
              },
            });
          }
        }
      }
    },
  },
});
</script>
