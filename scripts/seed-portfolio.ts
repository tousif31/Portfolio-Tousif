import { db } from '../server/db';
import { introduction, socials, skills, projects, achievements, aiConfig } from '../shared/schema';

async function seedPortfolio() {
  try {
    console.log('Seeding portfolio data...');
    
    // Introduction
    await db.insert(introduction).values({
      name: 'Mohammed Tousif',
      role: 'Full Stack Developer',
      specialty: 'AI Enthusiast',
      bio: 'Passionate full-stack developer with expertise in modern web technologies and artificial intelligence.',
      detailedBio: 'I\'m a dedicated full-stack developer with a passion for creating innovative web applications. My expertise spans across React, Node.js, Python, and cloud platforms. I specialize in integrating AI capabilities into web applications to create intelligent, user-friendly experiences.',
      email: 'mohammedtousif3709@gmail.com',
      phone: '+1-234-567-8900',
      location: 'Bangalore, India',
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    });

    // Socials
    await db.insert(socials).values({
      github: 'https://github.com/mohammedtousif',
      linkedin: 'https://linkedin.com/in/mohammedtousif',
      twitter: 'https://twitter.com/mohammedtousif',
      instagram: 'https://instagram.com/mohammedtousif',
    });

    // Skills
    const skillsData = [
      { name: 'React', category: 'frontend', proficiency: 90, order: 1 },
      { name: 'TypeScript', category: 'frontend', proficiency: 85, order: 2 },
      { name: 'Next.js', category: 'frontend', proficiency: 88, order: 3 },
      { name: 'TailwindCSS', category: 'frontend', proficiency: 92, order: 4 },
      { name: 'Node.js', category: 'backend', proficiency: 90, order: 1 },
      { name: 'Express.js', category: 'backend', proficiency: 88, order: 2 },
      { name: 'PostgreSQL', category: 'backend', proficiency: 85, order: 3 },
      { name: 'Python', category: 'backend', proficiency: 82, order: 4 },
      { name: 'Git', category: 'tools', proficiency: 90, order: 1 },
      { name: 'Docker', category: 'tools', proficiency: 75, order: 2 },
      { name: 'AWS', category: 'tools', proficiency: 78, order: 3 },
      { name: 'Figma', category: 'tools', proficiency: 70, order: 4 },
    ];

    for (const skill of skillsData) {
      await db.insert(skills).values(skill);
    }

    // Projects
    const projectsData = [
      {
        title: 'AI-Powered Portfolio',
        description: 'A dynamic full-stack portfolio with AI chatbot integration, admin dashboard, and comprehensive content management.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Gemini AI', 'TailwindCSS'],
        githubUrl: 'https://github.com/mohammedtousif/ai-portfolio',
        liveUrl: 'https://portfolio.mohammedtousif.dev',
        featured: true,
        order: 1,
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      },
      {
        title: 'E-Commerce Platform',
        description: 'Modern e-commerce solution with real-time inventory management, payment integration, and advanced analytics.',
        technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL', 'Redis'],
        githubUrl: 'https://github.com/mohammedtousif/ecommerce-platform',
        liveUrl: 'https://shop.example.com',
        featured: true,
        order: 2,
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management application with real-time updates, team collaboration features, and productivity analytics.',
        technologies: ['React', 'Socket.io', 'Express', 'MongoDB', 'Chart.js'],
        githubUrl: 'https://github.com/mohammedtousif/task-manager',
        liveUrl: 'https://tasks.example.com',
        featured: false,
        order: 3,
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      },
    ];

    for (const project of projectsData) {
      await db.insert(projects).values(project);
    }

    // Achievements
    const achievementsData = [
      {
        title: 'Full Stack Web Development Certification',
        issuer: 'Coursera',
        date: '2023-12-15',
        certificateUrl: 'https://coursera.org/certificate/fullstack',
        description: 'Completed comprehensive full-stack development course covering React, Node.js, and databases.',
        iconType: 'certificate',
        order: 1,
      },
      {
        title: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2023-10-20',
        certificateUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        description: 'Demonstrated foundational understanding of AWS cloud services and architecture.',
        iconType: 'award',
        order: 2,
      },
      {
        title: 'React Professional Developer',
        issuer: 'Meta',
        date: '2023-08-30',
        certificateUrl: 'https://coursera.org/certificate/react-professional',
        description: 'Advanced React development skills including hooks, context, and performance optimization.',
        iconType: 'medal',
        order: 3,
      },
      {
        title: 'Best Innovation Award',
        issuer: 'TechFest 2023',
        date: '2023-06-15',
        certificateUrl: 'https://techfest.example.com/awards/2023',
        description: 'Won first place for AI-powered web application at the annual technology festival.',
        iconType: 'trophy',
        order: 4,
      },
    ];

    for (const achievement of achievementsData) {
      await db.insert(achievements).values(achievement);
    }

    // AI Config
    await db.insert(aiConfig).values({
      systemPrompt: 'You are a helpful AI assistant that provides feedback on Mohammed Tousif\'s portfolio and career advice. You are knowledgeable about web development, artificial intelligence, and software engineering best practices.',
      enabled: true,
    });

    console.log('Portfolio data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding portfolio data:', error);
    process.exit(1);
  }
}

seedPortfolio();