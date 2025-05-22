const ldap = require("ldapjs");

async function ldapAuth(username, password) {
  return new Promise((resolve, reject) => {
    const ldapUrl = process.env.LDAP_URL || "ldap://ldapbr.cencosud.corp";
    const baseDN = process.env.LDAP_BASE_DN || "OU=Usuarios,OU=Brasil,DC=cencosud,DC=corp";

    const client = ldap.createClient({ url: ldapUrl });

    console.log("🔐 Iniciando autenticação via LDAP...");
    console.log("🔎 Servidor LDAP:", ldapUrl);
    console.log("📍 Base de busca:", baseDN);
    console.log("👤 Usuário:", username);

    const searchOptions = {
      scope: "sub",
      filter: `(sAMAccountName=${username})`
    };

    client.search(baseDN, searchOptions, (err, res) => {
      if (err) {
        console.error("❌ Erro ao buscar usuário no LDAP:", err.message);
        client.unbind();
        return resolve(null);
      }

      let userDN = null;

      res.on("searchEntry", (entry) => {
        userDN = entry.object.dn;
        console.log("✅ DN encontrado:", userDN);
      });

      res.on("error", (err) => {
        console.error("❌ Erro durante a busca LDAP:", err.message);
        client.unbind();
        resolve(null);
      });

      res.on("end", () => {
        if (!userDN) {
          console.warn("⚠️ Nenhum DN encontrado para o usuário:", username);
          return resolve(null);
        }

        console.log("🔐 Tentando bind com o DN...");
        client.bind(userDN, password, (err) => {
          client.unbind();
          if (err) {
            console.warn("❌ Falha no bind LDAP:", err.message);
            return resolve(null);
          }
          console.log("✅ Autenticação bem-sucedida.");
          resolve({ username });
        });
      });
    });
  });
}

module.exports = ldapAuth;
