import {
  Bot,
  Brain,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Cloud,
  Download,
  ExternalLink,
  Globe,
  GraduationCap,
  LayoutTemplate,
  Mail,
  MapPin,
  Menu,
  Rocket,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ServiceItem } from '../types';

interface IconProps {
  className?: string;
}

const serviceIcons: Record<ServiceItem['iconName'], LucideIcon> = {
  Strategy: Brain,
  Architecture: LayoutTemplate,
  Cloud,
  Agile: Rocket,
  AI: Bot,
};

export const getServiceIcon = (
  iconName: ServiceItem['iconName'],
  className?: string,
) => {
  const Icon = serviceIcons[iconName];
  return <Icon className={className} aria-hidden="true" />;
};

export const LinkedinIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <Mail className={className} aria-hidden="true" />
);

export const LocationIcon = ({ className }: IconProps) => (
  <MapPin className={className} aria-hidden="true" />
);

export const ArrowRightIcon = ({ className }: IconProps) => (
  <ChevronRight className={className} aria-hidden="true" />
);

export const ChevronDownIcon = ({ className }: IconProps) => (
  <ChevronDown className={className} aria-hidden="true" />
);

export const CloseIcon = ({ className }: IconProps) => (
  <X className={className} aria-hidden="true" />
);

export const MenuIcon = ({ className }: IconProps) => (
  <Menu className={className} aria-hidden="true" />
);

export const EducationIcon = ({ className }: IconProps) => (
  <GraduationCap className={className} aria-hidden="true" />
);

export const BriefcaseIcon = ({ className }: IconProps) => (
  <Briefcase className={className} aria-hidden="true" />
);

export const ExternalLinkIcon = ({ className }: IconProps) => (
  <ExternalLink className={className} aria-hidden="true" />
);

export const GlobeIcon = ({ className }: IconProps) => (
  <Globe className={className} aria-hidden="true" />
);

export const DownloadIcon = ({ className }: IconProps) => (
  <Download className={className} aria-hidden="true" />
);
