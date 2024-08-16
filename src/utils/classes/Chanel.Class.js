import { useQuasar } from "quasar";

class Chanel {
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
      url: {
        label: "URL",
        type: "string",
        default: "",
        required: true,
        rules: (val) => {
          // You can add custom validation rules for URL here
          return val && val.length > 0;
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
   * Сохранение chanel (add или update)
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
        iface: "tgChannel",
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
        const chanel = response.args;
        return {
          success: true,
          chanel,
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
          iface: "tgChannel",
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
          const chanel = response.args;
          return {
            success: true,
            chanel,
          };
        }
      }
    }
  }

  async delete(chanelId) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "tgChannel",
      method: "delete",
      args: {
        id: chanelId,
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
}

export default Chanel;
