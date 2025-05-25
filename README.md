
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/615752d4-0ad0-4fbd-9977-45d5385af67b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/615752d4-0ad0-4fbd-9977-45d5385af67b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Testing

### Permission Services Testing Suite

Este projeto inclui uma suíte completa de testes para o sistema de permissões:

#### Testes Unitários
- **PermissionGroupService.test.ts**: Testa operações CRUD de grupos de permissão
- **SystemMenuService.test.ts**: Testa gerenciamento de menus do sistema
- **SystemModuleService.test.ts**: Testa módulos e ações do sistema
- **PermissionValidationService.test.ts**: Testa validações de permissão
- **usePermissionServices.test.ts**: Testa o hook de serviços

#### Testes de Integração
- **PermissionWorkflows.integration.test.ts**: Testa fluxos completos de permissão
- **SecurityValidation.integration.test.ts**: Testa validações de segurança
- **DataFlow.integration.test.ts**: Testa consistência de dados entre serviços

### Running Tests

```sh
# Executar todos os testes
npm run test

# Executar apenas testes unitários
npm run test src/services/permissions/__tests__/*.test.ts

# Executar apenas testes de integração
npm run test src/services/permissions/__tests__/integration/

# Executar testes com coverage
npm run test -- --coverage

# Executar testes em modo watch
npm run test -- --watch
```

### Test Structure

Os testes estão organizados seguindo as melhores práticas:

- **Unit Tests**: Testam componentes individuais isoladamente
- **Integration Tests**: Testam interações entre múltiplos serviços
- **Mocking**: Uso extensivo de mocks do Supabase para testes determinísticos
- **Coverage**: Cobertura completa dos cenários de sucesso e erro
- **Security**: Testes específicos para validações de segurança

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/615752d4-0ad0-4fbd-9977-45d5385af67b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

