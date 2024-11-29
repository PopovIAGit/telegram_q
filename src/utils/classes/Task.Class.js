import { useQuasar } from "quasar";

class Task {
  constructor() {
    this.$q = useQuasar();

    // DB fields
    this.fields = {
      id: {
        label: "ID",
        type: "number",
        default: undefined,
        index: true,
        rules: (val) => {
          return val !== null && typeof val === "number";
        },
      },
      description: {
        label: "Описание",
        type: "string",
        default: "",
        min: 2,
        max: 3000,
        rules: (val) => {
          return val && val.length >= 2 && val.length <= 3000;
        },
      },
      message: {
        label: "сообщение",
        type: "string",
        default: "",
        required: true,
        min: 2,
        max: 3000,
        rules: (val) => {
          return val && val.length >= 2 && val.length <= 3000;
        },
      },
      userId: {
        label: "id пользователя",
        type: "number",
        default: undefined,
        rules: (val) => {
          return val !== null;
        },
      },
      chanelId: {
        label: "Добавить каналы",
        type: "number",
        default: undefined,
        rules: (val) => {
          return val !== null && typeof val === "number";
        },
      },
      owner_id: {
        label: "owner_id",
        type: "number",
        default: false,
        rules: (val) => {
          return typeof val && val !== null && typeof val === "number";
        },
      },
      file: {
        label: "файл",
        type: "string",
        default: "",
        rules: (val) => {
          return val && val.length >= 2 && val.length <= 30000;
        },
      },
    };

    // Dialog add/update
    this.dialogAddUpdateDefault = {
      show: false,
      method: undefined,
      onHide: undefined,
      dataWas: {
        ...Object.assign(
          {},
          ...Object.entries(this.fields).map(([k, v]) => ({ [k]: v.default }))
        ),
      },
      data: {
        ...Object.assign(
          {},
          ...Object.entries(this.fields).map(([k, v]) => ({ [k]: v.default }))
        ),
      },
    };
  }

  /**
   * Сохранение задач (add или update)
   * @param method
   * @param data
   * @param dataWas
   * @return {Promise<{success: boolean, message: string}|{success: boolean, user: *}|{success: boolean, noChanges: boolean}>}
   */
  async save(method, data, dataWas) {
    // Если add
    if (method === "add" && data) {
      const _data = structuredClone(data);
      const response = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgTask",
        method: "add",
        args: {
          task: {
            ..._data,
          },
        },
      });
      // Если ошибка сохранения
      if (response.type === "error") {
        return {
          success: false,
          message: response.args.message || "Ошибка",
        };
      }
      // Если всё ОК
      else if (response.type === "answer") {
        const task = response.args;
        return {
          success: true,
          task,
        };
      }
    }
    // Если update и переданы data и dataWas для сравнения
    else if (method === "update" && data && dataWas) {
      const _data = {};
      Object.keys(data).forEach((key) => {
        if (data[key] !== dataWas[key]) {
          _data[key] = data[key];
        }
      });

      // Если нет никаких изменений
      if (Object.keys(_data).length === 0) {
        return {
          success: false,
          noChanges: true,
        };
      }
      // Если есть изменения, то сохраняем их
      else {
        const response = await this.$q.ws.sendRequest({
          type: "query",
          iface: "tgTask",
          method: "update",
          args: {
            id: data.id,
            ..._data,
          },
        });
        // Если ошибка сохранения
        if (response.type === "error") {
          return {
            success: false,
            message: response.args.message || "Ошибка",
          };
        }
        // Если всё ОК
        else if (response.type === "answer") {
          const task = response.args;
          return {
            success: true,
            task,
          };
        }
      }
    }
  }

  async delete(personId) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "delete",
      args: {
        id: personId,
      },
    });

    // Если ошибка удаления
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если получен ответ от login
    else if (response.type === "answer") {
      // Если всё ОК

      return {
        success: true,
      };
    }
  }

  async taskChanelList(id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "getChannelList",
      args: {
        task_id: id,
      },
    });

    // Если ошибка сохранения
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const task = response.args;
      return {
        success: true,
        task,
      };
    }
  }
  async chanelTaskList(channel_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "getChannelList",
      args: {
        where: {
          channel_id: channel_id,
        },
      },
    });

    // Если ошибка сохранения
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const task = response.args;
      return {
        success: true,
        task,
      };
    }
  }

  async addTaskToChannel(channel_id, task_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "addChannel",
      args: {
        task_id: task_id,
        channel_id: channel_id,
      },
    });

    // Если ошибка сохранения
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const task = response.args;
      return {
        success: true,
        task,
      };
    }
  }

  async removeTaskFromChannel(task_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "removeChannel",
      args: {
        id: task_id,
      },
    });

    // Если ошибка сохранения
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const task = response.args;
      return {
        success: true,
        task,
      };
    }
  }

  /**
   *
   * @param {*} id
   * @param {*} limit
   * @param {*} offset
   * @param {*} order [a,b] a - field ,b - asc or desc
   * @returns
   */
  async getTaskLog() {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "getLogList",
      args: {},
    });

    // If there was an error saving
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // If everything is OK
    else if (response.type === "answer") {
      const taskLog = response.args;
      return {
        success: true,
        taskLog,
      };
    }
  }
  //!----Новые методы------------------------------
  /**
   * Получение списка аккаунтов для задачи
   * @param {*} id
   * @returns {Promise<{success: boolean, message: string}|{success: boolean, taskLog: *}>}
   */
  async getAccountList(id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "getAccountList",
      args: {
        task_id: id,
      },
    });

    // Если ошибка сохранения
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const taskAcc = response.args;
      return {
        success: true,
        taskAcc,
      };
    }
  }
  async addAccount(id, account_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "addAccount",
      args: {
        task_id: id,
        account_id: account_id,
      },
    });

    // Если ошибка сохранения
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const taskLog = response.args;
      return {
        success: true,
        taskLog,
      };
    }
  }

  async removeAccount(id, account_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "removeAccount",
      args: {
        task_id: id,
        account_id: account_id,
      },
    });

    // Если ошибка сохранения
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const taskLog = response.args;
      return {
        success: true,
        taskLog,
      };
    }
  }

  async addNewTask(task, chanels, accounts) {
    const data = {
      task: task,
      chanels: chanels,
      accounts: accounts,
    };
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "addNewTask",
      args: {
        data,
      },
    });
  }
}
export default Task;
