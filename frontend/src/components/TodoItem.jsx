import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getShapeByIndex, getColorByIndex } from './Shapes';
import { Check } from 'lucide-react';

export const TodoItem = ({ todo, index, onDelete }) => {
  const controls = useAnimation();
  const Shape = getShapeByIndex(index);
  const bgColor = getColorByIndex(index);

  const handleDragEnd = (event, info) => {
    // 80px 이상 왼쪽으로 당기면 삭제 플로우
    if (info.offset.x < -80) {
      // 카드를 화면 바깥으로 확 넘기고 삭제를 호출
      controls.start({ x: -500, transition: { duration: 0.3 } }).then(() => {
        onDelete(todo._id, index);
      });
    } else {
      // 임계치 미달이면 되돌아감
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      // 카드가 사라질 때 높이를 완전히 줄여 주변 항목들이 자연스럽게 올라오게 함
      // 뒷배경과 카드가 '동시에' fade out 하도록 설정
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
      className="relative w-full h-24 mb-4"
    >
      {/* 카드 스와이프 시 나타나는 배경 레이어 (체크 박스) */}
      <div className="absolute inset-0 rounded-3xl bg-white/10 flex items-center justify-end px-8 z-0">
        <Check className="text-white w-10 h-10 stroke-[3px]" />
      </div>

      {/* 실제 드래그되는 전면 카드 */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }} 
        // 드래그 탄성을 조절하여 왼쪽으로 넘어갈 수 있게 함
        dragElastic={{ left: 1, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ backgroundColor: bgColor }}
        className="w-full h-full absolute inset-0 z-10 rounded-3xl flex items-center px-6 overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
      >
        {/* 좌측 텍스트 내용 */}
        <div className="flex-1 text-gray-900 font-bold text-xl truncate pr-20 z-10">
          {todo.title}
        </div>

        {/* 우측 디자인용 도형: 카드 위쪽에 거의 닿을 정도로 극대화 (w-44 h-44) */}
        <div 
          className="absolute right-2 bottom-0 w-44 h-44 opacity-90 pointer-events-none z-0"
          style={{ transform: 'translateY(50%)' }}
        >
          <Shape />
        </div>
      </motion.div>
    </motion.div>
  );
};
