<template>
  <q-page>
    <div class="container">
      <h1>Главная</h1>
      <div
        class="q-py-md fit row wrap justify-between items-stretch content-stretch full-width"
      >
        <!-- аккаунты -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Aккаутны</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showAccount !== true ? 'visibility_off' : 'visibility'"
              @click="showAccount = !showAccount"
            />
            <q-btn flat round dense icon="add" @click="showAccountAdd" />
          </q-toolbar>

          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showAccount">
              <q-item
                v-for="tgAccount in listOfTgAccounts.filter(
                  (tgAccount) => tgAccount.is_deleted === 0
                )"
                :key="tgAccount.id"
                v-ripple
                class="no-wrap justify-around items-stretch content-stretch"
              >
                <q-item-section class="col-1">
                  <q-item-label>{{ tgAccount.id }}</q-item-label>
                </q-item-section>
                <q-item-section
                  class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-4"
                >
                  <q-item-label>{{ tgAccount.phone }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    tgAccount.description
                  }}</q-item-label>
                </q-item-section>
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="add_task"
                      @click="showAccountPublicChanelConnection(tgAccount)"
                      ><q-tooltip color="bg-accent"
                        >Подключить к каналу c капчей</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section class="col-1">
                  <q-item-label v-if="tgAccount.active">
                    <q-btn
                      flat
                      round
                      dense
                      icon="verified"
                      disabled
                      :color="tgAccount.active !== 0 ? 'green' : 'grey'"
                    >
                      <q-tooltip color="bg-accent">Активирован</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label v-else>
                    <q-btn
                      flat
                      round
                      dense
                      icon="verified"
                      @click="showAccountActive(tgAccount)"
                    >
                      <q-tooltip color="bg-accent">Активировать</q-tooltip>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      @click="showAccountUpdate(tgAccount)"
                      ><q-tooltip color="bg-accent"
                        >Редактировать</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <!-- кнопка лог -->
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="list_alt"
                      @click="showAccountLog(tgAccount)"
                      ><q-tooltip color="bg-accent">Журнал</q-tooltip></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <!-- модальное окно журнала аккаунта -->
                <div>
                  <q-dialog
                    v-model="inception_account_log"
                    @before-hide="beforeHideAccountJournalDialog"
                  >
                    <q-card>
                      <q-card-section
                        class="row justify-between q-col-gutter-x-md items-center"
                      >
                        <div class="text-h6">Журнал аккаунта</div>
                        <q-select
                          outlined
                          bg-color="white"
                          hide-bottom-space
                          v-model="this.vmodel_howShowLog"
                          :options="this.options_howShowLog"
                          @update:model-value="updatePaginatedAccountLog"
                        />
                      </q-card-section>
                      <q-separator />

                      <div class="q-pa-none">
                        <q-scroll-area
                          style="height: 300px; max-width: 100%; width: 600rem"
                        >
                          <q-list bordered separator>
                            <q-item
                              v-for="tgAccount in paginatedAccountLog"
                              :key="tgAccount.id"
                              v-ripple
                              class="drawer-left__menu justify-between"
                            >
                              <q-item-section class="col-1">
                                <q-item-label>{{ tgAccount.id }}</q-item-label>
                              </q-item-section>
                              <q-item-section
                                class="q-pa-none col-3 .col-md-auto"
                              >
                                <q-item-label>
                                  task: id {{ tgAccount.task_id }} :
                                  {{
                                    this.$q.appStore.taskList.find(
                                      (task) => task.id == tgAccount.account_id
                                    )?.description || "Описание не найдено"
                                  }}
                                </q-item-label>

                                <q-item-label caption lines="1"
                                  >Channel: id {{ tgAccount.channel_id }}
                                  :
                                  {{
                                    this.$q.appStore.chanelList.find(
                                      (channel) =>
                                        channel.id == tgAccount.channel_id
                                    )?.description || "Описание не найдено"
                                  }}</q-item-label
                                >
                                <q-item-label caption lines="1"
                                  >Account: id {{ tgAccount.account_id }}
                                  :
                                  {{
                                    this.$q.appStore.accountList.find(
                                      (account) =>
                                        account.id == tgAccount.account_id
                                    )?.description || "Описание не найдено"
                                  }}</q-item-label
                                >
                              </q-item-section>
                              <q-item-section class="col-3">
                                <q-item-label class="text-wrap">
                                  Сообщение:
                                  <a
                                    v-if="tgAccount.url"
                                    :href="tgAccount.url"
                                    target="_blank"
                                    style="word-break: break-all"
                                    >{{ tgAccount.url }}</a
                                  >
                                  <span v-else>пустое</span>
                                </q-item-label>
                              </q-item-section>
                              <q-item-section class="col-2">
                                <q-item-label
                                  >Дата:
                                  {{ formatDate(tgAccount.date) }}</q-item-label
                                >
                              </q-item-section>
                              <q-item-section class="col">
                                <q-item-label
                                  >Статус:
                                  {{
                                    tgAccount.success ? "Успешно" : "Ошибка"
                                  }}</q-item-label
                                >
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-scroll-area>
                      </div>
                      <q-separator />

                      <q-pagination
                        class="q-pa-sm justify-center"
                        direction-links
                        boundary-links
                        flat
                        color="grey"
                        active-color="primary"
                        v-model="paginationAccountLog.page"
                        :max="maxPagesAccount"
                        :max-pages="6"
                      />
                    </q-card>
                  </q-dialog>
                </div>
                <!-- модальное окно аккаунта  -->
                <div>
                  <q-dialog
                    v-model="inception"
                    @before-hide="beforeHideTgAccount"
                  >
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">Введите код активации</div>
                      </q-card-section>

                      <q-card-section class="q-pa-md">
                        <div class="q-mb-md">
                          Введите код пришедший на Телефон
                        </div>

                        <q-input
                          mask="#####"
                          v-model="code"
                          outlined
                          bg-color="white"
                          hide-bottom-space
                          hint="Код активации"
                        ></q-input>
                      </q-card-section>

                      <q-card-actions align="right">
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
                          label="Отправить"
                          @click="onSignIn(select_account.id, code)"
                          hint="Отправить код активации"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>
                <!-- модальное окно аккаунта подключения joinToPublicChannel-->
                <div>
                  <q-dialog
                    v-model="inception_account"
                    @before-hide="beforeHideAccountPublicChanelConnection"
                  >
                    <q-card v-if="!newjoinPublicChanel">
                      <q-card-section>
                        <div class="text-h6">
                          Подключение к каналу с капчей {{ select_account.id }}
                        </div>
                      </q-card-section>

                      <q-card-section class="q-pa-md">
                        <div class="q-mb-md">
                          Список каналов для подключения
                        </div>

                        <q-select
                          outlined
                          bg-color="white"
                          hide-bottom-space
                          v-model="vmodel_chanelToAddInTask"
                          :options="listOfTgChanals"
                          option-label="description"
                          option-value="id"
                          hint="Канал для подключения к аккаунту"
                        ></q-select>
                      </q-card-section>

                      <q-card-actions align="right">
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
                          label="Отправить"
                          @click="
                            joinPublicChanel(
                              select_account.id,
                              vmodel_chanelToAddInTask.id
                            )
                          "
                          hint="Отправить код активации"
                        />
                      </q-card-actions>
                    </q-card>
                    <q-card v-else-if="newjoinPublicChanel">
                      <div
                        v-if="answerjoinPublicChanel.message.buttonCount == 0"
                      >
                        <q-card-section>
                          <div class="text-h6">Отвеь на капчу с тестом</div>
                        </q-card-section>
                        <q-card-section class="q-pa-md">
                          <img
                            v-if="this.imageCaptcha != null"
                            :src="this.imageCaptcha"
                            alt="no image"
                            class="q-mb-md"
                          />
                        </q-card-section>
                        <q-card-section class="q-pa-md">
                          <div class="q-mb-md">
                            {{ answerjoinPublicChanel.message.text }}
                          </div>
                        </q-card-section>
                        <q-card-section class="q-pa-md">
                          <q-input
                            v-model="answerForCaptcha"
                            outlined
                            bg-color="white"
                            hide-bottom-space
                            hint="Ответ на капчу"
                          ></q-input>
                        </q-card-section>
                        <q-card-actions align="right">
                          <q-btn
                            unelevated
                            color="primary"
                            no-caps
                            label="Отправить"
                            :disable="
                              answerForCaptcha == '' || answerForCaptcha == null
                            "
                            @click="
                              handleButtonClickJoinPublicChanelText(
                                answerForCaptcha
                              )
                            "
                          />
                          <q-btn
                            class="q-btn--outline-muted"
                            outline
                            no-caps
                            label="Отмена"
                            v-close-popup
                          />
                        </q-card-actions>
                      </div>
                      <div v-else>
                        <q-card-section>
                          <div class="text-h6">Отвеь на капчу с кнопкой</div>
                        </q-card-section>
                        <q-card-section class="q-pa-md">
                          <div class="q-mb-md">
                            {{ answerjoinPublicChanel.message.text }}
                          </div>
                        </q-card-section>
                        <q-card-actions align="right">
                          <q-btn
                            v-for="(button, index) in answerjoinPublicChanel
                              .message.buttons"
                            :key="index"
                            unelevated
                            color="primary"
                            no-caps
                            :label="button[0].text"
                            @click="
                              handleButtonClickJoinPublicChanel(button, index)
                            "
                          />
                          <q-btn
                            class="q-btn--outline-muted"
                            outline
                            no-caps
                            label="Отмена"
                            v-close-popup
                          />
                        </q-card-actions>
                      </div>
                    </q-card>
                  </q-dialog>
                </div>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <!-- каналы -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Каналы</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showChannel !== true ? 'visibility_off' : 'visibility'"
              @click="showChannel = !showChannel"
            />
            <q-btn flat round dense icon="add" @click="showChanelAdd" />
          </q-toolbar>
          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showChannel">
              <q-item
                v-for="tgChannel in listOfTgChanals.filter(
                  (tgChannel) => tgChannel.is_deleted === 0
                )"
                :key="tgChannel.id"
                v-ripple
                class="no-wrap justify-around items-stretch content-stretch"
              >
                <q-item-section class="col-1">
                  <q-item-label>{{
                    tgChannel && tgChannel.id ? tgChannel.id : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section
                  class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-4"
                >
                  <q-item-label>{{
                    tgChannel && tgChannel.url ? tgChannel.url : "N/A"
                  }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    tgChannel && tgChannel.description
                      ? tgChannel.description
                      : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section class="col-1"></q-item-section>
                <q-item-section class="col-1"></q-item-section>
                <q-item-section class="col-1"></q-item-section>
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      @click="showChanelUpdate(tgChannel)"
                      ><q-tooltip color="bg-accent"
                        >Редактировать</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <!-- Задачи -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Задачи</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showTask !== true ? 'visibility_off' : 'visibility'"
              @click="showTask = !showTask"
            />
            <q-btn flat round dense icon="add" @click="showTaskAdd" />
          </q-toolbar>
          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showTask">
              <q-item
                v-for="tgTask in listOfTasks.filter(
                  (tgTask) => tgTask.is_deleted === 0
                )"
                :key="tgTask.id"
                v-ripple
                class="no-wrap justify-around items-stretch"
              >
                <!-- модальное окно добавления канала к задачеы-->
                <div>
                  <q-dialog
                    v-model="inception_task"
                    @before-hide="beforeHideTaskLinkDialog"
                  >
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">
                          Подключение канала к задаче {{ this.select_task.id }}
                        </div>
                      </q-card-section>

                      <q-card-section class="q-pa-md">
                        <!-- channelId -->
                        <div class="q-mb-md">
                          <div class="label">Каналы для подключения</div>
                          <q-select
                            outlined
                            bg-color="white"
                            hide-bottom-space
                            v-model="this.vmodel_chanelToAddInTask"
                            :options="this.options_chanelToAddInTask"
                            hint="Канал для подключения к задаче"
                          >
                          </q-select>
                        </div>
                        <div class="q-mb-md">
                          <div class="label">Подключенные каналы</div>
                          <q-select
                            outlined
                            lazy-rules
                            bg-color="white"
                            hide-bottom-space
                            v-model="this.vmodel_chanelsAddedToTask"
                            :options="this.options_chanelsAddedToTask"
                            :loading="this.task_isLoading"
                            hint="Каналы, подключенные к задаче"
                          />
                        </div>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn
                          unelevated
                          color="negative"
                          no-caps
                          label="Удалить"
                          @click="
                            onRemoveChanelFromTask(
                              this.vmodel_chanelsAddedToTask.value
                            )
                          "
                        >
                          <q-tooltip class="bg-primary"
                            >Удалить канал из задачи</q-tooltip
                          >
                        </q-btn>
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
                          label="Добавить"
                          @click="onAddChanelToTask(this.select_task)"
                        >
                          <q-tooltip class="bg-primary"
                            >Для добавления выберите канал</q-tooltip
                          >
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>

                <!-- модальное окно добавления аккаунта к задаче-->
                <div>
                  <q-dialog
                    v-model="inception_task_account"
                    @before-hide="beforeHideTaskAccountDialog"
                  >
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">
                          Подключение аккаунта к задаче
                          {{ this.select_task.id }}
                        </div>
                      </q-card-section>

                      <q-card-section class="q-pa-md">
                        <!-- channelId -->
                        <div class="q-mb-md">
                          <div class="label">Аккаунт для подключения</div>
                          <q-select
                            multiple
                            outlined
                            bg-color="white"
                            hide-bottom-space
                            v-model="this.vmodel_accountToAddInTask"
                            :options="this.options_accountToAddInTask"
                            hint="Аккаунты для подключения к задаче"
                          >
                          </q-select>
                        </div>
                        <div class="q-mb-md">
                          <div class="label">Подключенные аккаунты</div>
                          <q-select
                            multiple
                            outlined
                            lazy-rules
                            bg-color="white"
                            hide-bottom-space
                            v-model="this.vmodel_accountsAddedToTask"
                            :options="this.options_accountsAddedToTask"
                            :loading="this.task_isLoading"
                            hint="Аккаунты, подключенные к задаче"
                          />
                        </div>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn
                          unelevated
                          color="negative"
                          no-caps
                          label="Удалить"
                          @click="
                            onRemoveAccountFromTask(
                              this.select_task.id,
                              this.vmodel_accountsAddedToTask
                            )
                          "
                        >
                          <q-tooltip class="bg-primary"
                            >Удалить канал из задачи</q-tooltip
                          >
                        </q-btn>
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
                          label="Добавить"
                          @click="
                            onAddAccountToTask(
                              this.select_task.id,
                              this.vmodel_accountToAddInTask
                            )
                          "
                        >
                          <q-tooltip class="bg-primary"
                            >Для добавления выберите канал</q-tooltip
                          >
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>

                <!-- модальное окно журнала таска-->
                <div>
                  <q-dialog
                    v-model="inception_task_log"
                    @before-hide="beforeHideTaskJournalDialog"
                  >
                    <q-card>
                      <q-card-section
                        class="row justify-between q-col-gutter-x-md items-center"
                      >
                        <div class="text-h6">Журнал задач</div>
                        <q-select
                          outlined
                          bg-color="white"
                          hide-bottom-space
                          v-model="this.vmodel_howShowLog"
                          :options="this.options_howShowLog"
                          @update:model-value="updatePaginatedTaskLog"
                        />
                      </q-card-section>
                      <q-separator />

                      <div class="q-pa-none">
                        <q-scroll-area
                          style="height: 300px; max-width: 100%; width: 600rem"
                        >
                          <q-list bordered separator>
                            <q-item
                              v-for="tgTask in paginatedTaskLog"
                              :key="tgTask.id"
                              v-ripple
                              class="drawer-left__menu justify-between"
                            >
                              <q-item-section class="col-1">
                                <q-item-label>{{ tgTask.id }}</q-item-label>
                              </q-item-section>
                              <q-item-section
                                class="q-pa-none col-3 .col-md-auto"
                              >
                                <q-item-label>
                                  Task: id {{ tgTask.task_id }} :
                                  {{
                                    this.$q.appStore.taskList.find(
                                      (task) => task.id == tgTask.task_id
                                    ).description
                                  }}
                                </q-item-label>

                                <q-item-label caption lines="1"
                                  >Channel: id {{ tgTask.channel_id }}
                                  :
                                  {{
                                    this.$q.appStore.chanelList.find(
                                      (channel) =>
                                        channel.id == tgTask.channel_id
                                    ).description
                                  }}</q-item-label
                                >
                                <q-item-label caption lines="1"
                                  >Account: id {{ tgTask.account_id }}
                                  :
                                  {{
                                    this.$q.appStore.accountList.find(
                                      (account) =>
                                        account.id == tgTask.account_id
                                    ).description
                                  }}</q-item-label
                                >
                              </q-item-section>
                              <q-item-section class="col-3">
                                <q-item-label class="text-wrap">
                                  Сообщение:
                                  <a
                                    v-if="tgTask.url"
                                    :href="tgTask.url"
                                    target="_blank"
                                    style="word-break: break-all"
                                    >{{ tgTask.url }}</a
                                  >
                                  <span v-else>пустая</span>
                                </q-item-label>
                              </q-item-section>
                              <q-item-section class="col-2">
                                <q-item-label
                                  >Дата:
                                  {{ formatDate(tgTask.date) }}</q-item-label
                                >
                              </q-item-section>
                              <q-item-section class="col">
                                <q-item-label
                                  >Статус:
                                  {{
                                    tgTask.success ? "Успешно" : "Ошибка"
                                  }}</q-item-label
                                >
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-scroll-area>
                      </div>
                      <q-separator />

                      <q-pagination
                        class="q-pa-sm justify-center"
                        direction-links
                        boundary-links
                        flat
                        color="grey"
                        active-color="primary"
                        v-model="paginationLog.page"
                        :max="maxPages"
                        :max-pages="6"
                      />
                    </q-card>
                  </q-dialog>
                </div>
                <!-- колонки -->
                <q-item-section class="col-1">
                  <q-item-label>{{
                    tgTask && tgTask.id ? tgTask.id : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section
                  class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-4"
                >
                  <q-item-label>{{
                    tgTask && tgTask.description ? tgTask.description : "N/A"
                  }}</q-item-label>
                  <q-item-label caption lines="30">{{
                    tgTask && tgTask.message ? tgTask.message : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <!-- кнопка подключения канала к задаче -->
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="link"
                      @click="showTaskLink(tgTask)"
                      ><q-tooltip color="bg-accent"
                        >Подключить задачи к каналу</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <!-- кнопка подключения аккаунта к таску -->
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="leak_add"
                      @click="showAccountLink(tgTask)"
                      ><q-tooltip color="bg-accent"
                        >Подключить задачи к аккунту</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <!-- кнопка редактировать -->
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      @click="showTaskUpdate(tgTask)"
                      ><q-tooltip color="bg-accent"
                        >Редактировать</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <!-- кнопка лог -->
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="list_alt"
                      @click="showTaskLog(tgTask)"
                      ><q-tooltip color="bg-accent">Журнал</q-tooltip></q-btn
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <!-- Расписание -->
        <div class="q-pa-sm col-lg-6 col-md-12 col-xs-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>Расписание</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="showSchedule !== true ? 'visibility_off' : 'visibility'"
              @click="showSchedule = !showSchedule"
            />
            <q-btn flat round dense icon="add" @click="showSheduleAdd" />
          </q-toolbar>
          <q-scroll-area style="height: 300px; max-width: 100%">
            <q-list bordered separator v-if="showSchedule">
              <q-item
                v-for="Schedule in listOfSchedules.filter(
                  (Schedule) =>
                    Schedule.is_deleted === 0 ||
                    Schedule.is_deleted === undefined
                )"
                :key="Schedule.id"
                v-ripple
                class="no-wrap justify-around items-stretch"
              >
                <!-- модальное окно добавления расписания к таску-->
                <div>
                  <q-dialog
                    v-model="inception_Schedule_task"
                    @before-hide="beforeHideShedule"
                  >
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">
                          Подключение расписания к задаче
                        </div>
                      </q-card-section>

                      <q-card-section class="q-pa-md">
                        <!-- channelId -->
                        <div class="q-mb-md">
                          <div class="label">Задачи для подключения</div>
                          <q-select
                            outlined
                            bg-color="white"
                            hide-bottom-space
                            v-model="this.vmodel_taskToAddInSchedule"
                            :options="this.options_taskToAddInSchedule"
                            hint="Задача для подключения к расписанию"
                          >
                          </q-select>
                        </div>
                        <div class="q-mb-md">
                          <div class="label">подключенные задачи</div>
                          <q-select
                            outlined
                            lazy-rules
                            bg-color="white"
                            hide-bottom-space
                            v-model="this.vmodel_tasksAddedToSchedule"
                            :options="this.options_tasksAddedToSchedule"
                            :loading="this.schedule_isLoading"
                            hint="Задачи, подключенные к расписанию"
                          />
                        </div>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn
                          unelevated
                          color="negative"
                          no-caps
                          label="Удалить"
                          @click="
                            onRemoveTaskFromShedule(
                              this.vmodel_tasksAddedToSchedule.value
                            )
                          "
                        >
                          <q-tooltip class="bg-primary"
                            >Удалить расписание с задачи</q-tooltip
                          >
                        </q-btn>
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
                          label="Добавить"
                          @click="onAddTaskToShedule(this.select_schedule)"
                          ><q-tooltip class="bg-primary"
                            >Добавить расписание к задачи</q-tooltip
                          >
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>

                <q-item-section class="col-1">
                  <q-item-label>{{
                    Schedule && Schedule.id ? Schedule.id : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <q-item-section
                  class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-4"
                >
                  <q-item-label>{{
                    Schedule && Schedule.description
                      ? Schedule.description
                      : "N/A"
                  }}</q-item-label>
                </q-item-section>
                <!-- кнопка подключения -->
                <q-item-section class="col-1"></q-item-section>
                <q-item-section class="col-1"></q-item-section>
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="link"
                      @click="showScheduleClock(Schedule)"
                      ><q-tooltip color="bg-accent"
                        >Подключить задачу к расписанию</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
                <!-- кнопка редактировать -->
                <q-item-section class="col-1">
                  <q-item-label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      @click="showSheduleUpdate(Schedule)"
                      ><q-tooltip color="bg-accent"
                        >Редактировать</q-tooltip
                      ></q-btn
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </div>
    <dialog-account-add-update
      :dialog="dialogAccountAddUpdate"
      @onSave="onAccountSave"
      @onRemove="onAccountRemove"
    />
    <dialog-chanel-add-update
      :dialog="dialogChanelAddUpdate"
      @onSaveChanel="onChanelSave"
      @onRemoveChanel="onChanelRemove"
    />
    <dialog-task-add-update
      :dialog="dialogTaskAddUpdate"
      @onSave="onTaskSave"
      @onRemove="onTaskRemove"
    />
    <dialog-schedule-add-update
      :dialog="dialogScheduleAddUpdate"
      @onSave="onSheduleSave"
      @onRemove="onSheduleRemove"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

import AccountClass from "src/utils/classes/Account.Class";
import ChanelClass from "src/utils/classes/Chanel.Class";
import TaskClass from "src/utils/classes/Task.Class";
import ScheduleClass from "src/utils/classes/Schedule.Class";
import DialogAccountAddUpdate from "components/dialogs/Account/DialogAccountAddUpdate";
import DialogChanelAddUpdate from "components/dialogs/Channel/DialogChanelAddUpdate";
import DialogTaskAddUpdate from "components/dialogs/Task/DialogTaskAddUpdate";
import DialogScheduleAddUpdate from "components/dialogs/Schedule/DialogScheduleAddUpdate";
import { useRoute } from "vue-router";
import Buffer from "vue-buffer";

export default defineComponent({
  name: "IndexPage",
  components: {
    DialogAccountAddUpdate,
    DialogChanelAddUpdate,
    DialogTaskAddUpdate,
    DialogScheduleAddUpdate,
  },
  setup() {
    const Account = new AccountClass();
    const Chanel = new ChanelClass();
    const Task = new TaskClass();
    const Schedule = new ScheduleClass();

    const dialogAccountAddUpdateDefault = Account.dialogAddUpdateDefault;
    const dialogChanelAddUpdateDefault = Chanel.dialogAddUpdateDefault;
    const dialogTaskAddUpdateDefault = Task.dialogAddUpdateDefault;
    const dialogScheduleAddUpdateDefault = Schedule.dialogAddUpdateDefault;

    return {
      //списки
      listOfTgAccounts: ref([]),
      listOfTgChanals: ref([]),
      listOfTasks: ref([]),
      listOfSchedules: ref([]),
      // скрытие пунктов меню
      showAccount: ref(true),
      showChannel: ref(true),
      showTask: ref(true),
      showSchedule: ref(true),
      // экземпляры классов
      Account,
      Chanel,
      Task,
      Schedule,
      // диалоги
      dialogAccountAddUpdateDefault,
      dialogAccountAddUpdate: ref({}),
      dialogChanelAddUpdateDefault,
      dialogChanelAddUpdate: ref({}),
      dialogTaskAddUpdateDefault,
      dialogTaskAddUpdate: ref({}),
      dialogScheduleAddUpdateDefault,
      dialogScheduleAddUpdate: ref({}),
      // вспомогательные диалоги
      inception: ref(false),
      inception_account: ref(false),
      inception_account_log: ref(false),
      inception_task: ref(false),
      inception_task_log: ref(false),
      inception_Schedule_task: ref(false),
      inception_task_account: ref(false),
      // вспомогательные переменные
      code: ref(),
      //
      task_isLoading: ref(false),
      vmodel_chanelToAddInTask: ref(null),
      vmodel_chanelsAddedToTask: ref(null),
      options_chanelsAddedToTask: ref([]),
      options_chanelToAddInTask: ref([]),
      select_task: ref(null),
      //
      schedule_isLoading: ref(false),
      vmodel_taskToAddInSchedule: ref(null),
      vmodel_tasksAddedToSchedule: ref(null),
      options_tasksAddedToSchedule: ref([]),
      options_taskToAddInSchedule: ref([]),
      select_schedule: ref(null),
      listOfSchedulesAndTasks: ref([]),
      //
      // для модального окна с логами account
      accountLog: ref([]), // журнал по Id
      paginatedAccountLog: ref([]), // завернутый журнал в пагинацию
      paginationAccountLog: ref({
        page: 1,
        rowsPerPage: 10,
      }),
      // для модального окна с логами task
      taskLog: ref([]), // журнал по Id
      paginatedTaskLog: ref([]), // завернутый журнал в пагинацию
      paginationLog: ref({
        page: 1,
        rowsPerPage: 10,
      }),
      //
      vmodel_howShowLog: ref({ label: "Все", value: "all" }),
      options_howShowLog: ref([
        {
          label: "Все",
          value: "all",
        },
        {
          label: "Только успехи",
          value: "success",
        },
        {
          label: "Только ошибки",
          value: "error",
        },
      ]),
      // для модального окна с подключением аккаунтов к задачам
      vmodel_accountToAddInTask: ref(null),
      vmodel_accountsAddedToTask: ref(null),
      options_accountToAddInTask: ref([]),
      options_accountsAddedToTask: ref([]),
      // для модального окна с подключением аккаунтов к каналу с капчей
      select_account: ref(null),
      vmodel_chanelToAddInTask: ref(null),
      newjoinPublicChanel: ref(false),
      answerjoinPublicChanel: ref(null),
      answerForCaptcha: ref(""),
      imageCaptcha: ref(null),
    };
  },

  async beforeMount() {
    await this.getData();
  },

  methods: {
    async getData() {
      // получение списка аккаунтов
      const responseTgAccounts = await this.Account.getList();

      if (responseTgAccounts.type === "error") {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: "Ошибка получения списка аккаунтов",
          ok: {
            color: "red",
          },
        });
      } else if (responseTgAccounts.type === "answer") {
        this.listOfTgAccounts = responseTgAccounts.args.rows.map((account) => {
          if (account.description === null) {
            account.description = "";
          }
          return account;
        });
        this.$q.appStore.set({ accountList: this.listOfTgAccounts });
      }
      // получение списка каналов
      const responseTgChannel = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgChannel",
        method: "getList",
        args: {},
      });
      if (responseTgChannel.type === "error") {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: "Ошибка получения списка каналов",
          ok: {
            color: "red",
          },
        });
      } else if (responseTgChannel.type === "answer") {
        this.listOfTgChanals = responseTgChannel.args.rows.map((channel) => {
          if (channel.description === null) {
            channel.description = "";
          }
          if (channel.url === null) {
            channel.url = "";
          }
          return channel;
        });
        this.$q.appStore.set({ chanelList: this.listOfTgChanals });
      }
      // получение списка задач
      const responseTasks = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgTask",
        method: "getList",
        args: {},
      });

      if (responseTasks.type === "error") {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: "Ошибка получения списка задач",
          ok: {
            color: "red",
          },
        });
      } else if (responseTasks.type === "answer") {
        this.listOfTasks = responseTasks.args.rows;
        this.$q.appStore.set({ taskList: this.listOfTasks });
      }

      // получение списка расписаний
      const resultSchedules = await this.Schedule.getList();

      if (resultSchedules.success) {
        this.listOfSchedules = resultSchedules.schedules.rows || [];
      } else {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: resultSchedules.message,
          ok: {
            color: "red",
          },
        });
        this.listOfSchedules = [];
      }
      // new methods_____________________________________________________________________________________
    },

    //#region Account---------------------------------------------------------------------
    showAccountAdd() {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogAccountAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogAccountAddUpdateDefault.data[key];
        }
      });
      this.dialogAccountAddUpdate = {
        show: true,
        method: "add",
        onHide: () =>
          (this.dialogAccountAddUpdate = structuredClone(
            this.dialogAccountAddUpdateDefault
          )),
        data,
      };
    },
    showAccountUpdate(Account) {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogAccountAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogAccountAddUpdateDefault.data[key];
        }
      });
      this.dialogAccountAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogAccountAddUpdate = structuredClone(
            this.dialogAccountAddUpdateDefault
          )),
        dataWas: structuredClone(Account),
        data: structuredClone(Account),
      };
    },
    onAccountSave(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.Account) {
        this.$q.dialogStore.set({
          show: true,
          title: "Аккаунт сохронен",
        });
        this.dialogAccountAddUpdate.show = false;
        this.getData();
      }
    },
    onAccountRemove(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Аккаунт удален",
        });
        this.dialogAccountAddUpdate.show = false;
        this.getData();
      }
    },
    showAccountActive(Account) {
      this.onActivate(Account.id);
      this.select_account = Account;
      this.inception = true;
    },
    async onActivate(id) {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Account.activate(id);
      this.processing = false;

      if (!result.success) {
        this.inception = false;
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      }
    },
    async onSignIn(id, code) {
      if (this.processing) return;
      this.processing = true;
      const result = await this.Account.signIn(id, code);
      this.processing = false;
      if (!result.success) {
        this.inception = false;
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.code = null;
        this.inception = false;
        this.select_account = null;
        this.getData();
      }
    },
    beforeHideTgAccount() {
      this.select_account = null;
    },
    /**
     * Открытием модального окна подключения к публичному каналу
     * @param Account
     */
    showAccountPublicChanelConnection(Account) {
      this.select_account = Account;
      this.inception_account = true;
    },

    async joinPublicChanel(accountId, channelId) {
      const result = await this.Account.joinPublicChanel(accountId, channelId);
      console.log("joinPublicChanel", result);

      if (!result.success) {
        this.inception_account = false;
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.newjoinPublicChanel = true;
        this.answerjoinPublicChanel = result.answer;
        if (result.answer.message.media.type === "Buffer") {
          console.log("Buffer", result.answer.message.media.data);
          const base64 = btoa(
            new Uint8Array(result.answer.message.media.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          this.imageCaptcha = "data:image/png;base64," + base64;
          console.log("imageCaptcha", this.imageCaptcha);
        }
      }
    },
    async handleButtonClickJoinPublicChanel(button, index) {
      const response = {
        args: {
          accountId: this.select_account.id,
          message: {
            chatId: this.answerjoinPublicChanel.message.chatId,
            ids: this.answerjoinPublicChanel.message.ids,
            button: [index, 0],
          },
        },
      };
      // Send the response
      const result = await this.Account.confirmJoin(response.args);
      if (!result.success) {
        this.inception_account = false;
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_account = false;
      }
    },

    async handleButtonClickJoinPublicChanelText(text) {
      const response = {
        args: {
          accountId: this.select_account.id,
          message: {
            chatId: this.answerjoinPublicChanel.message.chatId,
            ids: this.answerjoinPublicChanel.message.ids,
            button: null,
            text: text,
          },
        },
      };
      // Send the response
      const result = await this.Account.confirmJoin(response.args);
      if (!result.success) {
        this.inception_account = false;
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_account = false;
      }
    },

    /**
     *  Действия при закрытии модального окна подключения к публичному каналу
     */
    beforeHideAccountPublicChanelConnection() {
      this.select_account = null;
      this.answerjoinPublicChanel = null;
      this.newjoinPublicChanel = false;
      this.answerForCaptcha = "";
      this.vmodel_chanelToAddInTask = null;
      this.imageCaptcha = null;
    },
    // модальное окно с логами
    async showAccountLog(tgAccount) {
      this.inception_account_log = true;
      const resultAccountLog = await this.Account.getLog();
      console.log("resultAccountLog", resultAccountLog);

      if (!resultAccountLog.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
        this.inception_account_log = false;
      } else {
        this.accountLog = resultAccountLog.log.rows
          .filter((account) => account.account_id === tgAccount.id)
          .reverse();
        console.log("this.accountLog", this.accountLog);
        this.updatePaginatedAccountLog();
      }
    },

    updatePaginatedAccountLog() {
      let filteredAccountLog = this.accountLog;

      if (this.vmodel_howShowLog.value === "success") {
        filteredAccountLog = this.accountLog.filter(
          (task) => task.success === 1
        );
      } else if (this.vmodel_howShowLog.value === "error") {
        filteredAccountLog = this.accountLog.filter(
          (task) => task.success === 0
        );
      }

      const start =
        (this.paginationAccountLog.page - 1) *
        this.paginationAccountLog.rowsPerPage;
      const end = start + this.paginationAccountLog.rowsPerPage;
      this.paginatedAccountLog = filteredAccountLog.slice(start, end);
    },
    beforeHideAccountJournalDialog() {
      this.select_task = null;
      this.vmodel_howShowLog = { label: "Все", value: "all" };
    },
    //#endregion
    //#region Chanel---------------------------------------------------------------------
    showChanelAdd() {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogChanelAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogChanelAddUpdateDefault.data[key];
        }
      });

      this.dialogChanelAddUpdate = {
        show: true,
        method: "add",
        onHide: () =>
          (this.dialogChannelAddUpdate = structuredClone(
            this.dialogChanelAddUpdateDefault
          )),
        data,
      };
    },
    showChanelUpdate(Chenal) {
      const excludeFields = ["isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogChanelAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogChanelAddUpdateDefault.data[key];
        }
      });

      this.dialogChanelAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogChannelAddUpdate = structuredClone(
            this.dialogChanelAddUpdateDefault
          )),
        dataWas: structuredClone(Chenal),
        data: structuredClone(Chenal),
      };
    },
    onChanelSave(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.chanel) {
        this.$q.dialogStore.set({
          show: true,
          title: "Канал сохронен",
        });
        this.dialogChanelAddUpdate.show = false;
        this.getData();
      }
    },
    onChanelRemove(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Канал удален",
        });
        this.dialogChanelAddUpdate.show = false;
        this.getData();
      }
    },
    //#endregion
    //#region task------------------------------------------------------------------------
    showTaskAdd() {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogTaskAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogTaskAddUpdateDefault.data[key];
        }
      });

      this.dialogTaskAddUpdate = {
        show: true,
        method: "add",
        onHide: () =>
          (this.dialogTaskAddUpdate = structuredClone(
            this.dialogTaskAddUpdateDefault
          )),
        data,
      };
    },
    showTaskUpdate(Task) {
      const excludeFields = ["isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogTaskAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogTaskAddUpdateDefault.data[key];
        }
      });

      this.dialogTaskAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogTaskAddUpdate = structuredClone(
            this.dialogTaskAddUpdateDefault
          )),
        dataWas: structuredClone(Task),
        data: structuredClone(Task),
      };
    },
    onTaskSave(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.task) {
        this.$q.dialogStore.set({
          show: true,
          title: "Task сохронен",
        });
        this.dialogTaskAddUpdate.show = false;
        this.getData();
      }
    },
    onTaskRemove(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Task удален",
        });
        this.dialogTaskAddUpdate.show = false;
        this.getData();
      }
    },
    // модальное окно с логами
    async showTaskLog(tgTask) {
      this.inception_task_log = true;
      const resultTaskLog = await this.Task.getTaskLog();

      if (!resultTaskLog.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
        this.inception_task_log = false;
      } else {
        this.taskLog = resultTaskLog.taskLog.rows
          .filter((task) => task.task_id === tgTask.id)
          .reverse();
        this.updatePaginatedTaskLog();
      }
    },

    updatePaginatedTaskLog() {
      let filteredTaskLog = this.taskLog;

      if (this.vmodel_howShowLog.value === "success") {
        filteredTaskLog = this.taskLog.filter((task) => task.success === 1);
      } else if (this.vmodel_howShowLog.value === "error") {
        filteredTaskLog = this.taskLog.filter((task) => task.success === 0);
      }

      const start =
        (this.paginationLog.page - 1) * this.paginationLog.rowsPerPage;
      const end = start + this.paginationLog.rowsPerPage;
      this.paginatedTaskLog = filteredTaskLog.slice(start, end);
    },
    beforeHideTaskJournalDialog() {
      this.select_task = null;
      this.vmodel_howShowLog = { label: "Все", value: "all" };
    },

    // Подключение тасков к каналам -модальное окно с подключенными каналами--------------------------------------------------------
    // показываем модальное окно добавление таска к каналу и готовим данные для списков
    async showTaskLink(tgTask) {
      this.inception_task = true;
      this.task_isLoading = true;
      this.select_task = tgTask;
      const options = await this.onGetListAddChanels(tgTask.id);

      const filteredObjects = options
        .map((item) => {
          const channel = this.$q.appStore.chanelList.find(
            (channel) => channel.id === item.channel_id
          );
          if (channel && channel.is_deleted === 0) {
            return {
              label: channel.description,
              value: item.id,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);

      this.options_chanelsAddedToTask = filteredObjects;

      this.options_chanelToAddInTask = this.$q.appStore.chanelList
        .filter((item) => {
          return (
            item.is_deleted === 0 &&
            !options.some((task) => task.channel_id === item.id)
          );
        })
        .map((item) => ({
          label: item.description,
          value: item.id,
        }));

      this.task_isLoading = false;
    },
    // получаем список каналов подключенных в задачу
    async onGetListAddChanels(id) {
      const result = await this.Task.taskChanelList(id);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
        return [];
      } else {
        return result.task.rows;
      }
    },

    async onGetListAddAccounts(id) {
      const result = await this.Task.getAccountList(id);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
        return [];
      } else {
        return result.task.rows;
      }
    },

    async onAddChanelToTask(data) {
      if (this.vmodel_chanelToAddInTask === null) return;
      if (this.processing) return;
      this.processing = true;
      const result = await this.Task.addTaskToChannel(
        this.vmodel_chanelToAddInTask.value,
        data.id
      );

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_task = false;
      }

      this.processing = false;
    },

    async onRemoveChanelFromTask(data) {
      if (this.vmodel_chanelsAddedToTask === null) return;
      if (this.processing) return;
      this.processing = true;

      const result = await this.Task.removeTaskFromChannel(data);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_task = false;
      }
      this.processing = false;
    },

    beforeHideTaskLinkDialog() {
      this.vmodel_chanelToAddInTask = null;
      this.vmodel_chanelsAddedToTask = null;
      this.select_task = null;
    },

    //! модальное окно с подключением аккаунтов к задачам--------------------------------------------------------------

    async showAccountLink(tgTask) {
      this.inception_task_account = true;
      this.task_isLoading = true;
      this.select_task = tgTask;

      const options = await this.onGetListAddCAccounts(tgTask.id);

      const filteredObjects = options
        .map((item) => {
          const account = this.$q.appStore.accountList.find(
            (account) => account.id === item.account_id
          );
          if (account && account.is_deleted === 0) {
            return {
              label: account.description,
              value: account.id,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);

      this.options_accountsAddedToTask = filteredObjects;

      this.options_accountToAddInTask = this.$q.appStore.accountList
        .filter((item) => {
          return (
            item.is_deleted === 0 &&
            !options.some((task) => task.account_id === item.id)
          );
        })
        .map((item) => ({
          label: item.description,
          value: item.id,
        }));

      this.task_isLoading = false;
    },

    //Получаем список аккаунтов подключенных к задаче
    async onGetListAddCAccounts(id) {
      const result = await this.Task.getAccountList(id);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
        return [];
      } else {
        return result.taskAcc.rows;
      }
    },

    async onAddAccountToTask(id, data) {
      if (data === null) return;
      if (this.processing) return;
      this.processing = true;

      const values = data.map((item) => parseInt(item.value));

      const result = await this.Task.addAccount(id, values);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_task_account = false;
      }

      this.processing = false;
    },

    async onRemoveAccountFromTask(id, data) {
      if (data === null) return;
      if (this.processing) return;
      this.processing = true;

      const values = data.map((item) => parseInt(item.value));

      const result = await this.Task.removeAccount(id, values);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_task_account = false;
      }
      this.processing = false;
    },

    // перед закрытием модального окна с подключением аккаунтов
    beforeHideTaskAccountDialog() {
      this.vmodel_accountToAddInTask = null;
      this.vmodel_accountsAddedToTask = null;
      this.select_task = null;
    },

    //#endregion
    //#region Расписание----------------------------------------------------------------
    showSheduleAdd() {
      const excludeFields = ["id", "isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogScheduleAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogScheduleAddUpdateDefault.data[key];
        }
      });

      this.dialogScheduleAddUpdate = {
        show: true,
        method: "add",
        onHide: () =>
          (this.dialogScheduleAddUpdate = structuredClone(
            this.dialogScheduleAddUpdateDefault
          )),
        data,
      };
    },
    showSheduleUpdate(Shedule) {
      const excludeFields = ["isDeleted", "active"];
      const data = {};
      Object.keys(this.dialogScheduleAddUpdateDefault.data).forEach((key) => {
        if (!excludeFields.includes(key)) {
          data[key] = this.dialogScheduleAddUpdateDefault.data[key];
        }
      });

      this.dialogScheduleAddUpdate = {
        show: true,
        method: "update",
        onHide: () =>
          (this.dialogScheduleAddUpdate = structuredClone(
            this.dialogScheduleAddUpdateDefault
          )),
        dataWas: structuredClone(Shedule),
        data: structuredClone(Shedule),
      };
    },
    onSheduleSave(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success && result.schedule) {
        this.$q.dialogStore.set({
          show: true,
          title: "Расписание сохранено",
        });
        this.dialogScheduleAddUpdate.show = false;
        this.getData();
      }
    },
    onSheduleRemove(result) {
      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else if (result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Расписание удалено",
        });
        this.dialogScheduleAddUpdate.show = false;
        this.getData();
      }
    },
    //подключение таска к расписанию

    //подклюяение расписания к таску
    async showScheduleClock(Schedule) {
      this.inception_Schedule_task = true;

      this.schedule_isLoading = true;
      this.select_schedule = Schedule;
      this.listOfSchedulesAndTasks = await this.onGetListAddTasksToShedule(
        Schedule.id
      );

      this.options_taskToAddInSchedule = this.$q.appStore.taskList
        .filter((item) => {
          return (
            item.is_deleted === 0 &&
            (!this.listOfSchedulesAndTasks ||
              !this.listOfSchedulesAndTasks.some(
                (task) => task.task_id === item.id
              ))
          );
        })
        .map((item) => ({
          label: item.description,
          value: item.id,
        }));

      this.schedule_isLoading = false;

      const filteredObjects =
        this.listOfSchedulesAndTasks && this.listOfSchedulesAndTasks.length > 0
          ? this.listOfSchedulesAndTasks
              .map((item) => {
                const task = this.$q.appStore.taskList.find(
                  (task) => task.id === item.task_id
                );
                if (task && task.is_deleted === 0) {
                  return {
                    label: task.description,
                    value: task.id,
                  };
                } else {
                  return null;
                }
              })
              .filter((item) => item !== null)
          : [];

      this.options_tasksAddedToSchedule = filteredObjects;
    },
    async onGetListAddTasksToShedule(id) {
      const result = await this.Schedule.getTaskList(id);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
        return [];
      } else {
        return result.schedule.rows;
      }
    },

    async onAddTaskToShedule(data) {
      if (this.vmodel_taskToAddInSchedule === null) return;
      if (this.processing) return;
      this.processing = true;
      const result = await this.Schedule.addTaskToSchedule(
        data.id,
        this.vmodel_taskToAddInSchedule.value
      );

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_Schedule_task = false;
      }

      this.processing = false;
    },

    async onRemoveTaskFromShedule(task_id) {
      const foundObject = this.listOfSchedulesAndTasks.find((item) => {
        return (
          item.schedule_id === this.select_schedule.id &&
          item.task_id === task_id
        );
      });

      if (!foundObject) return;

      if (this.vmodel_tasksAddedToSchedule === null) return;
      if (this.processing) return;
      this.processing = true;

      const result = await this.Schedule.removeTask(foundObject.id);

      if (!result.success) {
        this.$q.dialogStore.set({
          show: true,
          title: "Ошибка",
          text: result.message,
          ok: {
            color: "red",
          },
        });
      } else {
        this.inception_Schedule_task = false;
      }
      this.processing = false;
    },

    beforeHideShedule() {
      this.vmodel_taskToAddInSchedule = null;
      this.vmodel_tasksAddedToSchedule = null;
      this.select_schedule = null;
    },
    //#endregion
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString(); // Форматируем дату в локальный формат
    },
  },
  watch: {
    paginationLog: {
      handler() {
        console.log("paginationLog");
        this.updatePaginatedTaskLog();
      },
      deep: true,
    },
    paginationAccountLog: {
      handler() {
        console.log("paginationAccount");
        this.updatePaginatedAccountLog();
      },
      deep: true,
    },
  },
  computed: {
    maxPages() {
      const filteredTaskLog = this.taskLog.filter((task) => {
        if (this.vmodel_howShowLog.value === "all") {
          return true;
        }
        if (this.vmodel_howShowLog.value === "success") {
          return task.success === 1;
        }
        if (this.vmodel_howShowLog.value === "error") {
          return task.success === 0;
        }
      });
      return Math.ceil(filteredTaskLog.length / this.paginationLog.rowsPerPage);
    },
    maxPagesAccount() {
      const filteredTaskLog = this.accountLog.filter((task) => {
        if (this.vmodel_howShowLog.value === "all") {
          return true;
        }
        if (this.vmodel_howShowLog.value === "success") {
          return task.success === 1;
        }
        if (this.vmodel_howShowLog.value === "error") {
          return task.success === 0;
        }
      });
      return Math.ceil(
        filteredTaskLog.length / this.paginationAccountLog.rowsPerPage
      );
    },
  },
});
</script>

<style lang="scss">
</style>
