// tempStorage.js
const tempStorage = {};

export const storeTempBusinessData = (email, data) => {
  tempStorage[email] = data;
};

export const getTempBusinessData = (email) => {
  return tempStorage[email];
};

export const deleteTempBusinessData = (email) => {
  delete tempStorage[email];
};