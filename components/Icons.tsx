import React from 'react';
import { 
  Brain, 
  Cloud, 
  Code2, 
  Rocket, 
  Linkedin, 
  Mail, 
  MapPin, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  X,
  Send,
  Menu,
  LayoutTemplate, // For Enterprise Architecture
  Bot,
  Quote,
  Briefcase,
  GraduationCap,
  BarChart3
} from 'lucide-react';

export const StrategyIcon = ({ className }: { className?: string }) => <Brain className={className} />;
export const ArchitectureIcon = ({ className }: { className?: string }) => <LayoutTemplate className={className} />;
export const CloudIcon = ({ className }: { className?: string }) => <Cloud className={className} />;
export const AgileIcon = ({ className }: { className?: string }) => <Rocket className={className} />;
export const AIIcon = ({ className }: { className?: string }) => <Bot className={className} />;

export const LinkedinIcon = ({ className }: { className?: string }) => <Linkedin className={className} />;
export const MailIcon = ({ className }: { className?: string }) => <Mail className={className} />;
export const LocationIcon = ({ className }: { className?: string }) => <MapPin className={className} />;
export const ArrowRightIcon = ({ className }: { className?: string }) => <ChevronRight className={className} />;
export const ChevronDownIcon = ({ className }: { className?: string }) => <ChevronDown className={className} />;
export const ChevronUpIcon = ({ className }: { className?: string }) => <ChevronUp className={className} />;
export const ChatIcon = ({ className }: { className?: string }) => <MessageSquare className={className} />;
export const CloseIcon = ({ className }: { className?: string }) => <X className={className} />;
export const SendIcon = ({ className }: { className?: string }) => <Send className={className} />;
export const MenuIcon = ({ className }: { className?: string }) => <Menu className={className} />;
export const CodeIcon = ({ className }: { className?: string }) => <Code2 className={className} />;
export const QuoteIcon = ({ className }: { className?: string }) => <Quote className={className} />;
export const EducationIcon = ({ className }: { className?: string }) => <GraduationCap className={className} />;
export const BriefcaseIcon = ({ className }: { className?: string }) => <Briefcase className={className} />;
export const ChartIcon = ({ className }: { className?: string }) => <BarChart3 className={className} />;

export const getServiceIcon = (iconName: string, className?: string) => {
  switch (iconName) {
    case 'Strategy': return <StrategyIcon className={className} />;
    case 'Architecture': return <ArchitectureIcon className={className} />;
    case 'Cloud': return <CloudIcon className={className} />;
    case 'Agile': return <AgileIcon className={className} />;
    case 'AI': return <AIIcon className={className} />;
    default: return <CodeIcon className={className} />;
  }
};
