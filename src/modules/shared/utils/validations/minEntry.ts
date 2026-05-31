import { BadRequest } from "../../../../shared/utils/appErrors.js";

export const verifyMinEntry = (data: any) => {
  const keys = Object.keys(data);

  if (!keys.length) throw new BadRequest("Nenhuma informação foi recebida.");
};
