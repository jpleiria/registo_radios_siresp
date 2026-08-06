# Guia GitHub — Gestão e consulta por JSON

## Endereços

- Gestão: <https://jpleiria.github.io/registo_radios_siresp/>
- Consulta: <https://jpleiria.github.io/radios_siresp_consulta/>
- JSON lido pela consulta: <https://raw.githubusercontent.com/jpleiria/radios_siresp_consulta/main/dados-siresp.json>

## Atualizar o repositório de gestão

Carregue para a raiz de `jpleiria/registo_radios_siresp` todo o conteúdo da pasta `PUBLICAR_GITHUB_GESTAO`.

Substitua os ficheiros com o mesmo nome e elimine estes ficheiros antigos do Firebase:

```text
firebase-config.js
firebase-sync.js
firestore.rules
GUIA_FIREBASE_GITHUB.md
```

Para eliminar no GitHub: abra o ficheiro, escolha o ícone do lixo ou o menu de eliminação e confirme o commit.

## Atualizar o repositório de consulta

Carregue para a raiz de `jpleiria/radios_siresp_consulta` todo o conteúdo da pasta `PUBLICAR_GITHUB_CONSULTA`.

Substitua os ficheiros com o mesmo nome e elimine o ficheiro antigo:

```text
firebase-config.js
```

O ficheiro `dados-siresp.json` inicial pode ficar vazio até ser feita a primeira exportação real.

## Primeira publicação do código

Em cada repositório:

1. Abra **Settings → Pages**.
2. Escolha **Deploy from a branch**.
3. Selecione `main` e `/ (root)`.
4. Guarde e aguarde pelo deployment.

Esta etapa depende do GitHub Pages. Depois de o código estar publicado, as atualizações normais de dados usam o GitHub Raw.

## Criar os dois ficheiros de segurança

Na página de gestão existem dois botões diferentes:

- **Cópia de segurança:** cria um ficheiro privado com SIRESP, ROB, notas, avarias, históricos e configurações. Não coloque este ficheiro no GitHub.
- **Exportar JSON consulta:** cria `dados-siresp.json` apenas com SIRESP e os nove campos visíveis na consulta.

Guarde regularmente o backup integral num local privado antes de criar a versão pública.

## Atualizar a listagem da consulta

1. Edite os equipamentos na gestão.
2. Carregue em **Cópia de segurança** e arquive o ficheiro privado.
3. Carregue em **Exportar JSON consulta**.
4. No repositório `jpleiria/radios_siresp_consulta`, escolha **Add file → Upload files**.
5. Carregue o novo `dados-siresp.json`; o GitHub substituirá o ficheiro com o mesmo nome.
6. Confirme o commit na branch `main`.
7. Abra ou atualize a página de consulta.

A consulta acrescenta um identificador temporal ao pedido e não usa a cache HTTP normal. Pode existir um pequeno atraso de propagação do GitHub Raw.

## Código de acesso

A consulta pede o código definido para a CBSLeiria. A autorização permanece apenas durante a sessão do navegador; atualizar a página mantém o acesso e fechar o navegador volta a bloquear.

O botão **Terminar sessão** bloqueia imediatamente a página.

## Limitação de segurança

Os repositórios são públicos. O código de acesso é uma barreira visual e não impede uma pessoa com conhecimentos técnicos de abrir diretamente o JSON Raw. Por isso, nunca publique o backup integral e nunca acrescente notas, avarias, históricos ou dados ROB a `dados-siresp.json`.

## Resolução de problemas

- **Dados indisponíveis:** confirme que `dados-siresp.json` está na raiz da branch `main` do repositório de consulta.
- **Aparece a versão anterior:** atualize a página; se a rede falhar, a consulta mostra a última cópia válida guardada no navegador.
- **JSON inválido:** volte a gerar o ficheiro na gestão; não o edite manualmente.
- **GitHub Pages indisponível:** aguarde a recuperação em <https://www.githubstatus.com/>. Os dados no GitHub Raw não necessitam de um novo build da página.
