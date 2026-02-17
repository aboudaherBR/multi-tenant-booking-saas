# Sistema de Agendamentos Web para Pequenos Negócios

Aplicação backend desenvolvida para organizar agendamentos
em pequenos negócios locais, com foco em simplicidade,
clareza operacional e decisões técnicas proporcionais ao contexto.

O projeto foi pensado para resolver um problema real de negócio,
sem overengineering, utilizando uma arquitetura enxuta e
regras de domínio explícitas.

---

## Contexto e Problema de Negócio

Pequenos negócios locais frequentemente controlam seus agendamentos
por meio de papel, planilhas simples ou mensagens via WhatsApp.

Esse modelo informal costuma gerar:

- conflitos de horário
- retrabalho
- erros humanos
- dependência excessiva de uma única pessoa
- falta de previsibilidade operacional

O sistema proposto resolve especificamente o problema
de organização de horários e bloqueio automático de conflitos.

---

## Objetivo do Sistema

Fornecer uma API REST simples e confiável para:

- criar agendamentos
- listar agendamentos por profissional e data
- editar agendamentos
- remover agendamentos
- impedir conflitos de horário
- aplicar regras reais de negócio (janela mínima de antecedência)

O foco é clareza, previsibilidade e manutenção simples.

---

## Princípios de Projeto

O projeto foi desenvolvido seguindo princípios técnicos claros:

- simplicidade como requisito técnico
- separação clara de responsabilidades
- regras de domínio centralizadas
- decisões proporcionais ao escopo
- ausência de abstrações desnecessárias
- ausência de frameworks ou ORMs complexos

A complexidade foi adicionada apenas quando justificável
por regra de negócio real.

---

## Stack Tecnológica

### Backend
- Node.js
- Express

### Banco de Dados
- SQLite (arquivo local)

### Justificativas

**SQLite**
- baixo volume de dados esperado
- zero configuração externa
- ideal para pequenos negócios
- persistência simples e suficiente

**Sem ORM**
- controle explícito sobre queries
- menor complexidade
- projeto didático e transparente

---

## Arquitetura do Backend

O backend segue uma separação clara de responsabilidades:

- routes → define endpoints HTTP
- controllers → traduz HTTP para o domínio
- services → contém regras de negócio
- repository → acesso ao banco de dados
- database → conexão SQLite e inicialização
- middlewares → tratamento centralizado de erros

O service não conhece Express.
O repository não conhece regras de negócio.
O controller não contém validação de domínio.

Essa separação reduz acoplamento e facilita manutenção.

---

## Estrutura de Pastas

```
src/
  app.js
  server.js
  routes/
    appointments.routes.js
  controllers/
    appointments.controller.js
  services/
    appointments.service.js
  database/
    db.js
    appointments.repository.js
  middlewares/
    error.middleware.js
```

---

## Entidade de Domínio: Appointment

Um agendamento representa:

- date (YYYY-MM-DD)
- startTime (HH:mm)
- duration (30, 45 ou 60 minutos)
- professionalId

O horário final é calculado automaticamente
com base no horário inicial e duração.

---

## Regras de Negócio Implementadas

### 1) Conflito de Horário

Um agendamento não pode se sobrepor
a outro agendamento do mesmo profissional
na mesma data.

Regra formal aplicada:

```
!(newEnd <= existingStart || newStart >= existingEnd)
```

Essa validação é aplicada:

- na criação (POST)
- na edição (PUT), ignorando o próprio id

---

### 2) Janela Mínima de Antecedência (4 Horas)

Alterações e exclusões só são permitidas
com no mínimo 4 horas de antecedência
em relação ao horário do agendamento.

Essa regra:

- é aplicada no service
- não pode ser burlada pelo cliente
- retorna status 403 (Forbidden)

---

### 3) Validações Aplicadas

- campos obrigatórios
- formato de data (YYYY-MM-DD)
- formato de horário (HH:mm)
- validação básica de faixa de horário (00–23 / 00–59)
- duração permitida: 30, 45 ou 60
- conflito de horário
- existência do agendamento para PUT e DELETE

---

## Endpoints REST

### POST /appointments

Cria um agendamento.

Valida:
- formato
- duração
- conflito

Retornos:
- 201 → criado com sucesso
- 400 → erro de validação ou conflito

---

### GET /appointments?professionalId=&date=

Lista agendamentos por profissional e data.

Retornos:
- 200 → lista (pode ser vazia)
- 400 → parâmetros obrigatórios ausentes

---

### PUT /appointments/:id

Atualiza completamente um agendamento.

Regras:
- 404 → não encontrado
- 403 → dentro da janela mínima de 4 horas
- 400 → dados inválidos ou conflito
- recalcula automaticamente endTime
- ignora o próprio id na verificação de conflito

Retorno:
- 200 → objeto atualizado

---

### DELETE /appointments/:id

Remove permanentemente um agendamento.

Regras:
- 404 → não encontrado
- 403 → dentro da janela mínima de 4 horas

Retorno:
- 204 → removido com sucesso

---

## Decisões Técnicas Conscientes

- DELETE físico (sem soft delete)
  - sistema simples
  - sem exigência de auditoria
  - sem compliance regulatório

- Sem validação de calendário real (ex: 2024-99-99)
  - projeto didático
  - front-end controlado
  - evitar complexidade desnecessária

- Sem autenticação (escopo atual)
  - foco exclusivo em regras de agendamento

- Sem ORM
  - clareza didática
  - controle explícito de persistência

---

## Tratamento de Erros

Erros de domínio retornam status apropriados:

- 400 → erro de validação ou conflito
- 403 → violação de regra de antecedência
- 404 → recurso não encontrado
- 500 → erro inesperado

Middleware centralizado é responsável por mapear
error.status para resposta HTTP.

---

## Execução Local

### Pré-requisitos
- Node.js instalado

### Instalação

```bash
npm install
```

### Execução

```bash
node src/server.js
```

Servidor será iniciado na porta 3000.

---

## Possíveis Evoluções Futuras

- autenticação e autorização
- controle de múltiplos negócios
- índices no banco para maior volume
- paginação
- testes automatizados
- refatoração leve aplicando princípios SOLID
- dockerização

---

## Objetivo Técnico do Projeto

Este projeto foi desenvolvido com foco em:

- clareza arquitetural
- separação de responsabilidades
- implementação real de regras de negócio
- decisões proporcionais ao contexto
- código defensável em entrevista técnica

Ele demonstra como aplicar arquitetura limpa
de forma simples e prática, sem exageros.

---

## Como Executar o Projeto

### 1) Pré-requisitos

- Node.js instalado (versão 18+ recomendada)

Verifique se está instalado:

```bash
node -v
```

---

### 2) Instalar Dependências

Na raiz do projeto (onde está o package.json), execute:

```bash
npm install
```

---

### 3) Iniciar o Servidor

```bash
node src/server.js
```

Se tudo estiver correto, o terminal exibirá:

```
Servidor rodando na porta 3000
```

---

### 4) Testar a API

O servidor roda em:

```
http://localhost:3000
```

Você pode testar usando:

- Thunder Client
- Postman
- Insomnia
- curl

---

### Exemplo de Criação de Agendamento

POST

```
http://localhost:3000/appointments
```

Body:

```json
{
  "date": "2026-03-20",
  "startTime": "18:00",
  "duration": 60,
  "professionalId": "prof-1"
}
```

---

## Observações Importantes

- O banco de dados é um arquivo SQLite (`database.sqlite`)
- Ele é criado automaticamente na primeira execução
- Não é necessário configurar banco externo
- Não há autenticação nesta versão do projeto
