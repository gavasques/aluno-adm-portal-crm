
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Check, Calendar, Clock, User, Trash2, Eye, Link as LinkIcon } from "lucide-react";

interface TaskRowProps {
  task: any;
  isCompleted: boolean;
  onToggleCompletion: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: any) => void;
  onViewDetails: (taskId: number) => void;
  onViewStudent: (studentId: number) => void;
}

export const TaskRow = ({
  task,
  isCompleted,
  onToggleCompletion,
  onDelete,
  onEdit,
  onViewDetails,
  onViewStudent
}: TaskRowProps) => {
  return (
    <TableRow key={task.id}>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => onToggleCompletion(task.id)}
        >
          <span className={`h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : ''}`}>
            {task.completed && <Check className="h-4 w-4 text-white" />}
          </span>
        </Button>
      </TableCell>
      <TableCell className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
        {task.title}
      </TableCell>
      {task.date !== "25/05/2025" && (
        <TableCell>
          <div className={`flex items-center ${isCompleted ? 'text-gray-500' : ''}`}>
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            {task.date}
          </div>
        </TableCell>
      )}
      <TableCell>
        <div className={`flex items-center ${isCompleted ? 'text-gray-500' : ''}`}>
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          {task.time}
        </div>
      </TableCell>
      <TableCell className={isCompleted ? 'text-gray-500' : ''}>
        {task.location}
      </TableCell>
      {!isCompleted && (
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs ${
            task.priority === "Alta" ? "bg-red-100 text-red-800" :
            task.priority === "Média" ? "bg-amber-100 text-amber-800" :
            "bg-green-100 text-green-800"
          }`}>
            {task.priority}
          </span>
        </TableCell>
      )}
      <TableCell>
        <div className={`flex items-center ${isCompleted ? 'text-gray-500' : ''}`}>
          <User className="h-4 w-4 mr-1 text-gray-400" />
          {task.assignedTo}
        </div>
      </TableCell>
      <TableCell>
        {task.relatedStudent ? (
          <Button 
            variant="link" 
            onClick={() => onViewStudent(task.relatedStudent.id)}
            className={`${isCompleted ? 'text-gray-500' : 'text-blue-600'}`}
          >
            {task.relatedStudent.name}
          </Button>
        ) : (
          <span className="text-gray-400">Nenhum</span>
        )}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          <LinkIcon className="h-4 w-4 mr-1" /> Vincular
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onViewDetails(task.id)}>
          <Eye className="h-4 w-4 mr-1" /> Ver
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
