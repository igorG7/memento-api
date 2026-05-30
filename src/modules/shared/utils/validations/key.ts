import { BadRequest } from "../../../../shared/utils/appErrors.ts";
import { verifyMinEntry } from "./minEntry.ts";

export class Key {
  static normalize(validators: any, filter: any) {
    for (const [key, value] of Object.entries(filter)) {
      if (validators[key].type === "boolean" && (value === "true" || value === "false"))
        filter[key] = Boolean(value);
      if (validators[key].type === "number") filter[key] = Number(value);
    }
  }

  static validate(validators: any, data: any) {
    verifyMinEntry(data);

    for (const key of Object.keys(data)) {
      if (!validators[key]) {
        throw new BadRequest(`Chave '${key}' não permitida`);
      }
    }

    for (const [key, type] of Object.entries(validators)) {
      const value = data[key];
      const validator = type as any;

      if (!(key in data)) {
        if (validator.required) {
          throw new BadRequest(`Chave ${key} é obrigatória.`);
        }

        continue;
      }

      if (validator.type === "array") {
        if (!Array.isArray(value)) {
          throw new BadRequest(`Chave '${key}' precisa ser do tipo ${validator.type}.`);
        }
      } else if (typeof value !== validator.type) {
        throw new BadRequest(`Chave '${key}' precisa ser do tipo ${validator.type}.`);
      }

      if (value === undefined || value === null || value === "") {
        throw new BadRequest(`Chave '${key}' sem valor válido.`);
      }

      if (validator.enum && !validator.enum.includes(value)) {
        throw new BadRequest(`Chave "${key}" permite apenas: ${validator.enum.join(", ")}.`);
      }

      if (validator.type === "array" && validator.items) {
        for (const item of value) {
          if (typeof item !== validator.items) {
            throw new BadRequest(`Itens de '${key}' precisam ser do tipo ${validator.items}.`);
          }
        }
      }

      if (validator.fields) {
        if (validator.type === "object") {
          Key.validate(validator.fields, value);
        }

        if (validator.type === "array") {
          for (const item of value) {
            Key.validate(validator.fields, item);
          }
        }
      }
    }
  }
}
