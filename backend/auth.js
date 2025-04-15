const ldap = require("ldapjs");

async function ldapAuth(username, password) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: process.env.LDAP_URL || "ldap://ldapbr.cencosud.corp"
    });

    const searchBase = "OU=Brasil,DC=cencosud,DC=corp";
    const searchOptions = {
      scope: "sub",
      filter: `(sAMAccountName=${username})`
    };

    client.search(searchBase, searchOptions, (err, res) => {
      if (err) {
        client.unbind();
        return resolve(null);
      }

      let userDN = null;

      res.on("searchEntry", (entry) => {
        userDN = entry.object.dn;
      });

      res.on("error", () => {
        client.unbind();
        resolve(null);
      });

      res.on("end", () => {
        if (!userDN) return resolve(null);

        // Agora tenta o bind com o DN encontrado
        client.bind(userDN, password, (err) => {
          client.unbind();
          if (err) return resolve(null);
          resolve({ username });
        });
      });
    });
  });
}

module.exports = ldapAuth;
