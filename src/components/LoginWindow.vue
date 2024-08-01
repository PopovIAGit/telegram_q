<template>
  <div class="login-window">
    <!-- Login -->
    <q-form @submit="onSubmit" v-if="!isRegistrations">
      <div class="q-mb-md">
        <div class="label">Логин</div>
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
            <q-icon name="account_circle" />
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
        <span
          class="text-primary cursor-pointer"
          @click="isRegistrations = !isRegistrations"
          >Регистрация</span
        >
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
    <!-- Registrations -->
    <q-form @submit="onSubmit" v-if="isRegistrations">
      <div class="q-mb-md">
        <div class="label">Логин</div>
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
            <q-icon name="account_circle" />
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
      <!-- Пароль повтор -->
      <div class="q-mb-md">
        <div class="label">
          {{ User.fields.password2.label }}
          {{ User.fields.password2.required ? "*" : "" }}
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
      <div class="q-mb-lg row justify-end">
        <span
          class="text-primary cursor-pointer"
          @click="isRegistrations = !isRegistrations"
          >Авторизация</span
        >
      </div>
      <q-btn
        unelevated
        no-caps
        color="primary"
        class="full-width"
        type="submit"
        label="Зарегистрироваться"
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
      login: ref(""),
      password: ref(""),
      remember: ref(false),
      // Show password
      showPassword: ref(false),
      msgDataToSend: ref(""),
      freeUserId,
      roomId,
      messages: ref([]),
      scrollAreaRef: ref(null),
      isRegistrations: ref(false),
    };
  },

  async beforeMount() {},

  methods: {
    async onSubmit() {
      if (this.isRegistrations == false) {
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
      } else {
        console.log("isRegistrations", this.isRegistrations);
      }
    },
  },
});
</script>
