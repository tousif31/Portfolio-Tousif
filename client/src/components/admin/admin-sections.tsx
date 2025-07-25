import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, publicApi } from "@/lib/api";
import type { Skill } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  ServerCog, 
  Code, 
  Trophy, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  ArrowLeft,
  ImageIcon,
  Bot,
  BarChart3,
  Settings,
  FileText
} from "lucide-react";
import { useEffect } from 'react';

interface AdminSectionsProps {
  section: string;
  onBack: () => void;
}

export default function AdminSections({ section, onBack }: AdminSectionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const renderSection = () => {
    switch (section) {
      case 'intro':
        return <IntroductionSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'achievements':
        return <AchievementsSection />;
      case 'contact-messages':
        return <ContactMessagesSection />;
      case 'ai-config':
        return <AIConfigSection />;
      case 'socials':
        return <SocialLinksSection />;
      case 'overview':
        return <QuickOverviewSection />;
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      {renderSection()}
    </div>
  );
}

// Introduction Section
function IntroductionSection() {
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
    detailedBio: z.string().optional(),
    email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
    phone: z.string().optional(),
    location: z.string().optional(),
    profileImageUrl: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(introSchema),
    defaultValues: {
      name: introduction?.name || "",
      role: introduction?.role || "",
      specialty: introduction?.specialty || "",
      bio: introduction?.bio || "",
      detailedBio: introduction?.detailedBio || "",
      email: introduction?.email || "",
      phone: introduction?.phone || "",
      location: introduction?.location || "",
      profileImageUrl: introduction?.profileImageUrl || "",
    },
    values: introduction || {},
  });

  const updateMutation = useMutation({
    mutationFn: adminApi.updateIntroduction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/introduction'] });
      toast({ title: "Introduction updated successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update introduction",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-400" />
          Update Introduction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea className="bg-slate-700 border-slate-600" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="detailedBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Bio (Optional)</FormLabel>
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
            </div>
            
            <FormField
              control={form.control}
              name="profileImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://example.com/image.jpg"
                      className="bg-slate-700 border-slate-600" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Updating..." : "Update Introduction"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Skills Section
export function SkillsSection() {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills = [] } = useQuery({
    queryKey: ['/api/skills'],
    queryFn: () => publicApi.getSkills(),
  });

  // Skill Schema
  const skillSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    category: z.enum(["frontend", "backend", "tools"]),
    iconUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    proficiency: z.number().min(1).max(100),
    order: z.number().optional(),
  });

  // Add Skill Form
  const addForm = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "frontend" as const,
      iconUrl: "",
      proficiency: 80,
      order: 0,
    },
  });

  // Edit Skill Form
  const editForm = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "frontend" as const,
      iconUrl: "",
      proficiency: 80,
      order: 0,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminApi.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({ title: "Skill created successfully!" });
      setShowAddForm(false);
      addForm.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Skill> }) =>
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

  // Start Edit
  const startEdit = (skill: Skill) => {
    setEditingSkill(skill);
    editForm.reset({
      name: skill.name,
      category: skill.category,
      iconUrl: skill.iconUrl || "",
      proficiency: skill.proficiency || 80,
      order: skill.order || 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Skill Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ServerCog className="w-5 h-5 mr-2 text-green-400" />
            Manage Skills
          </CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardHeader>

        {showAddForm && (
          <CardContent className="border-t border-slate-700">
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit((data) => createMutation.mutate(data))}
                className="space-y-4"
              >
                <SkillFormFields form={addForm} />
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
                      addForm.reset();
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
        {skills.map((skill) => (
          <Card key={skill.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              {editingSkill?.id === skill.id ? (
                <Form {...editForm}>
                  <form
                    onSubmit={editForm.handleSubmit((data) =>
                      updateMutation.mutate({ id: skill.id, data })
                    )}
                    className="space-y-4"
                  >
                    <SkillFormFields form={editForm} />
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditingSkill(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {skill.iconUrl && (
                      <img src={skill.iconUrl} alt={skill.name} className="w-8 h-8" />
                    )}
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm text-slate-400">
                        {skill.category} • {skill.proficiency}% proficiency
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(skill)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => skill.id && deleteMutation.mutate(skill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* Reusable Fields Component for Add & Edit */
function SkillFormFields({ form }: { form: any }) {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-4">
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
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proficiency (1-100)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  className="bg-slate-700 border-slate-600"
                  {...field}
                  value={field.value || 80}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 80)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="iconUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Icon URL (Optional)</FormLabel>
            <FormControl>
              <Input className="bg-slate-700 border-slate-600" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}


// Projects Section with Technologies Field
function ProjectsSection() {
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [techInput, setTechInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => publicApi.getProjects(),
  });

  const projectSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
  });

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      featured: false,
      order: 0,
    },
  });

  const [technologies, setTechnologies] = useState<string[]>([]);

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createProject({ ...data, technologies }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "Project created successfully!" });
      setShowAddForm(false);
      form.reset();
      setTechnologies([]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminApi.updateProject(id, { ...data, technologies }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "Project updated successfully!" });
      setEditingProject(null);
      setTechnologies([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "Project deleted successfully!" });
    },
  });

  const startEdit = (project: any) => {
    setEditingProject(project);
    setTechnologies(project.technologies || []);
    form.reset({
      title: project.title || "",
      description: project.description || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      imageUrl: project.imageUrl || "",
      featured: project.featured || false,
      order: project.order || 0,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Code className="w-5 h-5 mr-2 text-purple-400" />
          Manage Projects
        </CardTitle>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </CardHeader>
      
      <CardContent>
        {showAddForm && (
          <div className="border-b border-slate-600 pb-6 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            className="bg-slate-700 border-slate-600" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="bg-slate-700 border-slate-600" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Technologies Section */}
                <div>
                  <FormLabel>Technologies</FormLabel>
                  <div className="flex space-x-2 mt-1">
                    <Input 
                      placeholder="Enter technology..." 
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Button type="button" onClick={addTechnology} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center space-x-1">
                        <span>{tech}</span>
                        <button type="button" onClick={() => removeTechnology(tech)} className="ml-1">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL (Optional)</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="liveUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live URL (Optional)</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
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
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Project</FormLabel>
                        <p className="text-sm text-slate-400">Display this project prominently</p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {createMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      form.reset();
                      setTechnologies([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project: any) => (
            <div key={project.id} className="border border-slate-600 rounded-lg p-4">
              {editingProject?.id === project.id ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => {
                    updateMutation.mutate({ id: project.id, data });
                  })} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Title</FormLabel>
                            <FormControl>
                              <Input className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                className="bg-slate-700 border-slate-600" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea className="bg-slate-700 border-slate-600" rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Technologies Section for Edit */}
                    <div>
                      <FormLabel>Technologies</FormLabel>
                      <div className="flex space-x-2 mt-1">
                        <Input 
                          placeholder="Enter technology..." 
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                          className="bg-slate-700 border-slate-600"
                        />
                        <Button type="button" onClick={addTechnology} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="flex items-center space-x-1">
                            <span>{tech}</span>
                            <button type="button" onClick={() => removeTechnology(tech)} className="ml-1">×</button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="githubUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub URL (Optional)</FormLabel>
                            <FormControl>
                              <Input className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="liveUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Live URL (Optional)</FormLabel>
                            <FormControl>
                              <Input className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
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
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Project</FormLabel>
                            <p className="text-sm text-slate-400">Display this project prominently</p>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingProject(null);
                          setTechnologies([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.featured && (
                        <Badge className="bg-purple-600">Featured</Badge>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-4 text-xs text-slate-400">
                      {project.githubUrl && <span>GitHub: ✓</span>}
                      {project.liveUrl && <span>Live Demo: ✓</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startEdit(project)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => project.id && deleteMutation.mutate(project.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Achievements Section
function AchievementsSection() {
  const [editingAchievement, setEditingAchievement] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: achievements = [] } = useQuery({
    queryKey: ['/api/achievements'],
    queryFn: () => publicApi.getAchievements(),
  });

  const achievementSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    issuer: z.string().min(2, "Issuer must be at least 2 characters"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
    certificateUrl: z.string().optional(),
    iconType: z.enum(["certificate", "award", "medal", "trophy"]).optional(),
    order: z.number().optional(),
  });

  const form = useForm({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      issuer: "",
      date: "",
      description: "",
      certificateUrl: "",
      iconType: "certificate" as const,
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      toast({ title: "Achievement created successfully!" });
      setShowAddForm(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminApi.updateAchievement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      toast({ title: "Achievement updated successfully!" });
      setEditingAchievement(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      toast({ title: "Achievement deleted successfully!" });
    },
  });

  const startEdit = (achievement: any) => {
    setEditingAchievement(achievement);
    form.reset({
      title: achievement.title || "",
      issuer: achievement.issuer || "",
      date: achievement.date || "",
      description: achievement.description || "",
      certificateUrl: achievement.certificateUrl || "",
      iconType: achievement.iconType || "certificate",
      order: achievement.order || 0,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Manage Achievements
        </CardTitle>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </CardHeader>
      
      <CardContent>
        {showAddForm && (
          <div className="border-b border-slate-600 pb-6 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievement Title</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="issuer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuer/Organization</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" className="bg-slate-700 border-slate-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="iconType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="certificate">Certificate</SelectItem>
                            <SelectItem value="award">Award</SelectItem>
                            <SelectItem value="medal">Medal</SelectItem>
                            <SelectItem value="trophy">Trophy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            className="bg-slate-700 border-slate-600" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea className="bg-slate-700 border-slate-600" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="certificateUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate URL (Optional)</FormLabel>
                      <FormControl>
                        <Input className="bg-slate-700 border-slate-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {createMutation.isPending ? "Creating..." : "Create Achievement"}
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
          </div>
        )}

        {/* Achievements List */}
        <div className="space-y-4">
          {achievements.map((achievement: any) => (
            <div key={achievement.id} className="border border-slate-600 rounded-lg p-4">
              {editingAchievement?.id === achievement.id ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => {
                    updateMutation.mutate({ id: achievement.id, data });
                  })} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Achievement Title</FormLabel>
                            <FormControl>
                              <Input className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="issuer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuer/Organization</FormLabel>
                            <FormControl>
                              <Input className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" className="bg-slate-700 border-slate-600" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="iconType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-700 border-slate-600">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="certificate">Certificate</SelectItem>
                                <SelectItem value="award">Award</SelectItem>
                                <SelectItem value="medal">Medal</SelectItem>
                                <SelectItem value="trophy">Trophy</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                className="bg-slate-700 border-slate-600" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea className="bg-slate-700 border-slate-600" rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="certificateUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate URL (Optional)</FormLabel>
                          <FormControl>
                            <Input className="bg-slate-700 border-slate-600" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingAchievement(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-slate-400 text-sm mb-1">{achievement.issuer}</p>
                    <p className="text-slate-500 text-xs mb-2">
                      {achievement.date && new Date(achievement.date).toLocaleDateString()}
                    </p>
                    {achievement.description && (
                      <p className="text-slate-300 text-sm">{achievement.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startEdit(achievement)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => achievement.id && deleteMutation.mutate(achievement.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Contact Messages Section
function ContactMessagesSection() {
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/admin/contact-messages'],
    queryFn: () => adminApi.getContactMessages(),
  });

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="w-5 h-5 mr-2 text-blue-400" />
          Contact Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message: any) => (
              <Card key={message.id} className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold">{message.name}</h3>
                        <span className="text-sm text-slate-400">{message.email}</span>
                        {!message.isRead && (
                          <span className="bg-blue-600 text-xs px-2 py-1 rounded">New</span>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-2">{message.subject}</p>
                      <p className="text-slate-300 text-sm">{message.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {message.createdAt && new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No messages yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

// AI Configuration Section
function AIConfigSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aiConfig } = useQuery({
    queryKey: ['/api/admin/ai-config'],
    queryFn: () => adminApi.getAIConfig(),
  });

  const aiConfigSchema = z.object({
    systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
    enabled: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      systemPrompt: aiConfig?.systemPrompt || "",
      enabled: aiConfig?.enabled || false,
    },
    values: aiConfig || {},
  });

  const updateMutation = useMutation({
    mutationFn: adminApi.updateAIConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-config'] });
      toast({ title: "AI configuration updated successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update AI configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="w-5 h-5 mr-2 text-purple-400" />
          AI Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="bg-slate-700 border-slate-600" 
                      rows={6}
                      placeholder="Enter the system prompt for the AI chatbot..."
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-600 p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable AI Chatbot</FormLabel>
                    <div className="text-sm text-slate-400">
                      Allow visitors to chat with the AI assistant
                    </div>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Updating..." : "Update AI Config"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Social Links Section
function SocialLinksSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socials } = useQuery({
    queryKey: ['/api/socials'],
    queryFn: () => publicApi.getSocials(),
  });

  const socialsSchema = z.object({
    github: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  });

  const form = useForm({
    resolver: zodResolver(socialsSchema),
    defaultValues: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
    },
    values: socials || {},
  });

  useEffect(() => {
    if (socials) {
      form.reset(socials);
    }
  }, [socials]);

  const updateMutation = useMutation({
    mutationFn: adminApi.updateSocials,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/socials'] });
      toast({ title: 'Social links updated successfully!' });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update social links',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-400" />
          Manage Social Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input className="bg-slate-700 border-slate-600" placeholder="https://github.com/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input className="bg-slate-700 border-slate-600" placeholder="https://linkedin.com/in/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter URL</FormLabel>
                  <FormControl>
                    <Input className="bg-slate-700 border-slate-600" placeholder="https://twitter.com/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram URL</FormLabel>
                  <FormControl>
                    <Input className="bg-slate-700 border-slate-600" placeholder="https://instagram.com/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? 'Updating...' : 'Update Social Links'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Quick Overview Section
function QuickOverviewSection() {
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

  const stats = [
    { label: "Skills", value: skills.length, color: "text-green-400" },
    { label: "Projects", value: projects.length, color: "text-purple-400" },
    { label: "Achievements", value: achievements.length, color: "text-yellow-400" },
    { label: "Messages", value: messages.length, color: "text-blue-400" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {introduction && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Introduction</h3>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p className="font-medium">{introduction.name}</p>
                  <p className="text-slate-400 text-sm">{introduction.role}</p>
                  {introduction.specialty && (
                    <p className="text-slate-300 text-sm">{introduction.specialty}</p>
                  )}
                  <p className="text-slate-300 mt-2">{introduction.bio}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
