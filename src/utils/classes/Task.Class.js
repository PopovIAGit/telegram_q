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
          return val !== null && typeof val === "number";
        },
      },
      chanelId: {
        label: "id канала",
        type: "number",
        default: undefined,
        rules: (val) => {
          return val !== null && typeof val === "number";
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
   * Сохранение пользователя (add или update)
   * @param method
   * @param data
   * @param dataWas
   * @return {Promise<{success: boolean, message: string}|{success: boolean, user: *}|{success: boolean, noChanges: boolean}>}
   */
  async save(method, data, dataWas) {
    // Если add
    if (method === "add" && data) {
      const _data = structuredClone(data);
      delete _data.password2;
      const response = await this.$q.ws.sendRequest({
        type: "query",
        iface: "tgTask",
        method: "add",
        args: {
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
          const Account = response.args;
          return {
            success: true,
            Account,
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
      // Если в ответе по каким-то причинам нет данных пользователя
      if (!response.args || !response.args.id || !response.args.token) {
        return {
          success: false,
        };
      }
      // Если всё ОК
      else {
        return {
          success: true,
        };
      }
    }
  }

  async taskChanelList(task_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "getChannelList",
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
      const Account = response.args;
      return {
        success: true,
        Account,
      };
    }
  }
  async chanelTaskList(channel_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "getChannelList",
      args: {
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
      const Account = response.args;
      return {
        success: true,
        Account,
      };
    }
  }

  async addTaskToChannel(channel_id, task_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgTask",
      method: "addChannelt",
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
      const Account = response.args;
      return {
        success: true,
        Account,
      };
    }
  }
}

export default Task;
