
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Clock,
  Filter,
  Star,
  Eye
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MentoringSession {
  id: string;
  title: string;
  mentor: string;
  students: number;
  duration: string;
  date: string;
  status: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada";
  rating?: number;
  category: string;
}

const mockMentoringSessions: MentoringSession[] = [
  {
    id: "1",
    title: "Estratégias de E-commerce",
    mentor: "João Silva",
    students: 12,
    duration: "2h",
    date: "2024-01-15",
    status: "Agendada",
    category: "E-commerce"
  },
  {
    id: "2",
    title: "Marketing Digital Avançado",
    mentor: "Maria Santos",
    students: 8,
    duration: "1h30m",
    date: "2024-01-12",
    status: "Concluída",
    rating: 4.8,
    category: "Marketing"
  },
  {
    id: "3",
    title: "Gestão de Fornecedores",
    mentor: "Pedro Costa",
    students: 15,
    duration: "2h30m",
    date: "2024-01-10",
    status: "Concluída",
    rating: 4.6,
    category: "Gestão"
  }
];

const AdminMentoringCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Todas");

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Mentorias', href: '/admin/mentorias' },
    { label: 'Catálogo de Mentorias' }
  ];

  const filteredSessions = mockMentoringSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mentor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Todas" || session.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Em Andamento":
        return "bg-green-100 text-green-700 border-green-200";
      case "Concluída":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelada":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-6"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Mentorias</h1>
          <p className="text-gray-600 mt-1">
            Gerencie o catálogo de mentorias disponíveis na plataforma
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Mentoria
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Mentorias</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alunos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horas de Mentoria</p>
                  <p className="text-2xl font-bold text-gray-900">48h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-gray-900">4.7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Mentorias</span>
            <Badge variant="secondary" className="text-xs">
              {filteredSessions.length} de {mockMentoringSessions.length} mentorias
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar mentorias ou mentores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["Todas", "Agendada", "Em Andamento", "Concluída", "Cancelada"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Mentoria</TableHead>
                    <TableHead className="font-semibold text-gray-900">Mentor</TableHead>
                    <TableHead className="font-semibold text-gray-900">Alunos</TableHead>
                    <TableHead className="font-semibold text-gray-900">Data</TableHead>
                    <TableHead className="font-semibold text-gray-900">Duração</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Avaliação</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{session.title}</span>
                          <Badge variant="outline" className="w-fit text-xs mt-1">
                            {session.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                            {session.mentor.charAt(0)}
                          </div>
                          <span className="text-gray-900">{session.mentor}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{session.students}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">
                          {new Date(session.date).toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{session.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {session.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{session.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50 text-blue-600"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringCatalog;
