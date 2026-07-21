import {
  Bot,
  Brain,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Cloud,
  ExternalLink,
  Globe,
  GraduationCap,
  LayoutTemplate,
  Linkedin,
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

export const getServiceIcon = (iconName: ServiceItem['iconName'], className?: string) => {
  const Icon = serviceIcons[iconName];
  return <Icon className={className} aria-hidden="true" />;
};

export const LinkedinIcon = ({ className }: IconProps) => <Linkedin className={className} aria-hidden="true" />;
export const MailIcon = ({ className }: IconProps) => <Mail className={className} aria-hidden="true" />;
export const LocationIcon = ({ className }: IconProps) => <MapPin className={className} aria-hidden="true" />;
export const ArrowRightIcon = ({ className }: IconProps) => <ChevronRight className={className} aria-hidden="true" />;
export const ChevronDownIcon = ({ className }: IconProps) => <ChevronDown className={className} aria-hidden="true" />;
export const CloseIcon = ({ className }: IconProps) => <X className={className} aria-hidden="true" />;
export const MenuIcon = ({ className }: IconProps) => <Menu className={className} aria-hidden="true" />;
export const EducationIcon = ({ className }: IconProps) => <GraduationCap className={className} aria-hidden="true" />;
export const BriefcaseIcon = ({ className }: IconProps) => <Briefcase className={className} aria-hidden="true" />;
export const ExternalLinkIcon = ({ className }: IconProps) => <ExternalLink className={className} aria-hidden="true" />;
export const GlobeIcon = ({ className }: IconProps) => <Globe className={className} aria-hidden="true" />;
