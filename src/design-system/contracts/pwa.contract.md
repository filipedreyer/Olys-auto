# PWA Contract

## Papel

PWA é possibilidade de instalação e retomada rápida. Não é promessa de sincronização offline completa.

## Obrigatório

- Instalação depende do browser.
- Prompt de instalação não bloqueia o app.
- Usuário pode dispensar.
- Offline é modo degradado.
- Manifest deve ser coerente com identidade Olys.

## Proibido

- Prometer instalação universal.
- Prometer que tudo sincroniza offline.
- Tracking ou analytics.
- Service worker novo sem necessidade.

## Critérios De Aceite

- `beforeinstallprompt` é tratado quando disponível.
- Fallback honesto existe quando o browser não expõe instalação.
- Manifest não quebra build.
