interface LoomEmbedProps {
  videoId: string;
  sid?: string;
  className?: string;
  aspectRatio?: string;
}

export default function LoomEmbed({ 
  videoId, 
  sid, 
  className = "",
  aspectRatio = "pb-[64.63195691202873%]" 
}: LoomEmbedProps) {
  const embedUrl = `https://www.loom.com/embed/${videoId}${sid ? `?sid=${sid}` : ''}`;
  
  return (
    <div className={`relative h-0 w-full ${aspectRatio} ${className}`}>
      <iframe 
        src={embedUrl}
        frameBorder="0" 
        // @ts-ignore
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}
