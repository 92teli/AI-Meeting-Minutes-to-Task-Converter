
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, User, Calendar, Star, AlertTriangle, Clock } from "lucide-react";
import { Task } from "@/types/Task";

interface CompletedTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedTasks: Task[];
}

const CompletedTasksModal = ({ open, onOpenChange, completedTasks }: CompletedTasksModalProps) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <CheckCircle2 className="h-7 w-7 text-green-500" />
            Completed Tasks ({completedTasks.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed tasks yet</h3>
              <p className="text-gray-500">Complete some tasks to see them here!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {completedTasks.map((task) => {
                const priorityConfig = getPriorityConfig(task.priority);
                const PriorityIcon = priorityConfig.icon;
                
                return (
                  <Card key={task.id} className="border-2 border-green-200 bg-green-50/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                          <h3 className="font-bold text-lg text-gray-800 line-through opacity-75">
                            {task.description}
                          </h3>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
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

export default CompletedTasksModal;
