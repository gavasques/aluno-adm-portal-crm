
import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  PenSquare, 
  Save, 
  FileUp, 
  MessageSquare,
  X
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Interfaces
interface IBonus {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  observacoes: string;
  tempoAcesso: string;
  dataCriacao: string;
  comentarios: IComentario[];
  arquivos: IArquivo[];
}

interface IComentario {
  id: string;
  texto: string;
  autor: string;
  data: string;
}

interface IArquivo {
  id: string;
  nome: string;
  descricao: string;
  tamanho: string;
  tipo: string;
  data: string;
}

const tiposBonus = [
  "Software",
  "Sistema",
  "IA",
  "Ebook",
  "Lista",
  "Outros"
];

const temposAcesso = [
  "7 dias",
  "15 dias",
  "30 dias",
  "2 Meses",
  "3 Meses", 
  "6 Meses",
  "1 Ano",
  "Vitalício"
];

// Exemplo de dados iniciais
const dadosIniciais: IBonus[] = [
  {
    id: "1",
    nome: "Ebook: Estratégias de Marketing",
    tipo: "Ebook",
    descricao: "Guia completo de estratégias de marketing para e-commerce",
    observacoes: "Disponibilizado em PDF e EPUB",
    tempoAcesso: "30 dias",
    dataCriacao: "2025-05-10",
    comentarios: [
      {
        id: "c1",
        texto: "Material muito útil para iniciantes",
        autor: "Admin",
        data: "2025-05-12"
      }
    ],
    arquivos: [
      {
        id: "a1",
        nome: "marketing_ebook.pdf",
        descricao: "Versão em PDF do ebook",
        tamanho: "2.5 MB",
        tipo: "application/pdf",
        data: "2025-05-10"
      }
    ]
  },
  {
    id: "2",
    nome: "Ferramenta de Análise de Concorrentes",
    tipo: "Software",
    descricao: "Software para análise detalhada de concorrentes em seu segmento",
    observacoes: "Requer licença para uso após período de teste",
    tempoAcesso: "15 dias",
    dataCriacao: "2025-05-08",
    comentarios: [],
    arquivos: []
  }
];

const Bonus = () => {
  const [bonusList, setBonusList] = useState<IBonus[]>(dadosIniciais);
  const [bonusSelecionado, setBonusSelecionado] = useState<IBonus | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [novoBonus, setNovoBonus] = useState<Partial<IBonus>>({
    nome: "",
    tipo: "",
    descricao: "",
    observacoes: "",
    tempoAcesso: ""
  });
  const [editando, setEditando] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [novoArquivo, setNovoArquivo] = useState<Partial<IArquivo>>({
    nome: "",
    descricao: ""
  });
  const [tabAtiva, setTabAtiva] = useState("dados");

  // Selecionar um bônus da lista
  const selecionarBonus = (bonus: IBonus) => {
    setBonusSelecionado(bonus);
    setTabAtiva("dados");
  };

  // Adicionar novo bônus
  const adicionarBonus = () => {
    if (!novoBonus.nome || !novoBonus.tipo || !novoBonus.descricao || !novoBonus.tempoAcesso) {
      toast({
        title: "Erro ao adicionar bônus",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const novoId = Date.now().toString();
    const dataAtual = new Date().toISOString().split('T')[0];
    
    const bonus: IBonus = {
      id: novoId,
      nome: novoBonus.nome || "",
      tipo: novoBonus.tipo || "",
      descricao: novoBonus.descricao || "",
      observacoes: novoBonus.observacoes || "",
      tempoAcesso: novoBonus.tempoAcesso || "",
      dataCriacao: dataAtual,
      comentarios: [],
      arquivos: []
    };

    setBonusList([...bonusList, bonus]);
    setNovoBonus({
      nome: "",
      tipo: "",
      descricao: "",
      observacoes: "",
      tempoAcesso: ""
    });
    setDialogAberto(false);
    
    toast({
      title: "Bônus adicionado",
      description: "O bônus foi adicionado com sucesso"
    });
  };

  // Excluir um bônus
  const excluirBonus = (id: string) => {
    const novaLista = bonusList.filter(bonus => bonus.id !== id);
    setBonusList(novaLista);
    
    if (bonusSelecionado && bonusSelecionado.id === id) {
      setBonusSelecionado(null);
    }
    
    toast({
      title: "Bônus excluído",
      description: "O bônus foi excluído com sucesso"
    });
  };

  // Atualizar um bônus
  const atualizarBonus = () => {
    if (!bonusSelecionado) return;
    
    const novaLista = bonusList.map(bonus => 
      bonus.id === bonusSelecionado.id ? bonusSelecionado : bonus
    );
    
    setBonusList(novaLista);
    setEditando(false);
    
    toast({
      title: "Bônus atualizado",
      description: "As informações foram atualizadas com sucesso"
    });
  };

  // Adicionar comentário
  const adicionarComentario = () => {
    if (!bonusSelecionado || !novoComentario.trim()) return;
    
    const novoId = Date.now().toString();
    const dataAtual = new Date().toISOString().split('T')[0];
    
    const comentario: IComentario = {
      id: novoId,
      texto: novoComentario,
      autor: "Admin",
      data: dataAtual
    };
    
    const bonusAtualizado = {
      ...bonusSelecionado,
      comentarios: [...bonusSelecionado.comentarios, comentario]
    };
    
    setBonusSelecionado(bonusAtualizado);
    
    const novaLista = bonusList.map(bonus => 
      bonus.id === bonusSelecionado.id ? bonusAtualizado : bonus
    );
    
    setBonusList(novaLista);
    setNovoComentario("");
    
    toast({
      title: "Comentário adicionado",
      description: "O comentário foi adicionado com sucesso"
    });
  };

  // Excluir comentário
  const excluirComentario = (id: string) => {
    if (!bonusSelecionado) return;
    
    const comentariosFiltrados = bonusSelecionado.comentarios.filter(
      comentario => comentario.id !== id
    );
    
    const bonusAtualizado = {
      ...bonusSelecionado,
      comentarios: comentariosFiltrados
    };
    
    setBonusSelecionado(bonusAtualizado);
    
    const novaLista = bonusList.map(bonus => 
      bonus.id === bonusSelecionado.id ? bonusAtualizado : bonus
    );
    
    setBonusList(novaLista);
    
    toast({
      title: "Comentário excluído",
      description: "O comentário foi excluído com sucesso"
    });
  };

  // Adicionar arquivo
  const adicionarArquivo = () => {
    if (!bonusSelecionado || !novoArquivo.nome || !novoArquivo.descricao) return;
    
    const novoId = Date.now().toString();
    const dataAtual = new Date().toISOString().split('T')[0];
    
    const arquivo: IArquivo = {
      id: novoId,
      nome: novoArquivo.nome || "",
      descricao: novoArquivo.descricao || "",
      tamanho: "0 KB", // Simulado
      tipo: "arquivo",
      data: dataAtual
    };
    
    const bonusAtualizado = {
      ...bonusSelecionado,
      arquivos: [...bonusSelecionado.arquivos, arquivo]
    };
    
    setBonusSelecionado(bonusAtualizado);
    
    const novaLista = bonusList.map(bonus => 
      bonus.id === bonusSelecionado.id ? bonusAtualizado : bonus
    );
    
    setBonusList(novaLista);
    setNovoArquivo({
      nome: "",
      descricao: ""
    });
    
    toast({
      title: "Arquivo adicionado",
      description: "O arquivo foi adicionado com sucesso"
    });
  };

  // Excluir arquivo
  const excluirArquivo = (id: string) => {
    if (!bonusSelecionado) return;
    
    const arquivosFiltrados = bonusSelecionado.arquivos.filter(
      arquivo => arquivo.id !== id
    );
    
    const bonusAtualizado = {
      ...bonusSelecionado,
      arquivos: arquivosFiltrados
    };
    
    setBonusSelecionado(bonusAtualizado);
    
    const novaLista = bonusList.map(bonus => 
      bonus.id === bonusSelecionado.id ? bonusAtualizado : bonus
    );
    
    setBonusList(novaLista);
    
    toast({
      title: "Arquivo excluído",
      description: "O arquivo foi excluído com sucesso"
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Cadastro de Bônus</h1>
        <Button onClick={() => setDialogAberto(true)} className="flex items-center gap-1">
          <Plus size={18} />
          Adicionar Bônus
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-180px)] overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lista de Bônus</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-70px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonusList.map((bonus) => (
                    <TableRow key={bonus.id} className={bonusSelecionado?.id === bonus.id ? "bg-muted" : ""}>
                      <TableCell 
                        className="font-medium cursor-pointer hover:text-portal-primary"
                        onClick={() => selecionarBonus(bonus)}
                      >
                        {bonus.nome}
                      </TableCell>
                      <TableCell>{bonus.tipo}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => excluirBonus(bonus.id)}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bonusList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        Nenhum bônus cadastrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {bonusSelecionado ? (
            <Card className="h-[calc(100vh-180px)] overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{bonusSelecionado.nome}</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-70px)] overflow-hidden">
                <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="h-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="dados">Dados</TabsTrigger>
                    <TabsTrigger value="comentarios">Comentários</TabsTrigger>
                    <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dados" className="h-[calc(100%-50px)] overflow-auto">
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        {!editando ? (
                          <Button onClick={() => setEditando(true)} variant="outline" size="sm">
                            <PenSquare size={16} className="mr-2" />
                            Editar
                          </Button>
                        ) : (
                          <Button onClick={atualizarBonus} variant="outline" size="sm">
                            <Save size={16} className="mr-2" />
                            Salvar
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            id="nome"
                            value={bonusSelecionado.nome}
                            onChange={(e) => editando && setBonusSelecionado({...bonusSelecionado, nome: e.target.value})}
                            disabled={!editando}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tipo">Tipo</Label>
                          {editando ? (
                            <Select 
                              value={bonusSelecionado.tipo}
                              onValueChange={(value) => setBonusSelecionado({...bonusSelecionado, tipo: value})}
                            >
                              <SelectTrigger id="tipo">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {tiposBonus.map(tipo => (
                                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input id="tipo" value={bonusSelecionado.tipo} disabled />
                          )}
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="descricao">Descrição</Label>
                          <Textarea
                            id="descricao"
                            value={bonusSelecionado.descricao}
                            onChange={(e) => editando && setBonusSelecionado({...bonusSelecionado, descricao: e.target.value})}
                            disabled={!editando}
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tempoAcesso">Tempo de Acesso</Label>
                          {editando ? (
                            <Select 
                              value={bonusSelecionado.tempoAcesso}
                              onValueChange={(value) => setBonusSelecionado({...bonusSelecionado, tempoAcesso: value})}
                            >
                              <SelectTrigger id="tempoAcesso">
                                <SelectValue placeholder="Selecione o tempo" />
                              </SelectTrigger>
                              <SelectContent>
                                {temposAcesso.map(tempo => (
                                  <SelectItem key={tempo} value={tempo}>{tempo}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input id="tempoAcesso" value={bonusSelecionado.tempoAcesso} disabled />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dataCriacao">Data de Criação</Label>
                          <Input id="dataCriacao" value={bonusSelecionado.dataCriacao} disabled />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="observacoes">Observações</Label>
                          <Textarea
                            id="observacoes"
                            value={bonusSelecionado.observacoes}
                            onChange={(e) => editando && setBonusSelecionado({...bonusSelecionado, observacoes: e.target.value})}
                            disabled={!editando}
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comentarios" className="h-[calc(100%-50px)] overflow-auto">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Adicione um comentário..." 
                          value={novoComentario}
                          onChange={(e) => setNovoComentario(e.target.value)}
                          rows={2}
                          className="flex-1"
                        />
                        <Button onClick={adicionarComentario} className="self-end">
                          <MessageSquare size={18} className="mr-2" />
                          Comentar
                        </Button>
                      </div>
                      
                      <div className="space-y-4 mt-6">
                        {bonusSelecionado.comentarios.length === 0 ? (
                          <p className="text-center text-muted-foreground py-10">
                            Não há comentários para este bônus.
                          </p>
                        ) : (
                          bonusSelecionado.comentarios.map((comentario) => (
                            <Card key={comentario.id} className="relative">
                              <CardContent className="py-4">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="font-medium">{comentario.autor}</div>
                                  <div className="text-sm text-muted-foreground">{comentario.data}</div>
                                </div>
                                <p>{comentario.texto}</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-2 right-2"
                                  onClick={() => excluirComentario(comentario.id)}
                                >
                                  <X size={14} />
                                </Button>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="arquivos" className="h-[calc(100%-50px)] overflow-auto">
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nomeArquivo">Nome do Arquivo</Label>
                              <Input 
                                id="nomeArquivo"
                                placeholder="Digite o nome do arquivo" 
                                value={novoArquivo.nome}
                                onChange={(e) => setNovoArquivo({...novoArquivo, nome: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="descricaoArquivo">Descrição do Arquivo</Label>
                              <Input 
                                id="descricaoArquivo"
                                placeholder="Digite a descrição do arquivo" 
                                value={novoArquivo.descricao}
                                onChange={(e) => setNovoArquivo({...novoArquivo, descricao: e.target.value})}
                              />
                            </div>
                          </div>
                          <Button onClick={adicionarArquivo} className="mt-4">
                            <FileUp size={18} className="mr-2" />
                            Adicionar Arquivo
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-2">
                        {bonusSelecionado.arquivos.length === 0 ? (
                          <p className="text-center text-muted-foreground py-10">
                            Não há arquivos para este bônus.
                          </p>
                        ) : (
                          bonusSelecionado.arquivos.map((arquivo) => (
                            <Card key={arquivo.id}>
                              <CardContent className="py-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{arquivo.nome}</div>
                                    <div className="text-sm text-muted-foreground">{arquivo.descricao}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {arquivo.tamanho} • {arquivo.data}
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => excluirArquivo(arquivo.id)}
                                  >
                                    <Trash2 size={16} className="text-destructive" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="h-[calc(100vh-180px)] flex items-center justify-center">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-medium mb-2">Nenhum bônus selecionado</h3>
                <p className="text-muted-foreground mb-4">
                  Selecione um bônus da lista ou crie um novo para visualizar os detalhes.
                </p>
                <Button onClick={() => setDialogAberto(true)}>
                  <Plus size={18} className="mr-2" />
                  Adicionar Bônus
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Dialog para adicionar novo bônus */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Bônus</DialogTitle>
            <DialogDescription>
              Preencha as informações para cadastrar um novo bônus no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome-bonus">Nome</Label>
              <Input 
                id="nome-bonus" 
                placeholder="Digite o nome do bônus"
                value={novoBonus.nome}
                onChange={(e) => setNovoBonus({...novoBonus, nome: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tipo-bonus">Tipo</Label>
              <Select 
                value={novoBonus.tipo}
                onValueChange={(value) => setNovoBonus({...novoBonus, tipo: value})}
              >
                <SelectTrigger id="tipo-bonus">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposBonus.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="descricao-bonus">Descrição</Label>
              <Textarea 
                id="descricao-bonus" 
                placeholder="Digite uma descrição para o bônus"
                value={novoBonus.descricao}
                onChange={(e) => setNovoBonus({...novoBonus, descricao: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tempo-acesso">Tempo de Acesso</Label>
              <Select 
                value={novoBonus.tempoAcesso}
                onValueChange={(value) => setNovoBonus({...novoBonus, tempoAcesso: value})}
              >
                <SelectTrigger id="tempo-acesso">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  {temposAcesso.map(tempo => (
                    <SelectItem key={tempo} value={tempo}>{tempo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="observacoes-bonus">Observações (opcional)</Label>
              <Textarea 
                id="observacoes-bonus" 
                placeholder="Adicione observações se necessário"
                value={novoBonus.observacoes}
                onChange={(e) => setNovoBonus({...novoBonus, observacoes: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={adicionarBonus}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bonus;
