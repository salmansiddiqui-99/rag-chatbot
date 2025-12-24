import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function RobotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Particle system for robotic/AI effect
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Robot figure animation
    class Robot {
      x: number;
      y: number;
      armAngle: number;
      legAngle: number;
      direction: number;

      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.armAngle = 0;
        this.legAngle = 0;
        this.direction = 1;
      }

      update() {
        this.armAngle += 0.03 * this.direction;
        this.legAngle += 0.02 * this.direction;

        if (Math.abs(this.armAngle) > 0.3) {
          this.direction *= -1;
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Robot body
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.lineWidth = 3;

        // Head
        ctx.beginPath();
        ctx.arc(0, -40, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.beginPath();
        ctx.arc(-8, -42, 4, 0, Math.PI * 2);
        ctx.arc(8, -42, 4, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.rect(-25, -15, 50, 50);
        ctx.stroke();

        // Arms
        ctx.save();
        ctx.rotate(this.armAngle);
        ctx.beginPath();
        ctx.moveTo(-25, -10);
        ctx.lineTo(-45, 10);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.rotate(-this.armAngle);
        ctx.beginPath();
        ctx.moveTo(25, -10);
        ctx.lineTo(45, 10);
        ctx.stroke();
        ctx.restore();

        // Legs
        ctx.save();
        ctx.rotate(this.legAngle * 0.5);
        ctx.beginPath();
        ctx.moveTo(-15, 35);
        ctx.lineTo(-15, 60);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.rotate(-this.legAngle * 0.5);
        ctx.beginPath();
        ctx.moveTo(15, 35);
        ctx.lineTo(15, 60);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    const robot = new Robot();

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections between nearby particles
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // Draw robot
      robot.update();
      robot.draw();

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.robotCanvas} />;
}

function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBackground}>
        <RobotAnimation />
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Physical AI & Humanoid Robotics
        </h1>
        <p className={styles.heroSubtitle}>
          Embodied Intelligence: Bridging Digital AI and the Physical World
        </p>
        <p className={styles.heroDescription}>
          Master the future of robotics with hands-on training in ROS 2, Digital Twin simulation,
          NVIDIA Isaac AI platform, and Vision-Language-Action systems. Build autonomous humanoid robots from scratch.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.buttonPrimary} to="/introduction">
            Start Free Course →
          </Link>
          <Link className={styles.buttonSecondary} to="/module-1-ros2">
            Explore Curriculum
          </Link>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  return (
    <section className={styles.stats}>
      <div className={styles.statItem}>
        <h3>13</h3>
        <p>Weeks of Content</p>
      </div>
      <div className={styles.statItem}>
        <h3>4</h3>
        <p>Core Modules</p>
      </div>
      <div className={styles.statItem}>
        <h3>50+</h3>
        <p>Code Examples</p>
      </div>
      <div className={styles.statItem}>
        <h3>100%</h3>
        <p>Hands-On Projects</p>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: '🚀',
      title: 'Industry-Ready Skills',
      description: 'Learn ROS 2, the industry standard for robotics development, used by companies like Boston Dynamics, Tesla, and NASA.',
    },
    {
      icon: '🧠',
      title: 'AI-First Approach',
      description: 'Integrate cutting-edge AI models with physical robots using Vision-Language-Action systems and LLM-based planning.',
    },
    {
      icon: '🎯',
      title: 'Hands-On Projects',
      description: 'Build real-world projects including autonomous navigation, object manipulation, and voice-controlled humanoids.',
    },
    {
      icon: '⚡',
      title: 'GPU-Accelerated',
      description: 'Leverage NVIDIA Isaac for high-performance simulation and perception using GPU acceleration.',
    },
    {
      icon: '🔧',
      title: 'Production-Ready',
      description: 'Learn deployment strategies, CI/CD pipelines, and best practices for production robotics systems.',
    },
    {
      icon: '📚',
      title: 'Comprehensive Curriculum',
      description: 'From fundamentals to advanced topics, covering the complete stack of modern robotics development.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Why Learn Physical AI?</h2>
          <p>Gain practical skills in the fastest-growing field at the intersection of AI and robotics</p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModulesSection() {
  const modules = [
    {
      number: 'MODULE 1',
      title: 'The Robotic Nervous System',
      description: 'Master ROS 2 fundamentals and build distributed robotic control systems.',
      topics: [
        'ROS 2 Architecture & Communication',
        'Publishers, Subscribers & Services',
        'Python Integration (rclpy)',
        'URDF Robot Modeling',
      ],
      link: '/module-1-ros2',
    },
    {
      number: 'MODULE 2',
      title: 'Digital Twin Simulation',
      description: 'Create high-fidelity physics simulations for testing and validation.',
      topics: [
        'Gazebo Physics Engine',
        'Sensor Simulation (LiDAR, Cameras, IMU)',
        'Unity Visualization & HDRP',
        'Digital Twin Workflows',
      ],
      link: '/module-2-digital-twin',
    },
    {
      number: 'MODULE 3',
      title: 'NVIDIA Isaac AI Platform',
      description: 'Leverage GPU acceleration for perception and synthetic data generation.',
      topics: [
        'Isaac Sim & Replicator',
        'Visual SLAM (VSLAM)',
        'Nav2 Bipedal Navigation',
        'Synthetic Data Generation',
      ],
      link: '/module-3-isaac',
    },
    {
      number: 'MODULE 4',
      title: 'Vision-Language-Action',
      description: 'Build autonomous systems that understand voice commands and execute tasks.',
      topics: [
        'Whisper Voice Recognition',
        'LLM-Based Task Planning (GPT-4)',
        'ReAct Pattern Implementation',
        'Capstone: Voice-Controlled Humanoid',
      ],
      link: '/module-4-vla',
    },
  ];

  return (
    <section className={styles.modules}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Course Curriculum</h2>
          <p>Four comprehensive modules taking you from beginner to autonomous robotics expert</p>
        </div>
        <div className={styles.moduleGrid}>
          {modules.map((module, idx) => (
            <div key={idx} className={styles.moduleCard}>
              <div className={styles.moduleNumber}>{module.number}</div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <ul>
                {module.topics.map((topic, topicIdx) => (
                  <li key={topicIdx}>{topic}</li>
                ))}
              </ul>
              <Link className={styles.moduleLink} to={module.link}>
                Explore Module →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContent}>
        <h2>Ready to Build the Future?</h2>
        <p>
          Start your journey into Physical AI and Humanoid Robotics today. 100% free, no credit card required.
        </p>
        <Link className={styles.buttonPrimary} to="/introduction">
          Access Full Course Now →
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Master Physical AI & Humanoid Robotics with ROS 2, Digital Twins, NVIDIA Isaac, and Vision-Language-Action systems"
    >
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ModulesSection />
      <CTASection />
    </Layout>
  );
}
