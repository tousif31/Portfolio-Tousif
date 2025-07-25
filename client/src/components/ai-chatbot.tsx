import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, User, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/types/portfolio";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hi! I'm your AI assistant. I can help provide feedback on your portfolio, suggest improvements, or answer questions about your projects. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => publicApi.sendChatMessage(message, "Portfolio feedback assistant"),
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        message: data.response,
        sender: 'ai',
        timestamp: new Date(),
      }]);
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Send to AI
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-80 h-96 bg-slate-800 border-slate-700 shadow-xl">
          {/* Chat Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Portfolio Assistant</h3>
                  <p className="text-blue-100 text-xs">Powered by Gemini AI</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 p-4 h-64 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-6 h-6 ${
                  message.sender === 'user' ? 'bg-blue-600/20' : 'bg-blue-600/20'
                } rounded-full flex items-center justify-center flex-shrink-0`}>
                  {message.sender === 'user' ? (
                    <User className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Bot className="w-3 h-3 text-blue-400" />
                  )}
                </div>
                <div className={`p-3 rounded-lg max-w-xs ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-700 text-slate-200 rounded-tl-none'
                }`}>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-blue-400" />
                </div>
                <div className="bg-slate-700 p-3 rounded-lg rounded-tl-none max-w-xs">
                  <p className="text-sm text-slate-200">Thinking...</p>
                </div>
              </div>
            )}
          </CardContent>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-700">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about the portfolio..."
                className="flex-1 bg-slate-700 border-slate-600 text-white text-sm"
                disabled={sendMessageMutation.isPending}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={sendMessageMutation.isPending || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
