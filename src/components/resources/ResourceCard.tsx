import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Music,
  Image,
  Video,
  FileText,
  FileAudio,
  Check,
  Heart,
} from 'lucide-react';
import { Resource } from '@/types/resources';
import { cn } from '@/lib/utils';
import { useHeartedResources } from '@/hooks/useHeartedResources';

interface ResourceCardProps {
  resource: Resource;
  downloadCount: number;
  onClick: (resource: Resource) => void;
}

const ResourceCard = ({ resource, downloadCount, onClick }: ResourceCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { isHearted, toggleHeart } = useHeartedResources();

  const getPreviewUrl = (resource: Resource) => {
    const titleLowered = resource.title.toLowerCase().replace(/ /g, '%20');
    const basePath = 'https://raw.githubusercontent.com/Yxmura/resources_renderdragon/main';
    const creditPart = resource.credit ? `__${resource.credit.replace(/ /g, '_')}` : '';
    return `${basePath}/${resource.category}/${titleLowered}${creditPart}.${resource.filetype}`;
  };

  useEffect(() => {
    if (resource.category !== 'fonts') return;

    const titleLowered = resource.title.toLowerCase().replace(/ /g, '%20');
    const creditPart = resource.credit ? `__${encodeURIComponent(resource.credit)}` : '';
    const fontUrl = `https://raw.githubusercontent.com/Yxmura/resources_renderdragon/main/${resource.category}/${titleLowered}${creditPart}.${resource.filetype}`;

    const font = new FontFace(resource.title, `url(${fontUrl})`);
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
      })
      .catch((err) => {
        console.error(`Failed to load font "${resource.title}":`, err);
      });
  }, [resource]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music':
        return <Music className="h-5 w-5" />;
      case 'sfx':
        return <FileAudio className="h-5 w-5" />;
      case 'images':
        return <Image className="h-5 w-5" />;
      case 'animations':
        return <Video className="h-5 w-5" />;
      case 'fonts':
      case 'presets':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music':
        return 'bg-blue-500/10 text-blue-500';
      case 'sfx':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'images':
        return 'bg-purple-500/10 text-purple-500';
      case 'animations':
        return 'bg-red-500/10 text-red-500';
      case 'fonts':
        return 'bg-green-500/10 text-green-500';
      case 'presets':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const renderPreview = () => {
    const previewUrl = getPreviewUrl(resource);

    switch (resource.category) {
      case 'images':
        return (
          <div className="relative aspect-video bg-muted/20 rounded-md overflow-hidden mb-3">
            <img
              src={previewUrl}
              alt={resource.title}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setIsImageLoaded(true)}
              loading="lazy"
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        );
      case 'fonts':
        return (
          <div className="relative aspect-[4/1] bg-muted/20 rounded-md overflow-hidden mb-3">
            <div
              className="absolute inset-0 flex items-center justify-center text-lg font-medium"
              style={{ fontFamily: resource.title }}
            >
              Aa Bb Cc
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onClick(resource)}
      className="pixel-card group cursor-pointer hover:border-primary transition-all duration-300 h-full"
    >
      {renderPreview()}

      <div className="flex justify-between items-start mb-3">
        <div
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${getCategoryColor(resource.category)}`}
        >
          {getCategoryIcon(resource.category)}
          <span className="ml-1 capitalize">{resource.category}</span>
          {resource.subcategory && (
            <span className="ml-1">({resource.subcategory})</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleHeart(resource.id);
          }}
          className={cn(
            "p-1 rounded-full transition-colors",
            isHearted(resource.id)
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-red-500"
          )}
        >
          <Heart className="h-5 w-5" fill={isHearted(resource.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="text-xl font-vt323 mb-2 group-hover:text-primary transition-colors">
        {resource.title}
      </h3>

      <div className="flex items-center justify-between">
        {resource.credit ? (
          <div className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md inline-flex items-center">
            <span>Credit required</span>
          </div>
        ) : (
          <div className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-md inline-flex items-center">
            <Check className="h-3 w-3 mr-1" />
            <span>No credit needed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;