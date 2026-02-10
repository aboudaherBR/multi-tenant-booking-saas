# Sistema de Agendamentos Web para Pequenos Negócios

Aplicação web full-stack, mobile-first, desenvolvida para organizar agendamentos
em pequenos negócios locais, com foco em simplicidade, clareza operacional e baixo
custo de manutenção.

O projeto foi pensado para resolver um problema real de negócios, sem overengineering,
utilizando uma arquitetura enxuta e decisões técnicas conscientes.

---

## Contexto e Problema de Negócio

Pequenos negócios locais costumam controlar seus agendamentos por meio de papel,
planilhas simples ou mensagens via WhatsApp. Esse modelo informal frequentemente
gera conflitos de horário, retrabalho, erros de comunicação e dependência excessiva
de uma única pessoa para gerenciar a agenda.

Além disso, a falta de uma visão clara da agenda da semana dificulta o planejamento
operacional, aumenta o estresse da equipe e impacta negativamente a experiência
do cliente final.

---

## Objetivo do Sistema

O objetivo deste sistema é fornecer uma forma simples e centralizada de organizar
agendamentos, reduzindo conflitos de horário e o tempo gasto com controles manuais.

A proposta não é substituir sistemas complexos de gestão, mas atender de forma
eficiente às necessidades básicas de pequenos negócios, priorizando facilidade
de uso, clareza e manutenção simples.

---

## Princípios de Projeto

Este projeto foi desenvolvido seguindo alguns princípios claros:

- simplicidade como requisito técnico
- escopo bem definido e controlado
- foco em resolver o problema real do negócio
- baixo custo de manutenção
- facilidade de entendimento e evolução

As decisões técnicas refletem cenários reais de pequenos negócios, onde soluções
excessivamente complexas tendem a gerar mais custo operacional do que benefício.

---

## Público-Alvo

Pequenos negócios locais que trabalham com atendimentos agendados, como:

- clínicas
- estúdios de estética
- academias de pequeno porte
- oficinas
- escolas de bairro

Normalmente são equipes pequenas, com baixo volume de dados e pouca tolerância a
sistemas complexos ou difíceis de operar.

---

## Escopo Funcional

### Funcionalidades do Sistema

- autenticação simples para usuários internos
- visualização da agenda semanal
- criação, edição e cancelamento de agendamentos
- bloqueio automático de conflitos de horário
- diferenciação de acesso entre administrador e profissional
- link público simples para agendamento por clientes, sem necessidade de cadastro

### Fora do Escopo (intencionalmente)

- controle financeiro
- relatórios gerenciais
- pagamentos
- notificações automáticas
- integrações externas
- autenticação ou cadastro de clientes

Esses itens foram deliberadamente excluídos do escopo atual para manter o sistema
simples, claro e alinhado ao problema proposto.

---

## Stack Tecnológica e Justificativas

### Backend
- Node.js
- Express

### Banco de Dados
- SQLite

### Frontend
- HTML
- CSS
- JavaScript puro

---

## Arquitetura e Organização

O projeto segue uma arquitetura simples, com separação clara de responsabilidades:

- `src/` contém todo o backend
- `public/` contém o frontend estático
- separação entre configuração da aplicação (`app.js`) e inicialização do servidor (`server.js`)

---

## Domínio de Agendamentos

### Entidade: Agendamento

Um **agendamento** representa a reserva de um intervalo de tempo específico
na agenda de um profissional, para atendimento de um cliente em determinada data e horário.

Todo agendamento possui:
- data
- horário inicial
- duração definida (30, 45 ou 60 minutos)
- profissional associado

Um agendamento ocupa um intervalo contínuo de tempo e **não pode se sobrepor**
a outro agendamento do mesmo profissional.

---

### Regras de Conflito de Horário

Para que um agendamento seja considerado válido, o intervalo de tempo ocupado
não pode entrar em conflito com nenhum outro agendamento existente
do mesmo profissional na mesma data.

O sistema deve impedir a criação ou edição de um agendamento sempre que ocorrer
qualquer uma das situações abaixo:

- o horário inicial do novo agendamento estiver dentro do intervalo de outro agendamento existente
- o horário final do novo agendamento ultrapassar o início de outro agendamento existente
- o intervalo do novo agendamento envolver completamente um agendamento já existente

A verificação de conflitos é sempre realizada considerando obrigatoriamente:
- data
- horário inicial
- duração
- profissional

---

### Papéis e Responsabilidades

O sistema trabalha com dois papéis internos distintos, cada um com responsabilidades
bem definidas sobre a gestão da agenda.

#### Administrador / Recepção

Responsável pela organização e controle da agenda do negócio. Possui as seguintes permissões:

- visualizar a agenda completa de todos os profissionais
- criar, editar e cancelar agendamentos
- gerenciar conflitos de horário
- atuar como ponto central de organização da agenda

#### Profissional

Responsável apenas pelo acompanhamento de sua própria agenda. Possui as seguintes permissões:

- visualizar exclusivamente seus próprios agendamentos
- acompanhar horários, datas e compromissos já definidos

O profissional não possui permissão para criar, editar ou cancelar agendamentos,
garantindo controle centralizado da agenda e reduzindo riscos operacionais.

---

### Organização das Regras de Negócio

As regras de negócio relacionadas a agendamentos são centralizadas em um único
service de aplicação, responsável por garantir que o fluxo de criação de um
agendamento seja sempre validado de forma consistente.

O service expõe apenas uma função pública responsável pela criação do agendamento,
enquanto as regras internas (validação de conflitos, cálculo de horário final e
verificações de consistência) são implementadas como funções auxiliares internas.

Essa abordagem reduz o risco de uso incorreto das regras de negócio, mantém o
fluxo controlado e facilita a evolução futura do sistema sem acoplamento excessivo.

---

### Service de Agendamentos — Contrato da Função Pública

O service de agendamentos expõe **uma única função pública**, responsável por garantir
a criação de agendamentos válidos de acordo com as regras do domínio.

#### Função Pública: `createAppointment`

**Responsabilidade**  
Criar um agendamento válido, garantindo que todas as regras de negócio relacionadas
a datas, horários, duração e conflitos sejam respeitadas.

**Entrada (dados necessários)**  
A função recebe as informações mínimas que definem um agendamento:

- data do agendamento
- horário inicial
- duração (30, 45 ou 60 minutos)
- profissional associado
- lista de agendamentos existentes do profissional na mesma data

**Processamento Interno**  
Durante a execução, a função:

- valida a duração informada
- calcula automaticamente o horário final do agendamento
- verifica conflitos de horário com agendamentos existentes
- garante que o novo agendamento não viole regras do domínio

Essas validações são realizadas por funções auxiliares internas (helpers),
não expostas externamente.

**Saída (resultado)**  
- Em caso de sucesso, a função retorna um agendamento válido, contendo
  todos os dados consistentes, incluindo o horário final calculado.
- Em caso de violação de regra de negócio, a função lança uma exceção de domínio,
  interrompendo o fluxo e impedindo a criação do agendamento.

**Tratamento de Erros**  
Exceções lançadas por esta função representam **exclusivamente violações explícitas
do domínio**, como conflitos de horário ou dados inválidos.  
Exceções não são utilizadas para controle de fluxo nem para erros técnicos.

---

## Execução Local

### Pré-requisitos
- Node.js instalado

### Passos para execução

```bash
npm install
node src/server.js
