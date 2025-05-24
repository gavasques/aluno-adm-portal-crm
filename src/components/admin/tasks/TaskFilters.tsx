
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFiltersProps {
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  responsibleFilter: string;
  setResponsibleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  studentFilter: string;
  setStudentFilter: (value: string) => void;
  adminUsers: Array<{ id: number; name: string }>;
  studentUsers: Array<{ id: number; name: string; role: string }>;
}

export const TaskFilters = ({
  priorityFilter,
  setPriorityFilter,
  responsibleFilter,
  setResponsibleFilter,
  statusFilter,
  setStatusFilter,
  studentFilter,
  setStudentFilter,
  adminUsers,
  studentUsers
}: TaskFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prioridade</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Responsável</label>
            <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os responsáveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {adminUsers.map(user => (
                  <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aluno</label>
            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os alunos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {studentUsers.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
