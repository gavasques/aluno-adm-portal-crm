
# Prisma Schema para Portal Educacional Guilherme Vasques

Este documento descreve o schema Prisma completo do Portal Educacional, mapeando todas as tabelas e relacionamentos do banco de dados Supabase.

## 🚀 Configuração Inicial

### 1. Instalação das Dependências

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Configuração do Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp prisma/.env.example .env
```

2. Configure a `DATABASE_URL` no arquivo `.env` com sua string de conexão do Supabase:
```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.qflmguzmticupqtnlirf.supabase.co:5432/postgres"
```

### 3. Geração do Cliente Prisma

```bash
npx prisma generate
```

### 4. Sincronização com o Banco (Opcional)

Para sincronizar o schema com o banco existente:
```bash
npx prisma db pull
```

Para aplicar migrações (use com cuidado em produção):
```bash
npx prisma db push
```

## 📊 Estrutura do Schema

### Módulos Principais

#### 🔐 **Autenticação e Usuários**
- `Profile` - Perfis de usuários
- `PermissionGroup` - Grupos de permissões
- `PermissionGroupMenu` - Permissões por menu
- `SystemMenu` - Menus do sistema

#### 📈 **CRM**
- `CrmLead` - Leads do CRM
- `CrmPipeline` - Pipelines de vendas
- `CrmPipelineColumn` - Colunas dos pipelines
- `CrmTag` - Tags do CRM
- `CrmNotification` - Notificações
- `CrmLeadComment` - Comentários dos leads
- `CrmLeadAttachment` - Anexos dos leads
- `CrmLeadContact` - Contatos dos leads
- `CrmLeadHistory` - Histórico dos leads

#### 🎓 **Sistema de Mentorias**
- `MentoringCatalog` - Catálogo de mentorias
- `MentoringEnrollment` - Inscrições em mentorias
- `MentoringSession` - Sessões de mentoria
- `MentoringMaterial` - Materiais de mentoria
- `MentoringExtension` - Extensões de mentoria

#### 💰 **Sistema de Créditos**
- `UserCredit` - Créditos dos usuários
- `CreditPackage` - Pacotes de créditos
- `CreditTransaction` - Transações de créditos
- `CreditSubscription` - Assinaturas de créditos
- `CreditSetting` - Configurações de créditos

#### 🏪 **Fornecedores**
- `MySupplier` - Fornecedores dos alunos
- `MySupplierBrand` - Marcas dos fornecedores
- `MySupplierBranch` - Filiais dos fornecedores
- `MySupplierContact` - Contatos dos fornecedores
- `MySupplierCommunication` - Comunicações
- `MySupplierRating` - Avaliações
- `MySupplierComment` - Comentários
- `Supplier` - Fornecedores gerais

#### 🤝 **Parceiros e Ferramentas**
- `Partner` - Parceiros
- `PartnerType` - Tipos de parceiros
- `Tool` - Ferramentas
- `SoftwareType` - Tipos de software

#### 🎁 **Sistema de Bônus**
- `Bonus` - Bônus
- `BonusComment` - Comentários dos bônus
- `BonusFile` - Arquivos dos bônus

#### ✅ **Tarefas e Notícias**
- `Task` - Tarefas
- `News` - Notícias

#### 📅 **Integração Calendly**
- `CalendlyConfig` - Configurações do Calendly
- `CalendlyEvent` - Eventos do Calendly

#### 🤖 **Livi AI**
- `LiviAiSession` - Sessões do chat
- `LiviAiMessage` - Mensagens do chat
- `LiviAiCredit` - Créditos da IA

#### 📺 **YouTube**
- `YoutubeVideo` - Vídeos do YouTube
- `YoutubeChannel` - Canais do YouTube

#### 🔍 **Auditoria e Segurança**
- `AuditLog` - Logs de auditoria
- `SecurityAlert` - Alertas de segurança

#### 📂 **Categorização**
- `Category` - Categorias gerais

## 🔄 Relacionamentos Principais

### Relacionamentos de Usuário (Profile)
- **Um para Muitos**: Profile → CrmLead, MentoringEnrollment, UserCredit, MySupplier, etc.
- **Muitos para Um**: Profile → PermissionGroup

### Relacionamentos CRM
- **Hierárquico**: CrmPipeline → CrmPipelineColumn → CrmLead
- **Comentários e Anexos**: CrmLead → CrmLeadComment, CrmLeadAttachment

### Relacionamentos Mentoria
- **Catálogo**: MentoringCatalog → MentoringEnrollment → MentoringSession
- **Usuários**: Profile (Student) ← MentoringEnrollment → MentoringCatalog
- **Sessões**: Profile (Mentor) ← MentoringSession → Profile (Student)

### Relacionamentos Fornecedores
- **Hierárquico**: MySupplier → MySupplierBrand, MySupplierBranch, MySupplierContact

## 💡 Uso do Prisma Client

### Exemplo de Consulta Básica

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Buscar usuário com permissões
const user = await prisma.profile.findUnique({
  where: { id: 'user-id' },
  include: {
    permissionGroup: {
      include: {
        menuPermissions: {
          include: {
            systemMenu: true
          }
        }
      }
    }
  }
})

// Buscar leads do CRM com relacionamentos
const leads = await prisma.crmLead.findMany({
  include: {
    pipeline: true,
    column: true,
    responsible: true,
    comments: {
      include: {
        user: true
      }
    }
  }
})

// Buscar mentorias de um aluno
const mentorings = await prisma.mentoringEnrollment.findMany({
  where: { student_id: 'student-id' },
  include: {
    mentoring: true,
    sessions: {
      include: {
        mentor: true
      }
    }
  }
})
```

### Exemplo de Mutação

```typescript
// Criar novo lead no CRM
const newLead = await prisma.crmLead.create({
  data: {
    name: 'João Silva',
    email: 'joao@exemplo.com',
    status: 'novo',
    pipeline_id: 'pipeline-id',
    column_id: 'column-id',
    responsible_id: 'user-id'
  }
})

// Atualizar créditos do usuário
const updatedCredits = await prisma.userCredit.update({
  where: { user_id: 'user-id' },
  data: { balance: { increment: 100 } }
})
```

## ⚠️ Considerações Importantes

### Segurança
- Este schema mapeia as tabelas do Supabase, que possui **Row Level Security (RLS)**
- As políticas RLS são aplicadas no nível do banco, não no Prisma
- Sempre valide permissões antes de operações sensíveis

### Performance
- Use `include` e `select` conscientemente para evitar over-fetching
- Considere usar `cursor`-based pagination para listas grandes
- Implemente índices adequados no banco para queries frequentes

### Sincronização
- Este schema deve estar sempre sincronizado com o banco Supabase
- Use `prisma db pull` para atualizar após mudanças no banco
- Teste mudanças em ambiente de desenvolvimento antes de aplicar em produção

## 📝 Scripts Úteis

Adicione estes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:pull": "prisma db pull",
    "db:push": "prisma db push",
    "db:reset": "prisma db push --force-reset"
  }
}
```

## 🤝 Contribuições

Para modificações no schema:
1. Faça as alterações no arquivo `schema.prisma`
2. Execute `npx prisma generate` para atualizar o cliente
3. Teste as mudanças
4. Documente as alterações neste README
