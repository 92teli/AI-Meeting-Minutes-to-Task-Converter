
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, User, Trash2, Clock, Star, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/Task";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "P1": 
        return {
          color: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-200",
          icon: AlertTriangle,
          label: "High Priority",
          glow: "shadow-red-200"
        };
      case "P2": 
        return {
          color: "bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-orange-200",
          icon: Star,
          label: "Medium Priority",
          glow: "shadow-orange-200"
        };
      case "P3": 
        return {
          color: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-200",
          icon: Clock,
          label: "Low Priority",
          glow: "shadow-blue-200"
        };
      default: 
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-200",
          icon: Clock,
          label: "No Priority",
          glow: "shadow-gray-200"
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const PriorityIcon = priorityConfig.icon;

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/95 backdrop-blur-sm ${
      task.completed ? 'opacity-75 scale-95' : 'hover:scale-105'
    } ${priorityConfig.glow} shadow-lg`}>
      {/* Priority Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${priorityConfig.color.split(' ')[0]} ${priorityConfig.color.split(' ')[1]} ${priorityConfig.color.split(' ')[2]}`} />
      
      {/* Completion Overlay */}
      {task.completed && (
        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center z-10">
          <CheckCircle2 className="h-16 w-16 text-green-500 opacity-80" />
        </div>
      )}

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-1 h-5 w-5 rounded-full border-2"
            />
            <div className="flex-1">
              <h3 className={`font-bold text-lg text-gray-800 leading-tight transition-all duration-200 ${
                task.completed ? 'line-through text-gray-500' : 'group-hover:text-indigo-600'
              }`}>
                {task.description}
              </h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto rounded-full"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Assigned to</div>
              <div className="font-semibold">{task.assignee}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Due Date</div>
              <div className="font-semibold">{task.dueDate}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge 
              className={`${priorityConfig.color} border-0 px-4 py-2 text-sm font-bold shadow-md`}
            >
              <PriorityIcon className="h-4 w-4 mr-2" />
              {priorityConfig.label}
            </Badge>
            
            {task.completed && (
              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </div>

        {/* Hover Effect Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  );
};

export default TaskCard;
