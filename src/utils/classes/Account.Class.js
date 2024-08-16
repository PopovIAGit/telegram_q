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
      console.log("add", response);
      // Если ошибка сохранения
      if (response.type === "error") {
        return {
          success: false,
          message: response.args.message || "Ошибка",
        };
      }
      // Если всё ОК
      else if (response.type === "answer") {
        const user = response.args;
        return {
          success: true,
          user,
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
        console.log("update", _data);
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
    console.log(response);
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

  async activate(accountId) {
    console.log(accountId);
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgAccount",
      method: "activate",
      args: {
        accountId: accountId,
      },
    });
    console.log(response);
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
    console.log(response);
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
}

export default Account;
