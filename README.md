# automation-Playwright

Projeto de automação de testes com [Playwright](https://playwright.dev/), cobrindo:

- **Mark L** – aplicação web de gerenciamento de tarefas (smoke test + CRUD via UI e API)
- **WhatsApp Web** – agente que entra em videochamadas
- **Microsoft Teams** – agente que entra em reuniões como convidado

---

## Pré-requisitos / Prerequisites

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 18+ |
| Yarn | 1.x |
| Chromium (instalado pelo Playwright) | — |

---

## Instalação / Installation

```bash
# 1. Instalar dependências do projeto
yarn install

# 2. Instalar os navegadores do Playwright
npx playwright install chromium
```

---

## Estrutura do projeto / Project structure

```
automation-Playwright/
├── playwright.config.ts          # Configuração global do Playwright
├── package.json
├── tests/
│   ├── home.spec.ts              # Smoke test – webapp deve estar online
│   ├── tasks.spec.ts             # Testes de CRUD de tarefas (Mark L)
│   ├── meetings.spec.ts          # Agente de reuniões (WhatsApp + Teams)
│   ├── Fixtures/
│   │   ├── task.model.ts         # Interface TaskModel
│   │   ├── tasks.json            # Dados de teste para tarefas
│   │   ├── meeting.model.ts      # Interface MeetingModel
│   │   └── meetings.json         # ⚙️  Configuração das reuniões (edite aqui)
│   └── support/
│       ├── helpers.ts            # Funções de apoio para API
│       └── pages/
│           ├── tasks/             # Page Object – Mark L
│           ├── whatsapp/         # Page Object – WhatsApp Web
│           └── teams/            # Page Object – Microsoft Teams
```

---

## Como executar os testes / How to run the tests

### 1. Testes da aplicação Mark L

> **Requisito:** a aplicação Mark L precisa estar rodando localmente.
> - Frontend: `http://localhost:8080`
> - Backend: `http://localhost:3333`

```bash
# Smoke test (verifica se o webapp está online)
npx playwright test tests/home.spec.ts --headed

# Todos os testes de tarefas
npx playwright test tests/tasks.spec.ts --headed
```

---

### 2. Agente do WhatsApp Web

> **Requisito:** ter uma conta WhatsApp ativa para escanear o QR Code na primeira execução.

**Passo 1** – Configure o contato ou grupo em `tests/Fixtures/meetings.json`:

```json
{
    "whatsapp": {
        "contactOrGroup": "Nome do Contato ou Grupo"
    }
}
```

**Passo 2** – Execute o teste:

```bash
npx playwright test tests/meetings.spec.ts --headed -g "/WhatsApp/i"
```

Na primeira execução, o navegador abrirá o WhatsApp Web e esperará **60 segundos** para você escanear o QR Code com o celular. Nas execuções seguintes a sessão já estará ativa.

---

### 3. Agente do Microsoft Teams

> **Requisito:** ter o link de convite de uma reunião do Teams.

**Passo 1** – Configure o link e o nome em `tests/Fixtures/meetings.json`:

```json
{
    "teams": {
        "meetingUrl": "https://teams.microsoft.com/l/meetup-join/SEU_LINK_AQUI",
        "displayName": "Seu Nome"
    }
}
```

**Passo 2** – Execute o teste:

```bash
npx playwright test tests/meetings.spec.ts --headed -g "/Teams/i"
```

O agente irá:
1. Abrir o link da reunião no navegador
2. Fechar o pop-up "Abrir no aplicativo" (se aparecer)
3. Preencher o nome de exibição
4. Clicar em **Entrar agora / Join now**

---

### 4. Todos os testes de reuniões (WhatsApp + Teams)

```bash
npx playwright test tests/meetings.spec.ts --headed
```

---

## Executar todos os testes / Run all tests

```bash
npx playwright test --headed
```

---

## Ver relatório HTML / View HTML report

Após qualquer execução, o Playwright gera um relatório interativo:

```bash
npx playwright show-report
```

---

## Variáveis de ambiente / Environment variables

Nenhuma variável de ambiente é obrigatória por padrão. Se quiser externalizar URLs ou credenciais, descomente o bloco `dotenv` em `playwright.config.ts` e crie um arquivo `.env` na raiz do projeto:

```
BASE_URL=http://localhost:8080
API_URL=http://localhost:3333
```

---

## Scripts úteis / Useful scripts

```bash
# Listar todos os testes disponíveis sem executar
npx playwright test --list

# Executar um arquivo específico
npx playwright test tests/tasks.spec.ts

# Executar um teste pelo nome
npx playwright test -g "deve poder cadastrar uma nova tarefa"

# Executar em modo headless (sem abrir o navegador)
npx playwright test --headed=false
```
