import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArticleImage } from './article-image';
import { ImageCompare } from './image-compare';
import { ImageGallery } from './image-gallery';
import { MediaFrame } from './media-frame';

const images = [
  { src: '/images/example-one.png', alt: '任务拆解前的界面', width: 1200, height: 800, caption: '拆解前' },
  { src: '/images/example-two.png', alt: '任务拆解后的界面', width: 1200, height: 800, caption: '拆解后' },
];

describe('article media components', () => {
  it('renders one semantic media frame with source and provenance', () => {
    const html = renderToStaticMarkup(
      <MediaFrame
        title="研究结果集中在三个来源"
        description="示例来源组合"
        source={{ label: '教学数据' }}
        status="illustrative"
        width="wide"
      >
        <div>figure</div>
      </MediaFrame>,
    );

    expect(html).toContain('<figure class="docs-media-frame"');
    expect(html).toContain('data-width="wide"');
    expect(html).toContain('教学数据');
    expect(html).toContain('示意');
  });

  it('renders an intrinsically sized image with a lightbox action', () => {
    const html = renderToStaticMarkup(
      <ArticleImage title="任务拆解界面" image={images[0]} source={{ label: '作者截图' }} />,
    );

    expect(html).toContain('width="1200"');
    expect(html).toContain('height="800"');
    expect(html).toContain('alt="任务拆解前的界面"');
    expect(html).toContain('aria-label="查看大图：任务拆解界面"');
    expect(html).toContain('<dialog');
  });

  it('renders a labelled gallery without automatic playback', () => {
    const html = renderToStaticMarkup(<ImageGallery title="任务拆解对比" images={images} />);

    expect(html).toContain('aria-label="图片组：任务拆解对比"');
    expect(html).toContain('aria-label="查看第 1 张：拆解前"');
    expect(html).not.toContain('autoplay');
  });

  it('keeps image comparison keyboard operable and both descriptions available', () => {
    const html = renderToStaticMarkup(
      <ImageCompare title="优化前后" before={images[0]} after={images[1]} />,
    );

    expect(html).toContain('type="range"');
    expect(html).toContain('aria-label="调整优化前后对比位置"');
    expect(html).toContain('任务拆解前的界面');
    expect(html).toContain('任务拆解后的界面');
  });
});
