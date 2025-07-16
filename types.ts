export interface ServiceCardData {
  id: number;
  image: string;
  title: string;
  description: string;
  longDescription: string;
  gallery: string[];
  deletedOn?: number;
  deletedGallery?: { url: string; deletedOn: number }[];
}

export interface SocialLink {
  id: number;
  name: string;
  url: string;
  iconUrl: string;
  deletedOn?: number;
}

export interface ContactInfoData {
  phone: string;
  email: string;
  address: string;
}

export interface HeroData {
  image: string;
  heading: string;
  subheading: string;
}

export interface ThemePalette {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  muted: string;
  'muted-foreground': string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;
  border: string;
  input: string;
  ring: string;
  // Component-specific overrides
  'header-top-bar-background'?: string;
  'header-top-bar-foreground'?: string;
  'header-main-background'?: string;
  'header-main-foreground'?: string;
  'footer-background'?: string;
  'footer-foreground'?: string;
  'hero-foreground'?: string;
  'hero-overlay'?: string;
}

export interface ThemeOptions {
  name: string;
  light: Partial<ThemePalette>;
  dark: Partial<ThemePalette>;
  deletedOn?: number;
}

export interface SiteContent {
  logo: {
    light: string;
    dark: string;
  };
  companyName: string;
  contact: ContactInfoData;
  socials: SocialLink[];
  hero: HeroData;
  services: ServiceCardData[];
  footer: {
    about: string;
    credit: string;
    creditLink?: string;
  };
  themes: ThemeOptions[];
  activeTheme: string;
}

export enum AuthLevel {
  NONE,
  ADMIN,
  DEV,
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}