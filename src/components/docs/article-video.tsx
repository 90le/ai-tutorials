import { MediaFrame, type MediaSource, type MediaStatus } from './media-frame';

interface VideoTrack {
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

export function ArticleVideo({
  title,
  description,
  src,
  poster,
  tracks = [],
  transcriptHref,
  source,
  status = 'verified',
}: {
  title: string;
  description?: string;
  src: string;
  poster: string;
  tracks?: readonly VideoTrack[];
  transcriptHref: string;
  source?: MediaSource;
  status?: MediaStatus;
}) {
  return (
    <MediaFrame title={title} description={description} source={source} status={status} width="wide" className="docs-article-video">
      <video controls preload="none" playsInline poster={poster} aria-label={title}>
        <source src={src} />
        {tracks.map((track) => (
          <track
            key={`${track.src}-${track.srcLang}`}
            kind="subtitles"
            src={track.src}
            srcLang={track.srcLang}
            label={track.label}
            default={track.default}
          />
        ))}
        当前浏览器无法播放该视频。
      </video>
      <div className="docs-video-fallback">
        <span>视频无法播放或希望快速检索内容？</span>
        <a href={transcriptHref}>阅读文字稿</a>
        <a href={src}>打开视频文件</a>
      </div>
    </MediaFrame>
  );
}
