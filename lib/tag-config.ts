// Configuration for the animated string tag
// Easy to modify for different placements or to disable

export const tagConfig = {
  // Enable/disable the tag globally
  enabled: true,
  
  // Position options: 'fixed-top-right' | 'hero-floating' | 'hero-corner' | 'disabled'
  position: 'fixed-top-right' as const,
  
  // Size options: 'sm' | 'md' | 'lg'
  size: 'md' as const,
  
  // Animation settings
  autoRotate: true,
  autoRotateSpeed: 0.5,
  
  // Position coordinates for different placements
  positions: {
    'fixed-top-right': 'fixed top-20 right-8 z-30',
    'hero-floating': 'absolute top-10 right-10 z-20',
    'hero-corner': 'absolute top-4 right-4 z-20',
    'disabled': 'hidden'
  }
}

export type TagPosition = keyof typeof tagConfig.positions
