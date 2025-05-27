
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsTriggerWithBadge } from "@/components/ui/tabs";
import { ChevronLeft, Plus, Edit, User, BookOpen, Gift, MessageSquare, FileText, Save } from "lucide-react";
import { STUDENTS as studentsData } from "@/data/students.js";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentId = parseInt(id || "0");
  
  const student = studentsData.find(s => s.id === studentId);
  
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto py-6 p-6">
          <Button variant="outline" onClick={() => navigate("/admin/gestao-alunos")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold">Aluno não encontrado</h2>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveChange = () => {
    toast.success("Alterações salvas com sucesso!");
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Alunos', href: '/admin/gestao-alunos' },
    { label: student.name }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-6 px-4 space-y-6">
        
        {/* Breadcrumb */}
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin/gestao-alunos"
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                    <p className="text-gray-600">{student.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${student.status === "Ativo" ? "bg-green-500" : "bg-red-500"}`}>
                        {student.status}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600">
                        ID: {student.id}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleSaveChange} className="hover:bg-blue-50">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Mentoria
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{student.courses?.length || 0}</div>
                  <div className="text-sm text-gray-600">Cursos</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{student.mentorships?.length || 0}</div>
                  <div className="text-sm text-gray-600">Mentorias</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{student.bonuses?.length || 0}</div>
                  <div className="text-sm text-gray-600">Bônus</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{student.communications?.length || 0}</div>
                  <div className="text-sm text-gray-600">Mensagens</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      
        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
              <CardTitle className="text-lg">Informações Detalhadas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full justify-start p-0 bg-gray-50 rounded-none border-b h-auto">
                  <TabsTrigger value="info" className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-6 py-3">
                    <User className="h-4 w-4 mr-2" />
                    Dados Pessoais
                  </TabsTrigger>
                  <TabsTriggerWithBadge 
                    value="courses" 
                    badgeContent={student.courses?.length || 0}
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-6 py-3"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Cursos
                  </TabsTriggerWithBadge>
                  <TabsTriggerWithBadge 
                    value="mentorships" 
                    badgeContent={student.mentorships?.length || 0}
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-6 py-3"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mentorias
                  </TabsTriggerWithBadge>
                  <TabsTriggerWithBadge 
                    value="bonuses" 
                    badgeContent={student.bonuses?.length || 0}
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-6 py-3"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Bônus
                  </TabsTriggerWithBadge>
                  <TabsTriggerWithBadge 
                    value="communications" 
                    badgeContent={student.communications?.length || 0}
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-6 py-3"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comunicações
                  </TabsTriggerWithBadge>
                </TabsList>
                
                {/* Personal Data Tab */}
                <TabsContent value="info" className="p-6">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {[
                      { label: "Nome", value: student.name },
                      { label: "Email", value: student.email },
                      { label: "Telefone", value: student.phone || "Não informado" },
                      { label: "Empresa", value: student.company || "Não informado" },
                      { label: "Estado", value: student.studentState || "Não informado" },
                      { label: "Cadastro", value: student.registrationDate },
                      { label: "Último Login", value: student.lastLogin },
                      { label: "Usa FBA", value: student.usesFBA || "Não" },
                    ].map((field, index) => (
                      <motion.div
                        key={field.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="border border-gray-200 hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4">
                            <h4 className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{field.label}</h4>
                            <p className="text-sm font-medium text-gray-900">{field.value}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {student.amazonStoreLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="mt-4"
                    >
                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Link da Loja Amazon</h4>
                          <a href={student.amazonStoreLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {student.amazonStoreLink}
                          </a>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <div className="flex justify-end mt-6">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" /> Editar Dados
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Courses Tab */}
                <TabsContent value="courses" className="p-6 animate-fade-in">
                  <motion.div 
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {student.courses && student.courses.length > 0 ? (
                      student.courses.map((course, index) => (
                        <motion.div 
                          key={index}
                          className="p-4 border rounded-md hover:shadow-md transition-all bg-gradient-to-r from-blue-50 to-indigo-50"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{course}</h3>
                              <p className="text-sm text-gray-600">Adquirido em: 01/01/2023</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        Nenhum curso adquirido.
                      </p>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Curso
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Mentorships Tab */}
                <TabsContent value="mentorships" className="p-6 animate-fade-in">
                  <motion.div 
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {student.mentorships && student.mentorships.length > 0 ? (
                      student.mentorships.map((mentorship, index) => (
                        <motion.div 
                          key={index}
                          className="p-4 border rounded-md hover:shadow-md transition-all bg-gradient-to-r from-purple-50 to-pink-50"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{mentorship}</h3>
                              <p className="text-sm text-gray-600">Status: Em andamento</p>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                                <span className="text-xs text-gray-600">7/10 sessões</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        Nenhuma mentoria adquirida.
                      </p>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Mentoria
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Bonuses Tab */}
                <TabsContent value="bonuses" className="p-6 animate-fade-in">
                  <motion.div 
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {student.bonuses && student.bonuses.length > 0 ? (
                      student.bonuses.map((bonus, index) => (
                        <motion.div 
                          key={index}
                          className="p-4 border rounded-md hover:shadow-md transition-all bg-gradient-to-r from-amber-50 to-yellow-50"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{bonus}</h3>
                              <p className="text-sm text-gray-600">Adicionado em: 15/03/2023</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        Nenhum bônus disponível.
                      </p>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 transition-all">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Bônus
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Communications Tab */}
                <TabsContent value="communications" className="p-6 animate-fade-in">
                  <motion.div 
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {student.communications && student.communications.length > 0 ? (
                      student.communications.map((communication, index) => (
                        <motion.div 
                          key={index}
                          className="p-4 border rounded-md hover:shadow-md transition-all bg-gradient-to-r from-green-50 to-teal-50"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{communication.title || "Comunicação"}</h3>
                              <p className="text-sm text-gray-600">Data: {communication.date || "N/A"}</p>
                              <p className="mt-2">{communication.content || "Sem conteúdo"}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        Nenhuma comunicação registrada.
                      </p>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Comunicação
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
};

export default StudentDetail;
