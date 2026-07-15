'use client';

import Spline from '@splinetool/react-spline';

export default function SplineStage() {
  return (
    <div className="engine-spline-stage">
      <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      <div className="engine-overlay-copy"><span>REALTIME 3D</span><strong>拖动、旋转，<br />进入空间界面。</strong></div>
    </div>
  );
}
