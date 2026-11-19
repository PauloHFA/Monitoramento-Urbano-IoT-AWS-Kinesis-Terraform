# 📋 Pendências e Próximos Passos — Monitoramento-Urbano-IoT-AWS-Kinesis-Terraform (SmartCity Pulse)

> Rastreabilidade técnica do monorepo **SmartCity Pulse** (API Fastify + Kinesis Consumer + Serviço de Alertas + Lambdas Python + Infraestrutura Terraform AWS).

---

## ✅ 1. O que já está Concluído e Validado

- **Segurança & Runtime AWS SDK (`apps/api/src/aws.ts`, `apps/telemetria-consumer/src/index.ts`, `apps/alertas-service/src/index.ts`):**
  - Credenciais mock (`test`/`test`) agora são aplicadas **apenas** quando `AWS_ENDPOINT_URL` está configurado (LocalStack) ou quando `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` são explícitos, preservando a cadeia padrão de IAM Task Role no ECS Fargate.
- **Infraestrutura Terraform (`infra/`):**
  - Formatação padronizada (`terraform fmt`) em todos os módulos e ambiente `dev`.
  - Corrigido `buffering_size` / `buffering_interval` no Firehose (`infra/modules/analytics/main.tf`) e `local.services` no CloudWatch (`infra/modules/observability/main.tf`); `terraform init -backend=false && terraform validate` validados com sucesso.
- **Qualidade, Tipagem, Testes & Lockfile:**
  - `package-lock.json` gerado para habilitar `npm ci` e cache no GitHub Actions.
  - Scripts `lint` (`tsc --noEmit`), `build` e `test` (`vitest run`) configurados nos workspaces.
  - Suíte Vitest cobrindo detector EWMA + schemas Zod (`@smartcity/shared`) e endpoints `/health` & `/ready` (`@smartcity/api`).
  - Código Python das Lambdas e simulador limpo no `ruff check`.
- **Esteira CI/CD (`.github/workflows/`):**
  - `deploy-services.yml`: executa `npm ci`, `npm run lint`, `npm run build`, `npm test` e `ruff check`; o job de deploy ECS fica condicionado a `vars.AWS_DEPLOY_ENABLED == 'true'`.
  - `terraform.yml`: executa `terraform fmt -check`, `terraform init -backend=false` e `terraform validate` em push/PR; `terraform plan` fica condicionado a PR + `vars.AWS_TERRAFORM_ENABLED == 'true'`.

---

## 🚀 2. Melhorias Futuras (Backlog de Engenharia)
- [ ] **Autenticação JWT Cognito & RBAC (`apps/api` — ADR-009):** Implementar middleware de verificação JWT do Amazon Cognito, proteção por perfil (`cidadao`, `operador`, `gestor`, `admin`) nas rotas de escrita/administração (`/usuarios`, `/regras`, `/relatorios`) e restrição explícita de origens no `@fastify/cors`.
- [ ] **Testes Unitários & de Integração nos Consumidores:** Adicionar cobertura Vitest para `apps/telemetria-consumer` e `apps/alertas-service` (idempotência DynamoDB, deduplicação PostgreSQL) e testes `pytest` com `moto` para as duas Lambdas Python.
- [ ] **Atualização de Segurança de Dependências Node:** Atualizar versões antigas transitivas (`glob`, `rimraf`) e avaliar migração para Fastify v5.

---

## 🛠️ 3. Dependências Externas (Provisionamento AWS & CI/CD Deploy)
- [ ] **Conta AWS, IAM OIDC Role & GitHub Variables/Secrets:** Configurar `secrets.AWS_ROLE_TO_ASSUME` no repositório e habilitar `vars.AWS_DEPLOY_ENABLED = true` e `vars.AWS_TERRAFORM_ENABLED = true` após criar os repositórios ECR, backend remoto Terraform (S3 + DynamoDB) e cluster ECS Fargate.
- [ ] **Amazon Cognito User Pool & Secrets Manager:** Provisionar User Pool/App Client e parâmetros RDS/Observabilidade para ambiente de homologação/produção.
