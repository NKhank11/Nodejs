module.exports.generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
} 

module.exports.generateRandomNumber = (length) => {
  const characters = '0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
} 