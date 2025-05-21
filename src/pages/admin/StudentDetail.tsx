
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsTriggerWithBadge } from "@/components/ui/tabs";
import { ChevronLeft, Plus, Edit, User, BookOpen, Gift, MessageSquare, FileText } from "lucide-react";
import { STUDENTS as studentsData } from "@/data/students.js";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentId = parseInt(id || "0");
  
  console.info("Fetching student with ID:", id);
  console.info("Parsed student ID:", studentId, "Type:", typeof studentId);
  
  const student = studentsData.find(s => s.id === studentId);
  console.info("Found student:", student);
  
  if (!student) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => navigate("/admin/students")}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">Aluno não encontrado</h2>
        </div>
      </div>
    );
  }

  const handleSaveChange = () => {
    toast.success("Alterações salvas com sucesso!");
  };
  
  return (
    <motion.div 
      className="container mx-auto py-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/students")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-portal-dark">{student.name}</h1>
            <p className="text-gray-500">{student.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveChange}>
            Salvar Alterações
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Mentoria
          </Button>
        </div>
      </div>
      
      {/* Status Card */}
      <Card className="mb-6 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Status</span>
              <div className="flex items-center mt-1">
                <Badge className={`${student.status === "Ativo" ? "bg-green-500" : "bg-red-500"}`}>
                  {student.status}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Data de Cadastro</span>
              <span className="font-medium">{student.registrationDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Último Acesso</span>
              <span className="font-medium">{student.lastLogin}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Empresa</span>
              <span className="font-medium">{student.company || "Não informado"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for student details */}
      <Card className="mb-6 overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle>Informações do Aluno</CardTitle>
          <CardDescription className="text-blue-100">
            Gerencie os detalhes e recursos do aluno
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start p-0 bg-gray-100 rounded-none border-b">
              <TabsTrigger value="info" className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                <User className="h-4 w-4 mr-2" />
                Dados Pessoais
              </TabsTrigger>
              <TabsTriggerWithBadge 
                value="courses" 
                badgeCount={student.courses?.length || 0}
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Cursos
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="mentorships" 
                badgeCount={student.mentorships?.length || 0}
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
              >
                <User className="h-4 w-4 mr-2" />
                Mentorias
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="bonuses" 
                badgeCount={student.bonuses?.length || 0}
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
              >
                <Gift className="h-4 w-4 mr-2" />
                Bônus
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="communications" 
                badgeCount={student.communications?.length || 0}
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comunicações
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="files" 
                badgeCount={student.files?.length || 0}
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Arquivos
              </TabsTriggerWithBadge>
            </TabsList>
            
            {/* Personal Data Tab */}
            <TabsContent value="info" className="p-6 animate-fade-in">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Nome</h3>
                  <p className="text-base font-medium">{student.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p className="text-base font-medium">{student.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Telefone</h3>
                  <p className="text-base font-medium">{student.phone || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Empresa</h3>
                  <p className="text-base font-medium">{student.company || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Link da Loja Amazon</h3>
                  <p className="text-base font-medium">
                    {student.amazonStoreLink ? (
                      <a href={student.amazonStoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {student.amazonStoreLink}
                      </a>
                    ) : (
                      "Não informado"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
                  <p className="text-base font-medium">{student.studentState || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Estado da Empresa</h3>
                  <p className="text-base font-medium">{student.companyState || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Usa FBA</h3>
                  <p className="text-base font-medium">{student.usesFBA || "Não"}</p>
                </div>
                <div className="col-span-full">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Observações</h3>
                  <p className="text-base font-medium">{student.observations || "Sem observações"}</p>
                </div>
                <div className="col-span-full flex justify-end mt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Editar Dados
                  </Button>
                </div>
              </motion.div>
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
            
            {/* Files Tab */}
            <TabsContent value="files" className="p-6 animate-fade-in">
              <motion.div 
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {student.files && student.files.length > 0 ? (
                  student.files.map((file, index) => (
                    <motion.div 
                      key={index}
                      className="p-4 border rounded-md hover:shadow-md transition-all bg-gradient-to-r from-blue-50 to-cyan-50"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <h3 className="font-medium">{file.name || "Arquivo"}</h3>
                            <p className="text-sm text-gray-600">Adicionado em: {file.date || "N/A"}</p>
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="mr-2">
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    Nenhum arquivo disponível.
                  </p>
                )}
                <div className="flex justify-end mt-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Arquivo
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </motion.div>
  );
};

export default StudentDetail;
