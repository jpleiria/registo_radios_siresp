# Registo Rádios Comunicações SIRESP — CBSLeiria

Aplicação estática para inventário de equipamentos rádio SIRESP. Não requer instalação, servidor nem conta de utilizador.

Inclui painel de resumo, alertas de manutenção, histórico de avarias, etiquetas QR, conferência de inventário, proteção opcional por PIN, importação CSV/Excel e exportações configuráveis.

## Utilização local

Abra `index.html` num navegador moderno. Os registos ficam guardados apenas no navegador e no dispositivo onde foram criados. Utilize **Cópia de segurança** regularmente para descarregar um ficheiro JSON completo e guarde-o num local seguro.

## Restauro e exportações

- **Restaurar:** repõe todos os registos e históricos de uma cópia JSON; substitui os dados atuais.
- **Exportar CSV:** descarrega a listagem filtrada, adequada a Microsoft Excel.
- **Gerar PDF:** descarrega a listagem filtrada com o cabeçalho institucional.
- **Ficha PDF:** disponível na ficha individual de cada equipamento.
- **Importar CSV/Excel:** lê a primeira folha do ficheiro e ignora registos com Rádio Nº, ISSI ou S/N já existentes.

## Manutenção, QR e inventário

- As revisões vencidas ou previstas nos próximos 30 dias aparecem no painel inicial.
- A ficha do equipamento permite imprimir uma etiqueta QR. Quando a aplicação está publicada, o QR abre diretamente essa ficha.
- O modo Inventário permite marcar cada rádio como confirmado, em falta ou por verificar.
- O botão Proteção permite definir um PIN local para alterações, eliminações, importações, avarias e inventários.

## Cópias de segurança

O painel avisa quando ainda não existe uma cópia ou quando a última exportação JSON tem sete ou mais dias. O PIN e a data da última cópia são configurações locais e não substituem o ficheiro JSON.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie todos os ficheiros desta pasta.
2. Em **Settings → Pages**, escolha a ramificação `main` e a pasta `/ (root)`.
3. A aplicação ficará disponível no endereço indicado pelo GitHub.

Mesmo publicada online, cada navegador mantém os seus próprios dados. Para transferir dados entre computadores, exporte e importe a cópia JSON.
