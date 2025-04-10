const ldap = require("ldapjs");

async function ldapAuth(username, password) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({ url: "ldap://ad-server" });
    const dn = `CN=${username},OU=Usuarios,DC=xpto,DC=corp`;
    client.bind(dn, password, (err) => {
      if (err) return resolve(null);
      resolve({ username });
    });
  });
}

module.exports = ldapAuth;