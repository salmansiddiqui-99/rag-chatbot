import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main course sidebar with hierarchical structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'introduction',
      label: 'Introduction to Physical AI',
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 Basics',
      link: {
        type: 'doc',
        id: 'module-1-ros2/module-1-ros2',
      },
      items: [
        'module-1-ros2/ros2-architecture',
        'module-1-ros2/nodes-topics-services',
        'module-1-ros2/rclpy-integration',
        'module-1-ros2/urdf-humanoids',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin',
      link: {
        type: 'doc',
        id: 'module-2-digital-twin/module-2-digital-twin',
      },
      items: [
        'module-2-digital-twin/gazebo-physics',
        'module-2-digital-twin/sensor-simulation',
        'module-2-digital-twin/unity-visualization',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac',
      link: {
        type: 'doc',
        id: 'module-3-isaac/module-3-isaac',
      },
      items: [
        'module-3-isaac/isaac-sim',
        'module-3-isaac/isaac-ros-vslam',
        'module-3-isaac/nav2-bipedal',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: VLA Systems',
      link: {
        type: 'doc',
        id: 'module-4-vla/module-4-vla',
      },
      items: [
        'module-4-vla/whisper-voice',
        'module-4-vla/llm-planning',
        'module-4-vla/capstone-project',
      ],
    },
    {
      type: 'category',
      label: 'Supporting Resources',
      items: [
        'supporting/learning-outcomes',
        'supporting/weekly-breakdown',
        'supporting/assessments',
        'supporting/hardware-requirements',
      ],
      collapsed: true,
    },
  ],
};

export default sidebars;
