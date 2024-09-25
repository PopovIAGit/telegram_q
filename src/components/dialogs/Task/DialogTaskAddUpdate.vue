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
              autogrow
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
          <div class="q-mb-md">
            <div class="label">
              <div class="row">
                <div class="col-6">
                  <div>Загруженный файл</div>
                </div>
                <div class="col-6 text-right">
                  <q-btn
                    icon="close"
                    flat
                    round
                    dense
                    lab="удалить файл"
                    @click="dialog.data.file = null"
                    v-if="dialog.data.file"
                  >
                    <q-tooltip class="bg-negative">Удалить файл</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
            <template v-if="!dialog.data.file">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #eee;
                  padding: 20px;
                  height: 20px;
                "
              >
                <q-icon name="o_image" style="font-size: 50px; color: #aaa" />
              </div>
            </template>
            <template v-else>
              <img
                v-if="dialog.data.file"
                :src="dialog.data.file"
                alt=""
                style="width: 50%; display: block"
              />
            </template>
          </div>
          <!-- file add -->
          <div class="q-mb-md">
            <div class="label">Загрузка файла</div>
            <q-file
              outlined
              v-model="this.file"
              hint="Загрузите файл для задачи"
              @update:model-value="onUpdateImage"
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
import axios from "axios";

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
      file: ref(null),
    };
  },

  methods: {
    onUpdateImage() {
      const formData = new FormData();
      formData.append("image_0", this.file);
      axios({
        url: "https://sinthy.fvds.ru:3443/upload/file",
        method: "POST",
        multipart: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      }).then(async (response) => {
        Object.entries(response.data).forEach(([key, item]) => {
          this.dialog.data.file = item;
        });

        this.file = null;
      });
    },

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
      // if (this.dialog.data.chanelId) {
      //   const result2 = await this.Task.addTaskToChannel(
      //     this.dialog.data.chanelId.value,
      //     this.dialog.data.id
      //   );
      // }

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
