
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CreditCard, Building2, Users, Bot, GraduationCap, Wrench } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal do Aluno</h1>
        <p className="text-gray-600">Bem-vindo à sua área de aprendizado</p>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/aluno/creditos">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Meus Créditos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gerencie seus créditos e faça compras</p>
              <div className="text-2xl font-bold text-blue-600">150 créditos</div>
              <p className="text-sm text-gray-500">Disponíveis</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/aluno/fornecedores">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Fornecedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Explore nossa base de fornecedores</p>
              <div className="text-2xl font-bold text-green-600">500+</div>
              <p className="text-sm text-gray-500">Fornecedores cadastrados</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/aluno/livi-ai">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Livi AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Converse com nossa assistente inteligente</p>
              <Button className="w-full">Iniciar Conversa</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/aluno/mentoria">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Mentoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Acesse suas sessões de mentoria</p>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <p className="text-sm text-gray-500">Sessões agendadas</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/aluno/parceiros">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parceiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Conheça nossos parceiros</p>
              <div className="text-2xl font-bold text-orange-600">50+</div>
              <p className="text-sm text-gray-500">Parceiros ativos</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/aluno/ferramentas">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Ferramentas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Acesse ferramentas úteis</p>
              <div className="text-2xl font-bold text-indigo-600">25+</div>
              <p className="text-sm text-gray-500">Ferramentas disponíveis</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Seção de Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Compra de créditos</p>
                <p className="text-sm text-gray-500">100 créditos adicionados</p>
              </div>
              <span className="text-sm text-gray-400">Há 2 horas</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Sessão de mentoria</p>
                <p className="text-sm text-gray-500">Mentoria em Marketing Digital</p>
              </div>
              <span className="text-sm text-gray-400">Ontem</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Novo fornecedor adicionado</p>
                <p className="text-sm text-gray-500">Fornecedor ABC Ltda</p>
              </div>
              <span className="text-sm text-gray-400">Há 3 dias</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
