fetch('https://accounts.google.com/.well-known/openid-configuration')
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
