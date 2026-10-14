export type UserRole = 'ADMIN' | 'CREATOR' | 'PRODUCER' | 'CURATOR' | 'EDITOR';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  preferences?: {
    preferredPlatforms: string[];
    notificationsEnabled: boolean;
    theme: string;
  };
  createdAt: string;
}

export type IdeaStage = 'inbox' | 'developing' | 'ready' | 'production' | 'published';
export type IdeaPriority = 'low' | 'medium' | 'high';
export type TargetFormat = 'video' | 'short' | 'blog' | 'podcast' | 'carousel' | 'thread' | 'multi';

export interface Idea {
  _id: string;
  title: string;
  summary: string;
  stage: IdeaStage;
  priority: IdeaPriority;
  targetFormat: TargetFormat;
  tags: string[];
  notes?: string;
  aiRefinements?: {
    suggestedAngles: string[];
    targetAudienceInsights?: string;
    potentialHooks: string[];
  };
  attachedResearchIds?: Research[] | string[];
  sourceRef?: ExternalSource | string;
  audienceFeedbackRef?: AudienceFeedback | string;
  createdBy: User | string;
  assignedTo?: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalSource {
  _id: string;
  sourceId: string;
  title: string;
  url: string;
  platform: 'youtube' | 'reddit' | 'news' | 'trends' | 'other';
  summary?: string;
  author?: string;
  thumbnail?: string;
  publishedAt: string;
  metrics?: {
    upvotes?: number;
    views?: number;
    commentsCount?: number;
    sentimentScore?: number;
  };
  topicTags?: string[];
  isSaved: boolean;
  trendScore?: number;
  savedBy?: string[];
}

export interface Research {
  _id: string;
  title: string;
  url?: string;
  sourceName?: string;
  sourceType: any;
  content?: string;
  sourceUrl?: string;
  category?: string;
  _old_type: | 'article' | 'video' | 'discussion' | 'notes' | 'pdf';
  summary?: string;
  keyPoints?: string[];
  discussionInsights?: string[];
  rawContent?: string;
  notes?: string;
  tags?: string[];
  addedBy: User | string;
  attachedIdeaIds?: string[];
  sourceRef?: ExternalSource | string;
  createdAt: string;
}

export interface NarrativeBlock {
  blockType: 'hook' | 'context' | 'core_argument' | 'example' | 'takeaway' | 'cta' | 'custom';
  heading: string;
  content: string;
  durationSeconds?: number;
}

export interface ContentBlueprint {
  _id: string;
  title: string;
  hook: string;
  targetAudience: string;
  platform: string;
  format: string;
  narrativeBlocks: NarrativeBlock[];
  targetFormat?: string;
  estimatedDuration?: string | number;
  sections?: any[];
  productionRequirements?: {
    bRollSuggestions?: string[];
    visualStyleNotes?: string;
    estimatedDurationMinutes?: number;
    deadline?: string;
  };
  attachedResearchIds?: Research[] | string[];
  ideaId?: Idea | string;
  createdBy: User | string;
  assignedProducerId?: User | string;
  status: any;
  description?: string;
  tasks?: any[];
  _old_status: | 'sent_to_producer' | 'accepted' | 'in_production' | 'completed' | 'needs_revision';
  versionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedBy?: User | string;
}

export interface ContentVersion {
  _id: string;
  contentId: string;
  versionNumber: number;
  title?: string;
  notes?: string;
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'audio' | 'document' | 'text';
  mediaPublicId?: string;
  durationSeconds?: number;
  fileSize?: number;
  uploadedBy: User | string;
  checklist?: ChecklistItem[];
  isCurrent: boolean;
  createdAt: string;
}

export interface Content {
  _id: string;
  title: string;
  blueprintId?: ContentBlueprint | string;
  creatorId: User | string;
  producerId?: User | string;
  platform: string;
  format: string;
  currentVersionNumber: number;
  status: any;
  description?: string;
  tasks?: any[];
  _old_status: | 'in_production' | 'in_review' | 'revision_requested' | 'approved' | 'published';
  parentContentId?: Content | string | null;
  derivativeType: 'original' | 'short' | 'reel' | 'blog' | 'thread' | 'newsletter' | 'clip' | 'translation';
  reuseNotes?: string;
  reusableSections?: {
    title: string;
    content: string;
    originalAssetId?: string;
    timestampRange?: string;
  }[];
  tags?: string[];
  publishedUrl?: string;
  versions?: ContentVersion[];
  derivatives?: Content[];
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  _id: string;
  name: string;
  originalName: string;
  fileType: 'video' | 'image' | 'audio' | 'document';
  mimeType?: string;
  size?: number;
  url: string;
  publicId?: string;
  tags?: string[];
  uploadedBy: User | string;
  blueprintId?: string;
  contentId?: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  contentId: string;
  versionId: string;
  authorId: User;
  commentType: 'video_timestamp' | 'image_region' | 'text_selection' | 'general';
  timestampSec?: number;
  spatialCoord?: {
    xPercent: number;
    yPercent: number;
    boxWidth?: number;
    boxHeight?: number;
  };
  textSelection?: {
    selectedText: string;
    startIndex: number;
    endIndex: number;
  };
  body: string;
  resolved: boolean;
  resolvedBy?: User | string;
  resolvedAt?: string;
  parentCommentId?: string | null;
  createdAt: string;
}

export interface AudienceFeedback {
  _id: string;
  platform: 'youtube' | 'reddit' | 'twitter' | 'manual_submission' | 'community';
  authorName: string;
  authorAvatar?: string;
  content: string;
  sentiment: any;
  isQuestion: boolean;
  isContentRequest: boolean;
  sourceUrl?: string;
  upvotes: number;
  extractedTopic?: string;
  convertedToIdeaId?: Idea | string | null;
  status: any;
  sourcePlatform?: string;
  
  convertedToIdea?: any;
  _old_status: | 'reviewed' | 'converted' | 'archived';
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  recipientId: string;
  senderId?: User;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityItem {
  _id: string;
  actorId: User;
  actionType: string;
  entityType: string;
  entityId?: string;
  entityTitle: string;
  description: string;
  createdAt: string;
}

export type Feedback = AudienceFeedback;
export type Blueprint = ContentBlueprint;
export type ContentItem = Content;
export type Source = ExternalSource;
export type Activity = ActivityItem;
export type Notification = NotificationItem;
export type ResearchItem = Research;
export type ReviewComment = Comment;
