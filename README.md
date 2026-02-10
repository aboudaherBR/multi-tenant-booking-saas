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

Escolhidos pela simplicidade, ampla adoção no mercado e facilidade de manutenção,
permitindo a criação de uma API clara e objetiva.

### Banco de Dados
- SQLite

Utilizado por se tratar de um projeto com baixo volume de dados, permitindo persistência
em arquivo único, sem necessidade de infraestrutura adicional.

### Frontend
- HTML
- CSS
- JavaScript puro

A interface foi desenvolvida com foco em uso mobile, clareza e facilidade de manutenção,
evitando frameworks desnecessários para o escopo do projeto.

---

## Arquitetura e Organização

O projeto segue uma arquitetura simples, com separação clara de responsabilidades:

- `src/` contém todo o backend
  - rotas, controllers, services, middlewares e acesso a dados
- `public/` contém o frontend estático
- separação entre configuração da aplicação (`app.js`) e inicialização do servidor (`server.js`)

Essa organização facilita leitura, manutenção e evolução futura do sistema sem
refatorações complexas.

---

## Execução Local

### Pré-requisitos
- Node.js instalado

### Passos para execução

```bash
npm install
node src/server.js
