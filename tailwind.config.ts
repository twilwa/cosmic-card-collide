// tailwind.config.js
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"], // Keep dark mode setup
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// --- Standard shadcn colors (using your definitions) ---
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))', // Is Corp Color (195 80% 50%)
					foreground: 'hsl(var(--primary-foreground))' // White text on primary? Adjusted
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))', // Is Runner Color (320 80% 60%)
					foreground: 'hsl(var(--secondary-foreground))' // White text on secondary
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))', // Red (0 70% 50%)
					foreground: 'hsl(var(--destructive-foreground))' // White text on destructive
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))', // Dark Gray (240 5% 20%)
					foreground: 'hsl(var(--muted-foreground))' // Lighter Gray (240 5% 65%)
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))', // Purple (265 80% 60%)
					foreground: 'hsl(var(--accent-foreground))' // White text on accent
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))', // Darker (240 10% 8%)
					foreground: 'hsl(var(--popover-foreground))' // Light Gray (0 0% 95%)
				},
				card: {
					DEFAULT: 'hsl(var(--card))', // Dark (240 10% 10%)
					foreground: 'hsl(var(--card-foreground))' // Light Gray (0 0% 95%)
				},
				// --- Cyberpunk Color Palette ---
				cyber: {
					corp: {
						DEFAULT: 'hsl(var(--cyber-corp-hsl))',
						foreground: 'hsl(var(--cyber-corp-text-contrast))',
						dim: 'hsla(var(--cyber-corp-hsl), 0.7)',
						glow: 'hsla(var(--cyber-corp-hsl), 0.6)',
					},
					runner: {
						DEFAULT: 'hsl(var(--cyber-runner-hsl))',
						foreground: 'hsl(var(--cyber-runner-text-contrast))',
						dim: 'hsla(var(--cyber-runner-hsl), 0.7)',
						glow: 'hsla(var(--cyber-runner-hsl), 0.6)',
					},
					neutral: {
						DEFAULT: 'hsl(var(--cyber-neutral-hsl))',
						foreground: 'hsl(var(--cyber-neutral-text-contrast))',
						dim: 'hsla(var(--cyber-neutral-hsl), 0.7)',
						glow: 'hsla(var(--cyber-neutral-hsl), 0.4)',
					},
					success: {
						DEFAULT: 'hsl(var(--cyber-success-hsl))',
						foreground: 'hsl(var(--cyber-success-text-contrast))',
					},
					warning: {
						DEFAULT: 'hsl(var(--cyber-warning-hsl))',
						foreground: 'hsl(var(--cyber-warning-text-contrast))',
					},
					danger: { // Alias for destructive
						DEFAULT: 'hsl(var(--destructive))',
						foreground: 'hsl(var(--destructive-foreground))',
					},
					'bg-dark': 'hsl(var(--cyber-bg-dark))',
					'bg-med': 'hsl(var(--cyber-bg-med))',
					'bg-light': 'hsl(var(--cyber-bg-light))',
					'border-color': 'hsl(var(--cyber-border-color))', // Specific cyber border color
				},
				// --- Sidebar Colors (Keep if using the sidebar component) ---
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				// --- Standard shadcn keyframes ---
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				// --- Cyberpunk Keyframes ---
				'pulse-glow-corp': {
					'0%, 100%': { boxShadow: '0 0 4px 1px hsla(var(--cyber-corp-hsl), 0.5)', opacity: '0.85' },
					'50%': { boxShadow: '0 0 10px 3px hsla(var(--cyber-corp-hsl), 0.7)', opacity: '1' },
				},
				'pulse-glow-runner': {
					'0%, 100%': { boxShadow: '0 0 4px 1px hsla(var(--cyber-runner-hsl), 0.5)', opacity: '0.85' },
					'50%': { boxShadow: '0 0 10px 3px hsla(var(--cyber-runner-hsl), 0.7)', opacity: '1' },
				},
				'pulse-glow-neutral': {
					'0%, 100%': { boxShadow: '0 0 3px 1px hsla(var(--cyber-neutral-hsl), 0.3)', opacity: '0.8' },
					'50%': { boxShadow: '0 0 6px 2px hsla(var(--cyber-neutral-hsl), 0.4)', opacity: '1' },
				},
				'scanning-line': {
					'0%': { top: '0%', opacity: '0.6' },
					'50%': { opacity: '0.1' },
					'100%': { top: '100%', opacity: '0.6' }
				},
				'flicker': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' },
				}
			},
			animation: {
				// --- Standard shadcn animations ---
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// --- Cyberpunk Animations ---
				'pulse-glow-corp': 'pulse-glow-corp 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'pulse-glow-runner': 'pulse-glow-runner 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'pulse-glow-neutral': 'pulse-glow-neutral 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'scanning-line': 'scanning-line 3s ease-in-out infinite',
				'flicker': 'flicker 1.5s infinite step-end',
			},
			boxShadow: { // Add direct glow utilities
				'glow-corp': '0 0 var(--cyber-glow-intensity, 8px) var(--cyber-glow-spread, 2px) hsla(var(--cyber-corp-hsl), 0.6)',
				'glow-runner': '0 0 var(--cyber-glow-intensity, 8px) var(--cyber-glow-spread, 2px) hsla(var(--cyber-runner-hsl), 0.6)',
				'glow-neutral': '0 0 calc(var(--cyber-glow-intensity, 8px) * 0.75) calc(var(--cyber-glow-spread, 2px) * 0.75) hsla(var(--cyber-neutral-hsl), 0.4)',
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/line-clamp")],
} satisfies Config;
