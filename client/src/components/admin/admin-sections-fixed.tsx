import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Briefcase, 
  Code, 
  Trophy, 
  MessageSquare, 
  Bot,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Upload
} from "lucide-react";
import { publicApi, adminApi } from "@/lib/api";

// Quick Overview Section
export function QuickOverviewSection() {
  const { data: introduction } = useQuery({
    queryKey: ['/api/introduction'],
    queryFn: () => publicApi.getIntroduction(),
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['/api/skills'],
    queryFn: () => publicApi.getSkills(),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => publicApi.getProjects(),
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['/api/achievements'],
    queryFn: () => publicApi.getAchievements(),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/admin/contact-messages'],
    queryFn: () => adminApi.getContactMessages(),
  });

  const unreadMessages = messages.filter((msg: any) => !msg.isRead).length;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Code className="w-8 h-8 text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Skills</p>
              <p className="text-2xl font-bold">{skills.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Briefcase className="w-8 h-8 text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Projects</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Achievements</p>
              <p className="text-2xl font-bold">{achievements.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">New Messages</p>
              <p className="text-2xl font-bold">{unreadMessages}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Introduction Section
export function IntroductionSection() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: introduction } = useQuery({
    queryKey: ['/api/introduction'],
    queryFn: () => publicApi.getIntroduction(),
  });

  const introSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    specialty: z.string().optional(),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    profileImageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    location: z.string().optional(),
    email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
    phone: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(introSchema),
    defaultValues: {
      name: introduction?.name || "",
      role: introduction?.role || "",
      specialty: introduction?.specialty || "",
      bio: introduction?.bio || "",
      profileImageUrl: introduction?.profileImageUrl || "",
      location: introduction?.location || "",
      email: introduction?.email || "",
      phone: introduction?.phone || "",
    },
  });

  // Reset form when data loads
  if (introduction && !isEditing) {
    form.reset({
      name: introduction.name || "",
      role: introduction.role || "",
      specialty: introduction.specialty || "",
      bio: introduction.bio || "",
      profileImageUrl: introduction.profileImageUrl || "",
      location: introduction.location || "",
      email: introduction.email || "",
      phone: introduction.phone || "",
    });
  }

  const updateMutation = useMutation({
    mutationFn: adminApi.updateIntroduction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/introduction'] });
      toast({ title: "Introduction updated successfully!" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update introduction", variant: "destructive" });
    },
  });

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-400" />
          Introduction & Profile
        </CardTitle>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="sm"
        >
          {isEditing ? <EyeOff className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input className="bg-slate-700 border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input className="bg-slate-700 border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty (Optional)</FormLabel>
                    <FormControl>
                      <Input className="bg-slate-700 border-slate-600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="profileImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input type="url" className="bg-slate-700 border-slate-600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea className="bg-slate-700 border-slate-600" rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input className="bg-slate-700 border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" className="bg-slate-700 border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input className="bg-slate-700 border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-400">Name</label>
                <p className="text-slate-200">{introduction?.name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Role</label>
                <p className="text-slate-200">{introduction?.role || "Not set"}</p>
              </div>
            </div>
            {introduction?.specialty && (
              <div>
                <label className="text-sm font-medium text-slate-400">Specialty</label>
                <p className="text-slate-200">{introduction.specialty}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-400">Bio</label>
              <p className="text-slate-200">{introduction?.bio || "Not set"}</p>
            </div>
            {introduction?.profileImageUrl && (
              <div>
                <label className="text-sm font-medium text-slate-400">Profile Image</label>
                <img src={introduction.profileImageUrl} alt="Profile" className="w-20 h-20 rounded-full mt-2" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skills Section
export function SkillsSection() {
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills = [] } = useQuery({
    queryKey: ['/api/skills'],
    queryFn: () => publicApi.getSkills(),
  });

  const skillSchema = z.object({
    name: z.string().min(2, "Skill name must be at least 2 characters"),
    category: z.enum(["frontend", "backend", "database", "devops", "mobile", "other"]),
    proficiency: z.number().min(1).max(5),
    iconName: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "frontend" as const,
      proficiency: 3,
      iconName: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({ title: "Skill created successfully!" });
      setShowAddForm(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminApi.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({ title: "Skill updated successfully!" });
      setEditingSkill(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({ title: "Skill deleted successfully!" });
    },
  });

  const startEdit = (skill: any) => {
    setEditingSkill(skill);
    form.reset({
      name: skill.name || "",
      category: skill.category || "frontend",
      proficiency: skill.proficiency || 3,
      iconName: skill.iconName || "",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Code className="w-5 h-5 mr-2 text-blue-400" />
            Manage Skills
          </CardTitle>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t border-slate-700">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="frontend">Frontend</SelectItem>
                            <SelectItem value="backend">Backend</SelectItem>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="devops">DevOps</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="proficiency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency (1-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            className="bg-slate-700 border-slate-600" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="iconName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Name (Optional)</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {createMutation.isPending ? "Creating..." : "Create Skill"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>

      {/* Skills List */}
      <div className="grid gap-4">
        {skills.map((skill: any) => (
          <Card key={skill.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              {editingSkill?.id === skill.id ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => {
                    updateMutation.mutate({ id: skill.id, data });
                  })} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skill Name</FormLabel>
                            <FormControl>
                              <Input className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-700 border-slate-600">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="frontend">Frontend</SelectItem>
                                <SelectItem value="backend">Backend</SelectItem>
                                <SelectItem value="database">Database</SelectItem>
                                <SelectItem value="devops">DevOps</SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="proficiency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proficiency (1-5)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="5" 
                                className="bg-slate-700 border-slate-600" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="iconName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon Name (Optional)</FormLabel>
                            <FormControl>
                              <Input className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingSkill(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {skill.category}
                        </Badge>
                        <span className="text-sm text-slate-400">
                          {Array.from({ length: skill.proficiency }, (_, i) => '★').join('')}
                          {Array.from({ length: 5 - skill.proficiency }, (_, i) => '☆').join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startEdit(skill)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => skill.id && deleteMutation.mutate(skill.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
