import React from 'react';
import {
  Layers,
  Brain,
  BarChart3,
  Cpu,
  Wrench,
  BookOpen,
  Shield,
  Code2,
  Briefcase,
  GraduationCap,
  Laptop,
  FolderGit2,
  MessageCircle,
  MessagesSquare,
  MessageSquare,
  MessageSquareText,
  type LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  layers: Layers,
  brain: Brain,
  chart: BarChart3,
  barchart: BarChart3,
  barchart3: BarChart3,
  'bar-chart': BarChart3,
  'bar-chart-3': BarChart3,
  cpu: Cpu,
  wrench: Wrench,
  bookopen: BookOpen,
  'book-open': BookOpen,
  messagecircle: MessageCircle,
  'message-circle': MessageCircle,
  messagessquare: MessagesSquare,
  'messages-square': MessagesSquare,
  messagesquare: MessageSquare,
  'message-square': MessageSquare,
  messagesquaretext: MessageSquareText,
  'message-square-text': MessageSquareText,
  speech: MessageCircle,
  conversation: MessageCircle,
  communication: MessageCircle,
  englishmirror: MessageCircle,
  'english-mirror': MessageCircle,
  languages: MessageCircle,
  language: MessageCircle,
  shield: Shield,
  code: Code2,
  code2: Code2,
  briefcase: Briefcase,
  graduationcap: GraduationCap,
  'graduation-cap': GraduationCap,
  laptop: Laptop,
  foldergit: FolderGit2,
  'folder-git': FolderGit2
};

export function getCategoryIconComponent(iconName?: string | null): LucideIcon {
  if (!iconName) return Layers;
  const normalized = iconName.toLowerCase().trim().replace(/_/g, '-');
  return ICON_MAP[normalized] || Layers;
}

export function getCategoryIcon(iconName?: string | null, className: string = 'w-4 h-4'): React.ReactElement {
  const IconComp = getCategoryIconComponent(iconName);
  return <IconComp className={className} />;
}

