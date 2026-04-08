import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Matter from 'matter-js';
import { getShapeByIndex } from './Shapes';

export const PhysicsCanvas = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const [bodiesData, setBodiesData] = useState([]);

  useEffect(() => {
    const { Engine, Runner, World, Bodies, Events } = Matter;
    
    const engine = Engine.create();
    engineRef.current = engine;
    
    const getBounds = () => {
      if (!containerRef.current) return { w: window.innerWidth, h: window.innerHeight * 0.25 };
      return {
        w: containerRef.current.clientWidth,
        h: containerRef.current.clientHeight
      };
    };

    const { w, h } = getBounds();
    const cardMaxWidth = Math.min(window.innerWidth, 576); 
    const startX = (window.innerWidth - cardMaxWidth) / 2;
    const endX = startX + cardMaxWidth;
    
    // 바닥을 화면 1/4 지점에 설정
    const ground = Bodies.rectangle(w / 2, h + 50, w * 2, 100, { isStatic: true });
    
    // 카드의 좌우 범위를 벽으로 세워서 밖으로 굴러가지 못하게 함
    const wallLeft = Bodies.rectangle(startX - 50, h / 2, 100, h * 3, { isStatic: true });
    const wallRight = Bodies.rectangle(endX + 50, h / 2, 100, h * 3, { isStatic: true });
    
    World.add(engine.world, [ground, wallLeft, wallRight]);
    
    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, 'afterUpdate', () => {
      // 바닥이나 벽을 제외하고, 생성된 커스텀 도형들만 추적
      const activeBodies = engine.world.bodies.filter(b => b.customIndex !== undefined);
      setBodiesData(
        activeBodies.map(b => ({
          id: b.id,
          x: b.position.x,
          y: b.position.y,
          angle: b.angle,
          index: b.customIndex,
          isFadingOut: !!b.isFadingOut
        }))
      );
    });

    const handleResize = () => {
      const bounds = getBounds();
      const currentCardMaxWidth = Math.min(window.innerWidth, 576); 
      const currentStartX = (window.innerWidth - currentCardMaxWidth) / 2;
      const currentEndX = currentStartX + currentCardMaxWidth;

      Matter.Body.setPosition(ground, { x: bounds.w / 2, y: bounds.h + 50 });
      Matter.Body.setPosition(wallLeft, { x: currentStartX - 50, y: bounds.h / 2 });
      Matter.Body.setPosition(wallRight, { x: currentEndX + 50, y: bounds.h / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    dropShape: (index) => {
      const { Bodies, World } = Matter;
      const themeIdx = index % 4;

      // 같은 색상(테마)의 기존 떨어져 있던 도형들을 찾아 서서히 지우는 처리
      const world = engineRef.current.world;
      const matchingBodies = world.bodies.filter(
        b => b.customIndex !== undefined && !b.isFadingOut && (b.customIndex % 4 === themeIdx)
      );
      
      matchingBodies.forEach(b => {
        b.isFadingOut = true;       // React 렌더링에 페이드아웃 상태 전달
        b.isSensor = true;          // 다른 도형과 부딪히지 않게 유령 상태로 변경
        Matter.Body.setStatic(b, true); // 그 자리에서 얼어붙음
        
        setTimeout(() => {
          Matter.World.remove(engineRef.current.world, b);
        }, 1000); // 1초 후 물리엔진 세계에서 완전히 제거
      });

      // 새로 떨어질 도형 위치 선정
      const cardMaxWidth = Math.min(window.innerWidth, 576); 
      const startX = (window.innerWidth - cardMaxWidth) / 2;
      const xPos = startX + 60 + Math.random() * (cardMaxWidth - 120);
      
      let body;
      const size = 35;
      
      if (index % 4 === 1) { // Hexagon
        body = Bodies.polygon(xPos, -80, 6, size + 5);
      } else if (index % 4 === 2) { // Clover
        body = Bodies.circle(xPos, -80, size + 5);
      } else { // Blue, Mint
        body = Bodies.rectangle(xPos, -80, size * 2, size * 2, { chamfer: { radius: 10 } });
      }
      
      body.customIndex = index;
      body.restitution = 0.5;
      body.friction = 0.5;
      body.density = 0.05;
      
      Matter.Body.setAngle(body, Math.random() * Math.PI * 2);
      World.add(engineRef.current.world, body);
    },
    clearShapes: () => {
      const world = engineRef.current.world;
      const dynamicBodies = world.bodies.filter(b => !b.isStatic);
      Matter.World.remove(world, dynamicBodies);
    },
    getShapeCount: () => {
      return engineRef.current.world.bodies.filter(b => !b.isStatic).length;
    }
  }));

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {bodiesData.map(b => {
        const Shape = getShapeByIndex(b.index);
        return (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              transform: `translate(-50%, -50%) rotate(${b.angle}rad)`,
              width: '80px',
              height: '80px',
              opacity: b.isFadingOut ? 0 : 1,
              transition: 'opacity 1s ease-out',
            }}
          >
            <Shape />
          </div>
        );
      })}
    </div>
  );
});
