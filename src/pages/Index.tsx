import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Sparkles, Brain, Wand2, Zap, CheckCircle2, Filter, Search, SortAsc, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import TaskCard from "@/components/TaskCard";
import AddTaskModal from "@/components/AddTaskModal";
import StatsModal from "@/components/StatsModal";
import { Task, Priority } from "@/types/Task";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [transcript, setTranscript] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      description: "Take the landing page",
      assignee: "Aman",
      dueDate: "10:00 PM, Tomorrow",
      priority: "P3" as Priority,
      completed: false,
    },
    {
      id: "2", 
      description: "Client follow-up",
      assignee: "Rajeev",
      dueDate: "Wednesday",
      priority: "P2" as Priority,
      completed: false,
    },
    {
      id: "3",
      description: "Review the marketing deck",
      assignee: "Shreya", 
      dueDate: "Tonight",
      priority: "P1" as Priority,
      completed: true,
    },
  ]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState<'total' | 'completed' | 'pending' | 'high-priority' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("priority");
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTranscript = localStorage.getItem("taskmaster-transcript");
    const savedTasks = localStorage.getItem("taskmaster-tasks");
    
    if (savedTranscript) setTranscript(savedTranscript);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error parsing saved tasks:", error);
      }
    }
  }, []);

  // Save transcript to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("taskmaster-transcript", transcript);
  }, [transcript]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("taskmaster-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const extractTasksWithGemini = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No transcript provided",
        description: "Please paste a meeting transcript to extract tasks.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/extract-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const extractedTasks = data.tasks;
      
      if (!extractedTasks || extractedTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "Could not extract any tasks from the transcript. Try being more specific about tasks and assignments.",
          variant: "destructive",
        });
        return;
      }
      
      const newTasks: Task[] = extractedTasks.map((task: any, index: number) => ({
        id: Date.now().toString() + index,
        description: task.description || "Untitled task",
        assignee: task.assignee || "Unassigned",
        dueDate: task.dueDate || "No deadline",
        priority: (task.priority as Priority) || "P3",
        completed: false,
      }));
      
      setTasks(prev => [...prev, ...newTasks]);
      setTranscript("");
      
      toast({
        title: "Tasks Extracted Successfully!",
        description: `${newTasks.length} tasks have been added to your board.`,
      });
      
    } catch (error) {
      console.error('Error extracting tasks:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract tasks. Please ensure your Gemini API key is configured and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Added",
      description: "New task has been added successfully.",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your board.",
    });
  };

  const filteredTasks = tasks
    .filter(task => {
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "completed" && task.completed) ||
        (filterStatus === "pending" && !task.completed);
      const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPriority && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { "P1": 3, "P2": 2, "P3": 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "assignee") {
        return a.assignee.localeCompare(b.assignee);
      }
      return 0;
    });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === "P1").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/60 to-pink-400/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/60 to-blue-400/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/60 to-teal-400/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-br from-violet-400/50 to-purple-400/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              AI TaskMaster
            </h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl text-gray-700 font-medium leading-relaxed mb-4">
              Transform your meeting transcripts into actionable tasks with the power of advanced AI
            </p>
            <p className="text-lg text-gray-600">
              Intelligent parsing • Smart categorization • Beautiful organization
            </p>
          </div>
        </div>

        {/* Glassmorphism Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <Card 
            className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={() => setShowStatsModal('total')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 text-blue-800">{stats.total}</div>
              <div className="text-blue-700 text-sm font-medium">Total Tasks</div>
              <div className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view details</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={() => setShowStatsModal('completed')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 text-green-800">{stats.completed}</div>
              <div className="text-green-700 text-sm font-medium">Completed</div>
              <div className="text-xs text-green-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view details</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={() => setShowStatsModal('pending')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 text-orange-800">{stats.pending}</div>
              <div className="text-orange-700 text-sm font-medium">Pending</div>
              <div className="text-xs text-orange-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view details</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={() => setShowStatsModal('high-priority')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 text-red-800">{stats.highPriority}</div>
              <div className="text-red-700 text-sm font-medium">High Priority</div>
              <div className="text-xs text-red-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view details</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Extraction Section */}
        <Card className="mb-10 bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Wand2 className="h-7 w-7" />
              AI-Powered Task Extraction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Meeting Transcript
              </label>
              <Textarea
                placeholder="Paste your meeting transcript here... 

Example: 'John, please finish the homepage design by Friday. Sarah, can you handle the client presentation for next Tuesday? Mike, we need the API documentation completed by tomorrow evening.'"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-40 resize-none border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl text-base bg-white/70 backdrop-blur-sm"
              />
            </div>
            
            <Button 
              onClick={extractTasksWithGemini}
              disabled={!transcript.trim() || isProcessing}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  AI is extracting tasks...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-3" />
                  Extract Tasks with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <Card className="mb-8 bg-white/60 backdrop-blur-lg border border-white/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-white/70 backdrop-blur-sm"
                />
              </div>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="P1">P1 - High</SelectItem>
                  <SelectItem value="P2">P2 - Medium</SelectItem>
                  <SelectItem value="P3">P3 - Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36 bg-white/70 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 bg-white/70 backdrop-blur-sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="assignee">Assignee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-bold text-gray-800">Task Board</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/60 backdrop-blur-sm">
              {filteredTasks.length} tasks
            </Badge>
          </div>
          <Button
            onClick={() => setShowAddTask(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg px-6 py-3"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Task Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-20 bg-white/50 backdrop-blur-lg border-2 border-dashed border-white/40 shadow-xl">
            <CardContent>
              <div className="flex flex-col items-center gap-8">
                <div className="h-40 w-40 bg-gradient-to-br from-purple-100/60 to-indigo-100/60 backdrop-blur-lg rounded-full flex items-center justify-center">
                  <Sparkles className="h-20 w-20 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-semibold text-gray-800 mb-4">No tasks found</h3>
                  <p className="text-gray-600 text-xl max-w-md mx-auto">
                    {searchTerm || filterPriority !== "all" || filterStatus !== "all" 
                      ? "Try adjusting your filters or search terms"
                      : "Paste a meeting transcript above or add tasks manually to get started"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <AddTaskModal
          open={showAddTask}
          onOpenChange={setShowAddTask}
          onAddTask={addTask}
        />

        <StatsModal
          open={showStatsModal !== null}
          onOpenChange={(open) => !open && setShowStatsModal(null)}
          tasks={tasks}
          type={showStatsModal || 'total'}
        />
      </div>
    </div>
  );
};

export default Index;
