
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  BookOpen, 
  UserCheck,
  Users2,
  TrendingUp,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';

const AdminMentoringManagement = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Mentorias' }
  ];

  const managementCards = [
    {
      title: 'Catálogo de Mentorias',
      description: 'Gerencie os tipos de mentoria disponíveis, preços e configurações',
      icon: BookOpen,
      href: '/admin/mentorias/catalogo',
      color: 'from-blue-500 to-blue-600',
      stats: { label: '12 Mentorias', value: 'Ativas' }
    },
    {
      title: 'Inscrições Individuais',
      description: 'Gerencie inscrições de alunos em mentorias individuais',
      icon: UserCheck,
      href: '/admin/inscricoes-individuais',
      color: 'from-green-500 to-green-600',
      stats: { label: '45 Inscrições', value: 'Individuais' }
    },
    {
      title: 'Inscrições em Grupo',
      description: 'Gerencie turmas e grupos de mentoria coletiva',
      icon: Users2,
      href: '/admin/inscricoes-grupo',
      color: 'from-purple-500 to-purple-600',
      stats: { label: '8 Grupos', value: 'Ativos' }
    },
    {
      title: 'Sessões de Mentoria',
      description: 'Agende e gerencie todas as sessões de mentoria',
      icon: Calendar,
      href: '/admin/mentorias/sessoes',
      color: 'from-orange-500 to-orange-600',
      stats: { label: '24 Sessões', value: 'Esta Semana' }
    },
    {
      title: 'Materiais e Recursos',
      description: 'Gerencie arquivos, materiais e recursos das mentorias',
      icon: FileText,
      href: '/admin/mentorias/materiais',
      color: 'from-indigo-500 to-indigo-600',
      stats: { label: '156 Arquivos', value: 'Disponíveis' }
    }
  ];

  const quickStats = [
    { icon: TrendingUp, label: 'Taxa de Conclusão', value: '87%', color: 'text-green-600' },
    { icon: Clock, label: 'Horas de Mentoria', value: '342h', color: 'text-blue-600' },
    { icon: Award, label: 'Mentores Ativos', value: '18', color: 'text-purple-600' },
    { icon: BarChart3, label: 'Satisfação Média', value: '4.8/5', color: 'text-orange-600' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-4"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestão de Mentorias</h1>
            <p className="text-indigo-100">
              Centro de controle para todas as atividades de mentoria
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementCards.map((card, index) => (
          <Link key={index} to={card.href} className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-gray-100">
                    {card.stats.label}
                  </Badge>
                  <span className="text-sm font-medium text-gray-600">
                    {card.stats.value}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                >
                  Acessar Gestão
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Visão Geral do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">65</div>
              <div className="text-sm text-gray-600">Alunos Ativos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-gray-600">Taxa de Presença</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4.7</div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringManagement;
