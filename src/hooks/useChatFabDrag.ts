import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from 'react';

const FAB_SIZE = 56;
const DRAG_THRESHOLD = 8;

type FabPos = { right: number; bottom: number };

type UseChatFabDragOptions = {
  defaultRight: number;
  defaultBottom: number;
  shellRef: RefObject<HTMLDivElement | null>;
  onClick: () => void;
};

export function useChatFabDrag({
  defaultRight,
  defaultBottom,
  shellRef,
  onClick,
}: UseChatFabDragOptions) {
  const [fabPos, setFabPos] = useState<FabPos>({
    right: defaultRight,
    bottom: defaultBottom,
  });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originRight: number;
    originBottom: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    setFabPos({ right: defaultRight, bottom: defaultBottom });
  }, [defaultRight, defaultBottom]);

  const onPointerDown = (e: PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originRight: fabPos.right,
      originBottom: fabPos.bottom,
      moved: false,
    };
  };

  const onPointerMove = (e: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      drag.moved = true;
    }
    if (!drag.moved) return;
    const maxW = shellRef.current?.clientWidth ?? 480;
    const maxH = shellRef.current?.clientHeight ?? window.innerHeight;
    setFabPos({
      right: Math.min(Math.max(8, drag.originRight - dx), maxW - FAB_SIZE - 8),
      bottom: Math.min(
        Math.max(8, drag.originBottom - dy),
        maxH - FAB_SIZE - 8,
      ),
    });
  };

  const onPointerUp = (e: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const wasClick = !drag.moved;
    dragRef.current = null;
    if (wasClick) onClick();
  };

  return {
    fabPos,
    fabSize: FAB_SIZE,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
