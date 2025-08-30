
export enum Platform {
  LinkedIn = 'LinkedIn',
  Instagram = 'Instagram',
  X = 'X',
}

export enum PostType {
  Single = 'Single Image',
  Carousel = 'Carousel',
}

export interface GeneratedPost {
  platform: Platform;
  caption: string;
  hashtags: string[];
  images: string[]; // base64 encoded images
}

export interface GenerationRequest {
  prompt: string;
  platforms: Platform[];
  postType: PostType;
  numCarouselSlides: number;
  contextImage?: {
    base64: string;
    mimeType: string;
  };
}
