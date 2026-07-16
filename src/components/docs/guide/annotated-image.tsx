import Image from 'next/image';

type Annotation = { x: number; y: number; label: string; description: string };

export function AnnotatedImage({ title, image, annotations }: { title: string; image: { src: string; alt: string; width?: number; height?: number }; annotations: Annotation[] }) {
  return <figure className="docs-guide-card docs-annotated-image">
    <figcaption>{title}</figcaption>
    <div className="docs-annotation-stage">
      <Image src={image.src} alt={image.alt} width={image.width ?? 1200} height={image.height ?? 720} />
      {annotations.map((annotation, index) => <a href={`#annotation-${index + 1}`} style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }} aria-label={`${index + 1}：${annotation.label}`} key={annotation.label}>{index + 1}</a>)}
    </div>
    <ol>{annotations.map((annotation, index) => <li id={`annotation-${index + 1}`} key={annotation.label}><strong>{annotation.label}</strong><span>{annotation.description}</span></li>)}</ol>
  </figure>;
}
