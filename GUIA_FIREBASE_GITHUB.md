# Guia completo — Gestão e Consulta SIRESP em dois repositórios

## 1. Resultado final

Serão publicados dois sites GitHub Pages independentes:

- **Gestão:** registo e edição local dos equipamentos SIRESP/ROB, backup JSON e botão de sincronização.
- **Consulta:** listagem SIRESP protegida por password, sem edição.

Os dados completos continuam guardados no navegador da gestão. O Firebase recebe apenas: Rádio Nº, Tipo, ISSI, S/N, Marca, Modelo, Alocado, Estado e Localização. ROB, notas, avarias, históricos, inventário e configurações nunca são publicados.

O primeiro acesso administrativo pede email e password. Depois, a autorização fica guardada nesse navegador e o botão **Sincronizar consulta** funciona sem novo login, até escolher **Terminar sessão Firebase**.

## 2. Criar o projeto Firebase

1. Entre em <https://console.firebase.google.com/>.
2. Escolha **Criar um projeto**.
3. Atribua um nome, por exemplo `radios-cbsleiria`.
4. O Google Analytics não é necessário para esta aplicação.
5. No painel do projeto, carregue no ícone **Web** (`</>`).
6. Dê um nome interno, por exemplo `Radios CBSLeiria Web`.
7. Não ative Firebase Hosting: os sites ficarão no GitHub Pages.
8. Termine o registo e guarde o objeto `firebaseConfig` apresentado.

Documentação oficial: <https://firebase.google.com/docs/web/setup>

## 3. Criar o Firestore

1. Na Firebase Console, abra **Build → Firestore Database**.
2. Escolha **Create database**.
3. Selecione **Production mode**.
4. Escolha uma localização europeia adequada. A localização não pode ser alterada posteriormente.
5. Conclua a criação.

Não é necessário criar manualmente a coleção. A primeira sincronização criará o documento `publicacoes/siresp`.

## 4. Ativar autenticação por email/password

1. Abra **Build → Authentication**.
2. Escolha **Get started**.
3. Em **Sign-in method**, abra **Email/Password**.
4. Ative apenas **Email/Password** e guarde.

Documentação oficial: <https://firebase.google.com/docs/auth/web/password-auth>

## 5. Criar as duas contas Firebase

Em **Authentication → Users**, use **Add user** para criar:

1. Uma conta administrativa, por exemplo `radios.admin@dominio.pt`, com password forte e exclusiva.
2. Uma conta de consulta, por exemplo `radios.consulta@dominio.pt`, com uma password diferente para partilhar com os utilizadores autorizados.

Depois de criar cada conta:

1. Abra os detalhes do utilizador.
2. Copie o respetivo **User UID**.
3. Guarde qual é o `ADMIN_UID` e qual é o `VIEWER_UID`.

Nunca escreva nenhuma das passwords nos ficheiros do site.

## 6. Publicar as regras Firestore

1. Abra o ficheiro `firestore.rules` da pasta `PUBLICAR_GITHUB_GESTAO`.
2. Substitua `SUBSTITUIR_ADMIN_UID` pelo UID da conta administrativa.
3. Substitua `SUBSTITUIR_VIEWER_UID` pelo UID da conta de consulta.
4. Na Firebase Console, abra **Firestore Database → Rules**.
5. Substitua integralmente o conteúdo pelas regras do ficheiro.
6. Carregue em **Publish**.

Estas regras permitem:

- leitura à conta administrativa e à conta de consulta;
- escrita apenas à conta administrativa;
- nenhum acesso sem autenticação;
- nenhum acesso a outros caminhos da base de dados;
- nenhuma eliminação direta do documento publicado.

Documentação oficial: <https://firebase.google.com/docs/firestore/security/get-started>

## 7. Criar os dois repositórios GitHub

Crie dois repositórios públicos, por exemplo:

- `radios-cbsleiria-gestao`
- `radios-cbsleiria-consulta`

Em cada repositório:

1. Abra **Settings → Pages**.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Guarde.

Os endereços ficarão semelhantes a:

```text
https://SEU_UTILIZADOR.github.io/radios-cbsleiria-gestao/
https://SEU_UTILIZADOR.github.io/radios-cbsleiria-consulta/
```

Documentação oficial: <https://docs.github.com/pages>

## 8. Preencher `firebase-config.js`

Existem duas cópias de `firebase-config.js`, uma em cada pasta de publicação. Ambas devem receber exatamente o mesmo `firebaseConfig` e o mesmo email de consulta.

1. Na Firebase Console, abra **Project settings → General → Your apps**.
2. Na aplicação Web, copie os valores do objeto `firebaseConfig`.
3. Abra `PUBLICAR_GITHUB_GESTAO/firebase-config.js`.
4. Substitua os valores `SUBSTITUIR_...` pelos valores Firebase.
5. Em `viewerEmail`, escreva o email da conta de consulta.
6. Em `consultationUrl`, escreva o endereço GitHub Pages completo do repositório de consulta, terminando em `/`.
7. Repita a configuração em `PUBLICAR_GITHUB_CONSULTA/firebase-config.js`.

Exemplo ilustrativo:

```js
export const firebaseConfig = Object.freeze({
  apiKey: 'valor-copiado-da-firebase',
  authDomain: 'radios-cbsleiria.firebaseapp.com',
  projectId: 'radios-cbsleiria',
  storageBucket: 'radios-cbsleiria.firebasestorage.app',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef'
});

export const viewerEmail = 'radios.consulta@dominio.pt';
export const consultationUrl = 'https://SEU_UTILIZADOR.github.io/radios-cbsleiria-consulta/';
```

O objeto `firebaseConfig` é uma identificação pública da aplicação Web; a proteção efetiva é feita pela autenticação e pelas regras Firestore. Não coloque passwords, chaves privadas nem contas de serviço nestes ficheiros.

## 9. Autorizar o domínio GitHub Pages

1. Abra **Authentication → Settings → Authorized domains**.
2. Adicione apenas o domínio, sem `https://` e sem o nome do repositório:

```text
SEU_UTILIZADOR.github.io
```

O mesmo domínio serve os dois repositórios.

## 10. Ficheiros do repositório de gestão

Carregue **o conteúdo** da pasta `PUBLICAR_GITHUB_GESTAO` para a raiz do repositório de gestão:

```text
index.html
app-v2.js
styles.css
features.css
logo-fix.css
firebase-sync.js
firebase-config.js
jszip.min.js
qrcode.js
logo.png
radio-portatil.png
radio-base.png
manifest.webmanifest
sw.js
firestore.rules
README.md
GUIA_FIREBASE_GITHUB.md
THIRD_PARTY_NOTICES.md
```

O ficheiro `firestore.rules` fica no repositório como referência; as regras só ficam ativas depois de publicadas na Firebase Console.

## 11. Ficheiros do repositório de consulta

Carregue **o conteúdo** da pasta `PUBLICAR_GITHUB_CONSULTA` para a raiz do repositório de consulta:

```text
index.html
consulta.js
consulta.css
styles.css
features.css
logo-fix.css
firebase-config.js
logo.png
manifest.webmanifest
sw.js
README.md
THIRD_PARTY_NOTICES.md
```

Como a consulta se chama `index.html`, o endereço termina no nome do repositório, sem `/consulta.html`.

## 12. Primeira utilização

1. Aguarde a publicação dos dois sites no GitHub Pages.
2. Abra a página de gestão no computador administrativo.
3. Atualize a página duas vezes para substituir uma eventual cache antiga.
4. Crie ou restaure os registos locais.
5. Carregue em **Sincronizar consulta**.
6. Introduza o email e a password da conta administrativa.
7. Confirme a quantidade de equipamentos SIRESP.
8. Abra a página de consulta e introduza apenas a password da conta de consulta.

A autorização administrativa fica guardada apenas nesse navegador. Nas sincronizações seguintes, basta carregar no botão e confirmar. Se limpar os dados do navegador, usar navegação privada, mudar de navegador ou escolher **Terminar sessão Firebase**, será necessário autenticar novamente.

## 13. Utilização normal

1. Edite os equipamentos na gestão.
2. Os dados são guardados automaticamente no navegador.
3. Crie regularmente uma **Cópia de segurança** JSON e guarde-a num local seguro.
4. Carregue em **Sincronizar consulta** quando quiser publicar a versão atual.
5. Confirme o número de rádios SIRESP.

O JSON é integral e continua a incluir SIRESP, ROB, notas, avarias, históricos, inventário e configurações. O Firebase recebe apenas a listagem limitada de consulta.

## 14. Verificações de segurança

- Use passwords diferentes para administração e consulta.
- Não autorize a conta administrativa em computadores públicos ou partilhados.
- Use **Terminar sessão Firebase** antes de deixar de utilizar um computador administrativo.
- O PIN local protege operações na interface, mas não substitui a autenticação Firebase.
- Nunca altere as regras para `allow read, write: if true`.
- Teste nas Rules o acesso sem autenticação, a leitura com o UID de consulta e a escrita com ambos os UID.

## 15. Resolução de problemas

- **Firebase por configurar:** ainda existem valores `SUBSTITUIR_` no ficheiro de configuração.
- **Email ou password incorretos:** confirme que está a usar a conta administrativa na gestão.
- **Sem autorização para sincronizar:** confirme o `ADMIN_UID` nas regras e volte a publicá-las.
- **Consulta sem autorização:** confirme o `VIEWER_UID`, o email de consulta e as regras publicadas.
- **Domínio não autorizado:** adicione `SEU_UTILIZADOR.github.io` em Authentication → Settings → Authorized domains.
- **Versão antiga da página:** atualize duas vezes ou limpe os dados/cache desse site.
- **Sem Internet:** a gestão local e o backup continuam disponíveis; a última publicação válida no Firestore não é alterada.
