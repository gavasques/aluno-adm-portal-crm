
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskRow } from "./TaskRow";

interface TaskTableProps {
  title: string;
  description: string;
  tasks: any[];
  isCompleted?: boolean;
  showDateColumn?: boolean;
  onToggleCompletion: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: any) => void;
  onViewDetails: (taskId: number) => void;
  onViewStudent: (studentId: number) => void;
}

export const TaskTable = ({
  title,
  description,
  tasks,
  isCompleted = false,
  showDateColumn = false,
  onToggleCompletion,
  onDelete,
  onEdit,
  onViewDetails,
  onViewStudent
}: TaskTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Título</TableHead>
                {showDateColumn && <TableHead>Data</TableHead>}
                <TableHead>Horário</TableHead>
                <TableHead>Local</TableHead>
                {!isCompleted && <TableHead>Prioridade</TableHead>}
                <TableHead>Responsável</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isCompleted={isCompleted}
                    onToggleCompletion={onToggleCompletion}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onViewDetails={onViewDetails}
                    onViewStudent={onViewStudent}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={showDateColumn ? 9 : 8} className="text-center py-4 text-gray-500">
                    {isCompleted ? "Nenhuma tarefa concluída." : 
                     title.includes("Hoje") ? "Nenhuma tarefa para hoje." : 
                     "Nenhuma tarefa futura."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
