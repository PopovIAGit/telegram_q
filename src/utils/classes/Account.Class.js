import { useQuasar } from "quasar";

class Account {
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
      phone: {
        label: "Телефон",
        type: "string",
        default: "",
        mask: "+###########",
        min: 12,
        max: 12,
        required: true,
        rules: (val) => {
          return val && val.length === 12;
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
      response: {
        label: "Автоматический ответ",
        type: "string",
        default: "",
        min: 1,
        max: 3000,
        rules: (val) => {
          return val && val.length >= 2 && val.length <= 3000;
        },
      },
      active: {
        label: "Активен",
        type: "boolean",
        default: false,
        rules: (val) => {
          return typeof val === "boolean";
        },
      },
      isDeleted: {
        label: "Удален",
        type: "boolean",
        default: false,
        rules: (val) => {
          return typeof val === "boolean";
        },
      },
      autoConnect: {
        label: "Автоматическое подключение",
        type: "boolean",
        default: false,
        rules: (val) => {
          return typeof val === "boolean";
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
        iface: "tgAccount",
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
        const Account = response.args;
        return {
          success: true,
          Account,
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
          iface: "tgAccount",
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
      iface: "tgAccount",
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

      return {
        success: true,
      };
    }
  }

  async activate(accountId) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgAccount",
      method: "activate",
      args: {
        accountId: accountId,
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
      const answer = response.args;
      return {
        success: true,
        answer,
      };
    }
  }

  async signIn(accountId, phoneCode) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgAccount",
      method: "signIn",
      args: {
        accountId: accountId,
        phoneCode: phoneCode,
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
      const answer = response.args;
      return {
        success: true,
        answer,
      };
    }
  }
  async joinPublicChanel(accountId, channelId) {
    console.log(accountId, channelId);

    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgAccount",
      method: "joinToPublicChanel",
      args: {
        accountId: accountId,
        channelId: channelId,
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
      const answer = response.args;
      return {
        success: true,
        answer,
      };
    }
  }

  async confirmJoin(args) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgAccount",
      method: "confirmJoin",
      args: args,
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
      const answer = response.args;
      return {
        success: true,
        answer,
      };
    }
  }

  async getList() {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgAccount",
      method: "getList",
      args: {},
    });
    return response;
  }

  /**
   * Get the list of logs for all accounts
   * @return {Promise<{success: boolean, message: string}|{success: boolean, log: *}>}
   */
  async getLog() {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgAccount",
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
      const log = response.args;
      return {
        success: true,
        log,
      };
    }
  }
}

export default Account;
