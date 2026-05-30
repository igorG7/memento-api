import argon2 from "argon2";
import { configDotenv } from "dotenv";
import validator from "validator";

configDotenv();

const argon = argon2;

export class Password {
  private static pepper = process.env.PEPPER; // * Segredo mantido na env

  private static applyPepper(password: string) {
    return password; // * + Password.pepper; // Ajuda na segurança, adicionando um segredo junto as senhas fornecidas.
  }

  static async hash(password: string) {
    const spicyPassword = Password.applyPepper(password);

    console.log(spicyPassword);

    const hash = await argon.hash(spicyPassword, {
      type: argon.argon2id,
      memoryCost: 2 ** 16, // 64mb
      timeCost: 3, // Números de iterações
      parallelism: 2, // Números de núcleos utilizados
    });

    return hash;
  }

  static async compare(hash: string, password: string) {
    const spicyPassword = Password.applyPepper(password);

    const matches = await argon.verify(hash, spicyPassword);
    return matches;
  }

  static isStrong(password: string) {
    return validator.isStrongPassword(password, {
      minLength: 10,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    });
  }
}

// (async function teste() {
//   const password = "senhadeteste";
//   const password1 = "senhadeteste0";

//   const hash = await Password.hash(password);
//   console.log(hash);

//   const secure = Password.isStrong(password);
//   console.log(secure);

//   const valid = await Password.compare(hash, password);
//   const valid1 = await Password.compare(hash, password1);
//   console.log(valid, valid1);
// })();
