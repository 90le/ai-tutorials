import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArticleImage } from './article-image';
import { getNextComparePosition, ImageCompare } from './image-compare';
import { ImageGallery } from './image-gallery';
import { MediaFrame } from './media-frame';
import { ArticleVideo } from './article-video';
import { DataTable } from './data-table';
import { DownloadCard } from './download-card';
import { FormulaBlock } from './formula-block';

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
    expect(getNextComparePosition(50, 'ArrowRight')).toBe(51);
    expect(getNextComparePosition(0, 'ArrowLeft')).toBe(0);
    expect(getNextComparePosition(50, 'Home')).toBe(0);
    expect(getNextComparePosition(50, 'End')).toBe(100);
  });

  it('renders video with poster, captions and transcript without autoplay', () => {
    const html = renderToStaticMarkup(
      <ArticleVideo
        title="研究流程演示"
        src="/videos/research.mp4"
        poster="/images/research-poster.jpg"
        transcriptHref="/transcripts/research.txt"
        tracks={[{ src: '/captions/research-zh.vtt', srcLang: 'zh-CN', label: '中文字幕' }]}
      />,
    );

    expect(html).toContain('<video');
    expect(html).toContain('poster="/images/research-poster.jpg"');
    expect(html).toContain('<track');
    expect(html).toContain('文字稿');
    expect(html).not.toContain('autoplay');
  });

  it('renders copyable formula source and variable explanations', () => {
    const html = renderToStaticMarkup(
      <FormulaBlock title="效率增益" latex="G=(T_b-T_a)/T_b" variables={[{ symbol: 'G', meaning: '效率增益' }]}>
        <span>G = (T before - T after) / T before</span>
      </FormulaBlock>,
    );

    expect(html).toContain('data-latex="G=(T_b-T_a)/T_b"');
    expect(html).toContain('aria-label="复制 LaTeX"');
    expect(html).toContain('效率增益');
  });

  it('renders table headers, caption and an accessible data fallback', () => {
    const html = renderToStaticMarkup(
      <DataTable
        title="来源对比"
        columns={[{ key: 'source', label: '来源' }, { key: 'score', label: '评分', align: 'number' }]}
        rows={[{ source: '官方文档', score: 95 }]}
      />,
    );

    expect(html).toContain('<caption>来源对比</caption>');
    expect(html).toContain('scope="col"');
    expect(html).toContain('data-align="number"');
  });

  it('renders static attachment metadata and a direct download link', () => {
    const html = renderToStaticMarkup(
      <DownloadCard title="研究简报模板" href="/downloads/research-brief.md" format="Markdown" size="12 KB" updated="2026-07-16" />,
    );

    expect(html).toContain('download=""');
    expect(html).toContain('Markdown');
    expect(html).toContain('12 KB');
    expect(html).toContain('2026-07-16');
  });
});
