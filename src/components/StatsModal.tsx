
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, User, Calendar, Star, AlertTriangle, Clock, Target, TrendingUp } from "lucide-react";
import { Task } from "@/types/Task";

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  type: 'total' | 'completed' | 'pending' | 'high-priority';
}

const StatsModal = ({ open, onOpenChange, tasks, type }: StatsModalProps) => {
  const getFilteredTasks = () => {
    switch (type) {
      case 'total':
        return tasks;
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'high-priority':
        return tasks.filter(task => task.priority === 'P1');
      default:
        return [];
    }
  };

  const getModalConfig = () => {
    switch (type) {
      case 'total':
        return {
          title: 'All Tasks',
          icon: Target,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'completed':
        return {
          title: 'Completed Tasks',
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'pending':
        return {
          title: 'Pending Tasks',
          icon: TrendingUp,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        };
      case 'high-priority':
        return {
          title: 'High Priority Tasks',
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          title: 'Tasks',
          icon: Target,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "P1": 
        return {
          color: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
          icon: AlertTriangle,
          label: "High Priority"
        };
      case "P2": 
        return {
          color: "bg-gradient-to-r from-orange-500 to-yellow-500 text-white",
          icon: Star,
          label: "Medium Priority"
        };
      case "P3": 
        return {
          color: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
          icon: Clock,
          label: "Low Priority"
        };
      default: 
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
          icon: Clock,
          label: "No Priority"
        };
    }
  };

  const filteredTasks = getFilteredTasks();
  const config = getModalConfig();
  const IconComponent = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <IconComponent className={`h-7 w-7 ${config.color}`} />
            {config.title} ({filteredTasks.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <IconComponent className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
              <p className="text-gray-500">No tasks match the selected criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => {
                const priorityConfig = getPriorityConfig(task.priority);
                const PriorityIcon = priorityConfig.icon;
                
                return (
                  <Card key={task.id} className={`border-2 ${task.completed ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          {task.completed && <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />}
                          <h3 className={`font-bold text-lg text-gray-800 ${task.completed ? 'line-through opacity-75' : ''}`}>
                            {task.description}
                          </h3>
                        </div>
                        <Badge className={task.completed ? "bg-green-100 text-green-800 border-green-200 px-3 py-1" : "bg-blue-100 text-blue-800 border-blue-200 px-3 py-1"}>
                          {task.completed ? 'Complete' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        <div className="flex items-center gap-3">
                          <Badge className={`${priorityConfig.color} border-0 px-4 py-2 text-sm font-bold`}>
                            <PriorityIcon className="h-4 w-4 mr-2" />
                            {priorityConfig.label}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;
