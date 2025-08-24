import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import emailjs from "@emailjs/browser";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();

  const { data: introduction } = useQuery({
    queryKey: ["/api/introduction"],
    queryFn: () => publicApi.getIntroduction(),
  });

  const { data: socials } = useQuery({
    queryKey: ["/api/socials"],
    queryFn: () => publicApi.getSocials(),
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    setIsSending(true);
    try {
      await emailjs.send(
        "service_9g6zx8g",
        "template_xigw0lm",
        {
          name: data.name,
          email: data.email,
          subject: `Contact Us: ${data.subject}`, // ✅ fixed here
          message: data.message,
          time: new Date().toLocaleString(),
        },
        "61vlQc6-foXIHb1t7"
      );
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error?.text || error?.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-slate-400 text-lg">
            Ready to collaborate? Let's discuss your next project!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white">
                    {introduction?.email || "mohammedtousif3709@gmail.com"}
                  </p>
                </div>
              </div>

              {introduction?.phone && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Phone className="text-green-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Phone</p>
                    <p className="text-white">{introduction.phone}</p>
                  </div>
                </div>
              )}

              {introduction?.location && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <MapPin className="text-purple-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white">{introduction.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {socials?.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {socials?.github && (
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-700 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {socials?.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-700 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {socials?.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
                            className="bg-slate-800 border-slate-600 text-white"
                            {...field}
                          />
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
                        <FormLabel className="text-slate-300">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            type="email"
                            className="bg-slate-800 border-slate-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Project discussion"
                            className="bg-slate-800 border-slate-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell me about your project..."
                            rows={5}
                            className="bg-slate-800 border-slate-600 text-white resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    {isSending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
