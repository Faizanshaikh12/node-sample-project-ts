  import {scrypt, randomBytes} from "crypto";

const randomToken = () => {
  return randomBytes(60).toString('hex');
}

const hash = (password: string) => {
  return new Promise((resolve, reject) => {
    scrypt(password, '', 8, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
};

const verify = (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    scrypt(password, salt, 4, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString('hex'));
    });
  });
};

export const AuthHelpers = {
  hash,
  verify,
  randomToken
};
