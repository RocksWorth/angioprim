// Design System Configuration for Template Customization
// This file allows easy customization for different business types

export interface BrandConfig {
  name: string;
  tagline: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    display: string;
  };
  spacing: {
    section: string;
    container: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    colored: string;
  };
}

// Default VersatilePrint Configuration
export const defaultBrandConfig: BrandConfig = {
  name: "VersatilePrint",
  tagline: "Premium Quality • Fast Delivery • Trusted by 10,000+ businesses",
  description: "Transform your brand with premium printing. From sophisticated business cards to stunning marketing materials — delivered with luxury service and attention to detail.",
  colors: {
    primary: "rgb(59, 130, 246)", // blue-500
    secondary: "rgb(147, 51, 234)", // purple-600
    accent: "rgb(236, 72, 153)", // pink-500
    background: "rgb(248, 250, 252)", // slate-50
    surface: "rgb(255, 255, 255)", // white
    text: "rgb(15, 23, 42)", // slate-900
    textSecondary: "rgb(71, 85, 105)", // slate-600
  },
  gradients: {
    primary: "from-blue-600 via-purple-600 to-blue-800",
    secondary: "from-purple-600 to-pink-600",
    hero: "from-blue-50 via-white to-purple-50",
  },
  fonts: {
    primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    secondary: "system-ui, sans-serif",
    display: "Inter, sans-serif",
  },
  spacing: {
    section: "py-20 lg:py-32",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  },
  borderRadius: {
    small: "rounded-lg",
    medium: "rounded-xl",
    large: "rounded-2xl",
  },
  shadows: {
    small: "shadow-lg",
    medium: "shadow-xl",
    large: "shadow-2xl",
    colored: "shadow-xl shadow-blue-500/25",
  },
};

// Alternative Business Templates
export const businessTemplates = {
  // Tech/Software Company
  tech: {
    ...defaultBrandConfig,
    name: "TechFlow",
    tagline: "Innovation • Scalability • Excellence in every solution",
    description: "Cutting-edge technology solutions that scale with your business. From cloud infrastructure to custom software development.",
    colors: {
      primary: "rgb(34, 197, 94)", // green-500
      secondary: "rgb(14, 165, 233)", // sky-500
      accent: "rgb(168, 85, 247)", // violet-500
      background: "rgb(248, 250, 252)",
      surface: "rgb(255, 255, 255)",
      text: "rgb(15, 23, 42)",
      textSecondary: "rgb(71, 85, 105)",
    },
    gradients: {
      primary: "from-green-600 via-blue-600 to-violet-800",
      secondary: "from-green-500 to-blue-600",
      hero: "from-green-50 via-white to-blue-50",
    },
  },

  // Fashion/Luxury
  fashion: {
    ...defaultBrandConfig,
    name: "LuxeCouture",
    tagline: "Elegance • Sophistication • Timeless Style",
    description: "Premium fashion that defines elegance. Curated collections for the discerning individual who values quality and style.",
    colors: {
      primary: "rgb(244, 63, 94)", // rose-500
      secondary: "rgb(168, 85, 247)", // violet-500
      accent: "rgb(251, 146, 60)", // orange-400
      background: "rgb(253, 242, 248)", // rose-50
      surface: "rgb(255, 255, 255)",
      text: "rgb(15, 23, 42)",
      textSecondary: "rgb(71, 85, 105)",
    },
    gradients: {
      primary: "from-rose-600 via-violet-600 to-rose-800",
      secondary: "from-violet-500 to-rose-600",
      hero: "from-rose-50 via-white to-violet-50",
    },
  },

  // Health/Wellness
  wellness: {
    ...defaultBrandConfig,
    name: "PureWellness",
    tagline: "Natural • Holistic • Transform Your Health",
    description: "Premium wellness products and services designed to enhance your natural vitality and well-being.",
    colors: {
      primary: "rgb(34, 197, 94)", // green-500
      secondary: "rgb(14, 165, 233)", // sky-500
      accent: "rgb(251, 146, 60)", // orange-400
      background: "rgb(240, 253, 244)", // green-50
      surface: "rgb(255, 255, 255)",
      text: "rgb(15, 23, 42)",
      textSecondary: "rgb(71, 85, 105)",
    },
    gradients: {
      primary: "from-green-600 via-teal-600 to-green-800",
      secondary: "from-green-500 to-teal-600",
      hero: "from-green-50 via-white to-teal-50",
    },
  },

  // Food/Restaurant
  food: {
    ...defaultBrandConfig,
    name: "Artisan Kitchen",
    tagline: "Fresh • Authentic • Crafted with Passion",
    description: "Exceptional culinary experiences crafted with the finest ingredients and time-honored techniques.",
    colors: {
      primary: "rgb(251, 146, 60)", // orange-400
      secondary: "rgb(239, 68, 68)", // red-500
      accent: "rgb(252, 211, 77)", // amber-300
      background: "rgb(255, 251, 235)", // amber-50
      surface: "rgb(255, 255, 255)",
      text: "rgb(15, 23, 42)",
      textSecondary: "rgb(71, 85, 105)",
    },
    gradients: {
      primary: "from-orange-600 via-red-600 to-orange-800",
      secondary: "from-orange-500 to-red-600",
      hero: "from-orange-50 via-white to-red-50",
    },
  },

  // Finance/Professional
  finance: {
    ...defaultBrandConfig,
    name: "PremiumWealth",
    tagline: "Trust • Expertise • Your Financial Future",
    description: "Sophisticated financial solutions tailored for discerning clients who demand excellence and results.",
    colors: {
      primary: "rgb(30, 58, 138)", // blue-900
      secondary: "rgb(55, 65, 81)", // gray-700
      accent: "rgb(34, 197, 94)", // green-500
      background: "rgb(248, 250, 252)", // slate-50
      surface: "rgb(255, 255, 255)",
      text: "rgb(15, 23, 42)",
      textSecondary: "rgb(71, 85, 105)",
    },
    gradients: {
      primary: "from-blue-900 via-gray-700 to-blue-900",
      secondary: "from-blue-800 to-gray-700",
      hero: "from-blue-50 via-white to-gray-50",
    },
  },
};

// Utility function to get current brand configuration
export function getBrandConfig(): BrandConfig {
  // In a real implementation, this could read from environment variables,
  // database, or configuration files
  const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE || 'default';
  return businessTemplates[businessType as keyof typeof businessTemplates] || defaultBrandConfig;
}

// CSS Custom Properties Generator
export function generateCSSVariables(config: BrandConfig = defaultBrandConfig): string {
  return `
    :root {
      --brand-primary: ${config.colors.primary};
      --brand-secondary: ${config.colors.secondary};
      --brand-accent: ${config.colors.accent};
      --brand-background: ${config.colors.background};
      --brand-surface: ${config.colors.surface};
      --brand-text: ${config.colors.text};
      --brand-text-secondary: ${config.colors.textSecondary};
      
      --font-primary: ${config.fonts.primary};
      --font-secondary: ${config.fonts.secondary};
      --font-display: ${config.fonts.display};
      
      --radius-small: ${config.borderRadius.small.replace('rounded-', '')};
      --radius-medium: ${config.borderRadius.medium.replace('rounded-', '')};
      --radius-large: ${config.borderRadius.large.replace('rounded-', '')};
      
      --shadow-small: ${config.shadows.small.replace('shadow-', '')};
      --shadow-medium: ${config.shadows.medium.replace('shadow-', '')};
      --shadow-large: ${config.shadows.large.replace('shadow-', '')};
    }
  `;
}
