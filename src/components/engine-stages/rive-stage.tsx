'use client';

import { useRive } from '@rive-app/react-canvas';

export default function RiveStage() {
  const { rive, RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/skills.riv',
    autoplay: true,
  });

  return (
    <div className="engine-rive-stage">
      <RiveComponent
        className="engine-rive-canvas"
        onPointerEnter={() => rive?.play()}
        onPointerLeave={() => rive?.pause()}
      />
      <div className="engine-rive-copy">
        <span>AGENT STATE / RUNNING</span>
        <strong>让界面回应状态，<br />而不只是播放装饰。</strong>
        <button type="button" onClick={() => (rive?.isPlaying ? rive.pause() : rive?.play())}>切换运行状态</button>
      </div>
    </div>
  );
}
