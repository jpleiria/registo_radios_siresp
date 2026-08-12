# Publicação direta da Consulta

Esta versão permite atualizar `dados-siresp.json` a partir da página de Gestão, sem descarregar nem carregar manualmente o ficheiro.

## Configuração em cada equipamento

1. No GitHub, abra **Settings > Developer settings > Personal access tokens > Fine-grained tokens**.
2. Crie um token novo, escolha uma data de expiração e limite-o ao repositório `jpleiria/radios_siresp_consulta`.
3. Em **Repository permissions**, atribua a `Contents` a permissão **Read and write**. Não são necessárias outras permissões.
4. Copie o token apresentado pelo GitHub. Ele só é mostrado uma vez.
5. Abra a Gestão, carregue em **Publicar na consulta**, cole o token e confirme a publicação.

O token fica guardado apenas no armazenamento local desse navegador. Não entra nos backups JSON, nem é enviado para outro local: só é utilizado para comunicar com a API do GitHub quando é feita uma publicação.

## Segurança

- Configure o token em cada computador autorizado a publicar.
- Não envie o token por email, WhatsApp ou em capturas de ecrã.
- Se um equipamento deixar de ser autorizado, remova o token no botão da aplicação e revogue-o no GitHub.
- O token permite alterar os ficheiros do repositório selecionado; mantenha o repositório de Consulta separado de outros projetos.
