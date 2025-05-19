
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Users, Book, Calendar, Plus, MessageSquare, Package, Award } from "lucide-react";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Mock data
  const students = [
    { id: 1, name: "Ana Silva", email: "ana@email.com", phone: "(11) 98765-4321", status: "Ativo", products: ["Curso Básico", "Mentoria Individual"], bonus: ["Acesso Clube VIP", "E-book Marketing Digital"] },
    { id: 2, name: "Carlos Oliveira", email: "carlos@email.com", phone: "(11) 91234-5678", status: "Ativo", products: ["Curso Avançado"], bonus: [] },
    { id: 3, name: "Mariana Costa", email: "mariana@email.com", phone: "(11) 93333-4444", status: "Ativo", products: ["Mentoria em Grupo"], bonus: ["Workshop Presencial"] },
    { id: 4, name: "Pedro Santos", email: "pedro@email.com", phone: "(11) 95555-6666", status: "Inativo", products: ["Curso Básico", "Curso Avançado"], bonus: ["Acesso Clube VIP"] },
  ];
  
  // Mock mentoring data
  const mentoringSessions = [
    { id: 1, date: "25/05/2025", time: "14:00", link: "meet.google.com/abc-defg-hij", status: "Agendada", type: "Individual" },
    { id: 2, date: "28/05/2025", time: "10:00", link: "meet.google.com/xyz-abcd-efg", status: "Concluída", type: "Grupo" },
    { id: 3, date: "02/06/2025", time: "16:30", link: "meet.google.com/123-456-789", status: "Agendada", type: "Individual" },
  ];
  
  // Mock communications
  const communications = [
    { id: 1, date: "10/05/2025", channel: "Email", subject: "Boas-vindas", status: "Enviado" },
    { id: 2, date: "12/05/2025", channel: "WhatsApp", subject: "Dúvida sobre curso", status: "Respondido" },
  ];
  
  const handleOpenStudent = (student) => {
    setSelectedStudent(student);
  };
  
  const handleCloseStudent = () => {
    setSelectedStudent(null);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Gestão de Alunos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Formulário seria implementado aqui */}
              <p>Formulário para adicionar um novo aluno.</p>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Gerencie os alunos cadastrados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell>{student.products.join(", ")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenStudent(student)}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para detalhes do aluno */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={handleCloseStudent}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="mr-2" />
                {selectedStudent.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Dados do Aluno</TabsTrigger>
                  <TabsTrigger value="communications">Comunicações</TabsTrigger>
                  <TabsTrigger value="products">Cursos Adquiridos</TabsTrigger>
                  <TabsTrigger value="mentoring">Mentorias</TabsTrigger>
                  <TabsTrigger value="bonus">Bônus Adquiridos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
                          <p className="mt-1 text-base">{selectedStudent.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-base">{selectedStudent.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                          <p className="mt-1 text-base">{selectedStudent.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Status</h3>
                          <p className="mt-1 text-base">{selectedStudent.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="communications">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Histórico de Comunicações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Canal</TableHead>
                            <TableHead>Assunto</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {communications.map((comm) => (
                            <TableRow key={comm.id}>
                              <TableCell>{comm.date}</TableCell>
                              <TableCell>{comm.channel}</TableCell>
                              <TableCell>{comm.subject}</TableCell>
                              <TableCell>{comm.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Button variant="outline" className="mt-4">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Nova Comunicação
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Cursos Adquiridos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedStudent.products.map((product, index) => (
                          <div key={index} className="flex items-center p-3 border rounded-md">
                            <Package className="h-5 w-5 mr-3 text-portal-primary" />
                            <span>{product}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Curso
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mentoring">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Mentorias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Horário</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tipo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mentoringSessions.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>{session.date}</TableCell>
                              <TableCell>{session.time}</TableCell>
                              <TableCell>
                                <a href={`https://${session.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {session.link}
                                </a>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  session.status === "Agendada" ? "bg-blue-100 text-blue-800" : 
                                  session.status === "Concluída" ? "bg-green-100 text-green-800" : 
                                  "bg-amber-100 text-amber-800"
                                }`}>
                                  {session.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="flex items-center">
                                  {session.type === "Grupo" ? 
                                    <Users className="h-4 w-4 mr-1" /> : 
                                    <User className="h-4 w-4 mr-1" />
                                  }
                                  {session.type}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Agendar Mentoria
                        </Button>
                        <Button variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          Adicionar à Mentoria em Grupo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="bonus">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Bônus Adquiridos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedStudent.bonus && selectedStudent.bonus.length > 0 ? (
                        <div className="space-y-4">
                          {selectedStudent.bonus.map((bonusItem, index) => (
                            <div key={index} className="flex items-center p-3 border rounded-md">
                              <Award className="h-5 w-5 mr-3 text-amber-500" />
                              <span>{bonusItem}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Nenhum bônus adquirido.</p>
                      )}
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Bônus
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseStudent}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Students;
