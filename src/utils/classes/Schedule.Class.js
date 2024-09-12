import { useQuasar } from "quasar";

class Schedule {
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
      weeksDay: {
        label: "День недели",
        type: "number",
        default: undefined,
        required: true,
        min: 0,
        max: 7,
        rules: (val) => {
          return val !== null && val !== undefined;
        },
      },
      workingTime: {
        label: "Время работы",
        type: "string",
        default: "",
        required: true,
        min: 2,
        max: 3000,
        rules: (val) => {
          return val && val.length >= 2 && val.length <= 3000;
        },
      },
      timezone: {
        label: "Часовой пояс UTC",
        type: "string",
        default: "",
        required: true,
        min: 2,
        max: 3000,
        rules: (val) => {
          return val !== null && val !== undefined;
        },
      },
      frequency: {
        label: "Частота сообщений",
        type: "number",
        default: undefined,
        required: true,
        min: 1,
        max: 36000,
        rules: (val) => {
          return val !== null && val !== undefined;
        },
      },
      owner_id: {
        label: "id пользователя",
        type: "number",
        default: undefined,
        rules: (val) => {
          return val !== null && typeof val === "number";
        },
      },

      task_id: {
        label: "Добавить каналы",
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

      const response = await this.$q.ws.sendRequest({
        type: "query",
        iface: "schedule",
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
        const schedule = response.args;
        return {
          success: true,
          schedule,
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
          iface: "schedule",
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
          const schedule = response.args;
          return {
            success: true,
            schedule,
          };
        }
      }
    }
  }

  async delete(scheduleId) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "schedule",
      method: "delete",
      args: {
        id: scheduleId,
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

  async getList() {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "schedule",
      method: "getList",
      args: {},
    });

    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    if (response.type === "answer") {
      const schedules = response.args;
      return {
        success: true,
        schedules,
      };
    }
  }

  async addTaskToSchedule(scheduleId, taskId) {
    console.log(scheduleId, taskId);

    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "schedule",
      method: "addTask",
      args: {
        schedule_id: scheduleId,
        task_id: taskId,
      },
    });

    console.log(response);

    // Если ошибка
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const schedule = response.args;
      return {
        success: true,
        schedule,
      };
    }
  }

  async getTaskList(schedule_id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "schedule",
      method: "getTaskList",
      args: {
        where: {
          schedule_id: schedule_id,
        },
      },
    });

    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    if (response.type === "answer") {
      const schedule = response.args;
      return {
        success: true,
        schedule,
      };
    }
  }

  async removeTask(id) {
    const response = await this.$q.ws.sendRequest({
      type: "query",
      iface: "schedule",
      method: "removeTask",
      args: {
        id: id,
      },
    });

    console.log(response);

    // Если ошибка
    if (response.type === "error") {
      return {
        success: false,
        message: response.args.message || "Ошибка",
      };
    }
    // Если всё ОК
    else if (response.type === "answer") {
      const schedule = response.args;
      return {
        success: true,
        schedule,
      };
    }
  }
}
export default Schedule;
