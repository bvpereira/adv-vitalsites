# Vital Advogados

Landing page institucional de página única para `adv.vitalsites.com.br`.

## Comandos

- `npm run dev`: servidor local em `http://127.0.0.1:4173`.
- `npm run build`: gera a saída estática em `dist/` para a Vercel.

## Carregamento

O servidor local e a build incorporam `styles.css` ao HTML usando
`scripts/render-html.mjs`. Edite o CSS normalmente no arquivo original; não é
necessário manter estilos duplicados. Publique a pasta `dist/` gerada pela build.
As fontes variáveis Cormorant Garamond e Manrope são servidas localmente em
WOFF2, com o subconjunto Latin (incluindo os acentos em português), `font-display:
swap` e preload no HTML. Não há requisições ao Google Fonts nem dependência de
JavaScript para carregar as fontes. As licenças estão em `assets/fonts/`.

A build gera o preload responsivo do logo a partir do próprio `<img>`, mantendo
`imagesrcset`/`imagesizes` sincronizados com `srcset`/`sizes`. A imagem tem
`fetchpriority="high"` e `loading="eager"`. O conteúdo principal aparece sem
aguardar JavaScript ou animação de entrada.

O logo usa variantes WebP transparentes de 160, 320, 512, 560, 768 e 1024 px com
`srcset` e `sizes`. O PNG original permanece como fonte para futuras exportações,
mas não é solicitado pela página. As variantes foram redimensionadas com Lanczos
e exportadas com qualidade 85. Ao trocar o logo, gere novamente as variantes e
use novos nomes de arquivo, pois os assets têm cache imutável na Vercel.

Textos entre colchetes e blocos identificados como placeholders devem ser substituídos após o recebimento dos dados reais, fotografias, endereço, contatos, OAB e indicadores.

As três fotos da equipe usam variantes WebP de 160, 320, 480, 680 e 900 px,
selecionadas por `srcset`/`sizes`, com carregamento lento. O aviso de protótipo
abre pelo script deferido após o primeiro quadro renderizado, para reduzir o
trabalho síncrono de layout durante a leitura do HTML.

Para conferir a publicação: o HTML servido deve conter `data-site-styles`, o
preload do logo WebP e fontes em `assets/fonts/`. Se ainda contiver o logo PNG
ou `fonts.googleapis.com`, a versão otimizada não foi publicada.
