
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Task, Priority } from "@/types/Task";
import { Sparkles, User, Calendar, AlertTriangle, Star, Clock } from "lucide-react";
import DateTimePicker from "./DateTimePicker";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, "id">) => void;
}

const AddTaskModal = ({ open, onOpenChange, onAddTask }: AddTaskModalProps) => {
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>("P3");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !assignee.trim()) return;

    const formattedDueDate = dueDate 
      ? dueDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })
      : "No deadline";

    onAddTask({
      description: description.trim(),
      assignee: assignee.trim(),
      dueDate: formattedDueDate,
      priority,
      completed: false,
    });

    // Reset form
    setDescription("");
    setAssignee("");
    setDueDate(undefined);
    setPriority("P3");
    onOpenChange(false);
  };

  const priorityOptions = [
    {
      value: "P1",
      label: "P1 - High Priority",
      color: "from-red-500 to-pink-500",
      icon: AlertTriangle,
      description: "Urgent tasks that need immediate attention"
    },
    {
      value: "P2",
      label: "P2 - Medium Priority", 
      color: "from-orange-500 to-yellow-500",
      icon: Star,
      description: "Important tasks with moderate urgency"
    },
    {
      value: "P3",
      label: "P3 - Low Priority",
      color: "from-blue-500 to-indigo-500",
      icon: Clock,
      description: "Tasks that can be completed when time allows"
    }
  ];

  const isFormValid = description.trim() && assignee.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white/95 backdrop-blur-lg border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            Create New Task
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Task Description
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a clear and concise task description..."
                    className="border-2 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl text-base py-3"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="assignee" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Assigned To
                  </Label>
                  <Input
                    id="assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Enter the person responsible for this task..."
                    className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl text-base py-3"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    Due Date & Time
                  </Label>
                  <DateTimePicker
                    date={dueDate}
                    setDate={setDueDate}
                    placeholder="Select due date and time..."
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Priority Level
                  </Label>
                  
                  <div className="grid gap-3">
                    {priorityOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = priority === option.value;
                      
                      return (
                        <div
                          key={option.value}
                          onClick={() => setPriority(option.value as Priority)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105` 
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                            <div>
                              <div className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                {option.label}
                              </div>
                              <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                {option.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4 pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-2 border-gray-300 hover:bg-gray-50 rounded-xl py-3 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 rounded-xl py-3 text-base font-semibold shadow-lg transform transition-all duration-200 ${
                isFormValid 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
