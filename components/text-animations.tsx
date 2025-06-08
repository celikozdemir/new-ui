// Collection of text appearance animation styles

export const textAnimations = {
  // Current: Smooth fade + slide up + scale
  slideUp: {
    appearing: "opacity-0 transform translate-y-4 scale-95",
    visible: "opacity-100 transform translate-y-0 scale-100",
    duration: "duration-500",
    easing: "ease-out",
  },

  // Option 1: Simple fade
  fade: {
    appearing: "opacity-0",
    visible: "opacity-100",
    duration: "duration-300",
    easing: "ease-in-out",
  },

  // Option 2: Bounce in (playful)
  bounce: {
    appearing: "opacity-0 transform scale-50",
    visible: "opacity-100 transform scale-100",
    duration: "duration-700",
    easing: "ease-out animate-bounce",
  },

  // Option 3: Elastic scale
  elastic: {
    appearing: "opacity-0 transform scale-0",
    visible: "opacity-100 transform scale-100",
    duration: "duration-600",
    easing: "ease-elastic",
  },

  // Option 4: Slide from bottom with overshoot
  slideBottom: {
    appearing: "opacity-0 transform translate-y-8 scale-90",
    visible: "opacity-100 transform translate-y-0 scale-100",
    duration: "duration-500",
    easing: "ease-spring",
  },

  // Option 5: Glow + fade
  glow: {
    appearing: "opacity-0 blur-sm",
    visible: "opacity-100 blur-none drop-shadow-lg",
    duration: "duration-400",
    easing: "ease-out",
  },

  // Option 6: LLM-style slide from left with fade (like ChatGPT)
  llmFade: {
    appearing: "opacity-0 transform translate-x-1",
    visible: "opacity-100 transform translate-x-0",
    duration: "duration-300",
    easing: "ease-out",
  },

  // Option 7: Slide from right
  slideRight: {
    appearing: "opacity-0 transform translate-x-8",
    visible: "opacity-100 transform translate-x-0",
    duration: "duration-400",
    easing: "ease-out",
  },

  // Option 8: Zoom + rotate (dynamic)
  zoomRotate: {
    appearing: "opacity-0 transform scale-75 rotate-2",
    visible: "opacity-100 transform scale-100 rotate-0",
    duration: "duration-500",
    easing: "ease-out",
  },

  // Option 9: Keynote-style wipe reveal (custom CSS needed)
  wipe: {
    appearing: "wipe-appearing",
    visible: "wipe-visible",
    duration: "duration-800",
    easing: "ease-in-out",
  },
};

// Helper function to get animation classes
export function getAnimationClasses(
  animationType: keyof typeof textAnimations = "slideUp",
  isAppearing: boolean
) {
  const animation = textAnimations[animationType];

  // For wipe animation, don't add transition classes since we handle it in CSS
  if (animationType === "wipe") {
    return isAppearing ? animation.appearing : animation.visible;
  }

  return `transition-all ${animation.duration} ${animation.easing} ${
    isAppearing ? animation.appearing : animation.visible
  }`;
}
