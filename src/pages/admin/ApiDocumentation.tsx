
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, ExternalLink, Code, FileText, Globe, Key, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';

const ApiDocumentation: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('overview');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Código copiado para a área de transferência!');
  };

  const sections = [
    { id: 'overview', title: 'Visão Geral', icon: Globe },
    { id: 'authentication', title: 'Autenticação', icon: Key },
    { id: 'leads', title: 'CRM - Leads', icon: FileText },
    { id: 'comments', title: 'CRM - Comentários', icon: Code },
    { id: 'contacts', title: 'CRM - Contatos', icon: Settings },
    { id: 'webhooks', title: 'Webhooks', icon: Zap },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Documentação da API
        </h1>
        <p className="text-gray-600">
          Documentação completa da API do sistema CRM. Aqui você encontra todos os endpoints, 
          exemplos de uso e informações de integração.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navegação</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        selectedSection === section.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                          : 'text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {selectedSection === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Visão Geral da API
                  </CardTitle>
                  <CardDescription>
                    Introdução e informações gerais sobre a API do sistema CRM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">URL Base</h3>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                      <span>https://seu-projeto.supabase.co/functions/v1/</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard('https://seu-projeto.supabase.co/functions/v1/')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Rate Limiting</h3>
                    <p className="text-gray-600 mb-2">
                      A API possui limitação de taxa para garantir a estabilidade:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>1000 requisições por hora por usuário autenticado</li>
                      <li>100 requisições por hora por IP (não autenticado)</li>
                      <li>Headers de limite retornados em cada resposta</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Formato de Resposta</h3>
                    <p className="text-gray-600 mb-2">
                      Todas as respostas são em formato JSON:
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso",
  "timestamp": "2024-01-15T10:30:00Z"
}`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSection === 'authentication' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Autenticação
                  </CardTitle>
                  <CardDescription>
                    Como autenticar suas requisições à API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Token JWT</h3>
                    <p className="text-gray-600 mb-3">
                      Use o token JWT obtido no login para autenticar suas requisições:
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Exemplo de Requisição</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`curl -X GET \\
  https://seu-projeto.supabase.co/functions/v1/crm-leads-api \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Códigos de Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">200</Badge>
                        <span className="text-sm">Sucesso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">401</Badge>
                        <span className="text-sm">Não autorizado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700">403</Badge>
                        <span className="text-sm">Acesso negado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700">429</Badge>
                        <span className="text-sm">Limite de taxa excedido</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSection === 'leads' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    CRM - Leads
                  </CardTitle>
                  <CardDescription>
                    Endpoints para gerenciar leads no CRM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* GET /leads */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm font-mono">/crm-leads-api</code>
                    </div>
                    <p className="text-gray-600 mb-3">Lista todos os leads com filtros opcionais.</p>
                    
                    <h4 className="font-semibold mb-2">Parâmetros de Query:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-4">
                      <li><code>pipeline_id</code> - ID do pipeline</li>
                      <li><code>column_id</code> - ID da coluna/estágio</li>
                      <li><code>responsible_id</code> - ID do responsável</li>
                      <li><code>search</code> - Busca por nome ou email</li>
                    </ul>

                    <h4 className="font-semibold mb-2">Exemplo de Requisição:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      <pre>{`curl -X GET \\
  "https://seu-projeto.supabase.co/functions/v1/crm-leads-api?pipeline_id=123" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}</pre>
                    </div>

                    <h4 className="font-semibold mb-2">Exemplo de Resposta:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "(11) 99999-9999",
      "status": "aberto",
      "pipeline_id": "uuid",
      "column_id": "uuid",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}`}</pre>
                    </div>
                  </div>

                  <Separator />

                  {/* POST /leads */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">POST</Badge>
                      <code className="text-sm font-mono">/crm-leads-api</code>
                    </div>
                    <p className="text-gray-600 mb-3">Cria um novo lead.</p>
                    
                    <h4 className="font-semibold mb-2">Body da Requisição:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      <pre>{`{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "pipeline_id": "uuid",
  "column_id": "uuid",
  "responsible_id": "uuid",
  "notes": "Lead qualificado"
}`}</pre>
                    </div>

                    <h4 className="font-semibold mb-2">Exemplo de Resposta:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "success": true,
  "data": {
    "id": "uuid-do-lead-criado",
    "name": "João Silva",
    "email": "joao@email.com",
    "status": "aberto",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Lead criado com sucesso"
}`}</pre>
                    </div>
                  </div>

                  <Separator />

                  {/* PATCH /leads/{id}/move */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">PATCH</Badge>
                      <code className="text-sm font-mono">/crm-leads-api/{'{id}'}/move</code>
                    </div>
                    <p className="text-gray-600 mb-3">Move um lead para outro estágio do pipeline.</p>
                    
                    <h4 className="font-semibold mb-2">Body da Requisição:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "column_id": "uuid-da-nova-coluna"
}`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSection === 'comments' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    CRM - Comentários
                  </CardTitle>
                  <CardDescription>
                    Endpoints para gerenciar comentários dos leads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* GET /comments */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm font-mono">/crm-comments-api/{'{lead_id}'}</code>
                    </div>
                    <p className="text-gray-600 mb-3">Lista todos os comentários de um lead.</p>
                    
                    <h4 className="font-semibold mb-2">Exemplo de Resposta:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content": "Cliente interessado em produto premium",
      "user_id": "uuid",
      "user": {
        "name": "Ana Santos",
        "email": "ana@empresa.com"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}`}</pre>
                    </div>
                  </div>

                  <Separator />

                  {/* POST /comments */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">POST</Badge>
                      <code className="text-sm font-mono">/crm-comments-api</code>
                    </div>
                    <p className="text-gray-600 mb-3">Adiciona um novo comentário a um lead.</p>
                    
                    <h4 className="font-semibold mb-2">Body da Requisição:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "lead_id": "uuid-do-lead",
  "content": "Cliente demonstrou interesse em agendar reunião"
}`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSection === 'contacts' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    CRM - Contatos
                  </CardTitle>
                  <CardDescription>
                    Endpoints para agendar e gerenciar contatos com leads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* POST /contacts */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">POST</Badge>
                      <code className="text-sm font-mono">/crm-contacts-api</code>
                    </div>
                    <p className="text-gray-600 mb-3">Agenda um novo contato com um lead.</p>
                    
                    <h4 className="font-semibold mb-2">Body da Requisição:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      <pre>{`{
  "lead_id": "uuid-do-lead",
  "contact_type": "call",
  "contact_reason": "Apresentação do produto",
  "contact_date": "2024-01-20T14:00:00Z",
  "responsible_id": "uuid-do-responsavel",
  "notes": "Cliente solicitou demonstração"
}`}</pre>
                    </div>

                    <h4 className="font-semibold mb-2">Tipos de Contato:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li><code>call</code> - Ligação telefônica</li>
                      <li><code>email</code> - Email</li>
                      <li><code>whatsapp</code> - WhatsApp</li>
                      <li><code>meeting</code> - Reunião presencial/online</li>
                    </ul>
                  </div>

                  <Separator />

                  {/* GET /contacts */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm font-mono">/crm-contacts-api</code>
                    </div>
                    <p className="text-gray-600 mb-3">Lista contatos agendados com filtros.</p>
                    
                    <h4 className="font-semibold mb-2">Parâmetros de Query:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li><code>status</code> - pending, completed, overdue</li>
                      <li><code>responsible_id</code> - ID do responsável</li>
                      <li><code>date_from</code> - Data inicial (YYYY-MM-DD)</li>
                      <li><code>date_to</code> - Data final (YYYY-MM-DD)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSection === 'webhooks' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Receba leads automaticamente de formulários externos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">URL do Webhook</h3>
                    <p className="text-gray-600 mb-3">
                      Configure seus formulários externos para enviar dados para:
                    </p>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                      <span>https://seu-projeto.supabase.co/functions/v1/crm-webhooks-api</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard('https://seu-projeto.supabase.co/functions/v1/crm-webhooks-api')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Formato dos Dados</h3>
                    <p className="text-gray-600 mb-3">
                      Envie os dados do lead no seguinte formato:
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "pipeline_id": "uuid-do-pipeline",
  "source": "site-landing-page",
  "utm_source": "google",
  "utm_campaign": "campanha-janeiro"
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Autenticação do Webhook</h3>
                    <p className="text-gray-600 mb-3">
                      Inclua o token de webhook no header da requisição:
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`X-Webhook-Token: seu-token-de-webhook`}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Resposta do Webhook</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`{
  "success": true,
  "lead_id": "uuid-do-lead-criado",
  "message": "Lead recebido e processado com sucesso"
}`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
