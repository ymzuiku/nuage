import { useRef, useEffect, useState } from 'react';

function useGetSize(timeOut = 150) {
  const boxRef = useRef(void 0);
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!boxRef || !boxRef.current) {
      return;
    }

    let updateBoxSizeTimer = void 0;

    function updateBoxSize() {
      if (updateBoxSizeTimer) {
        clearTimeout(updateBoxSizeTimer);
      }
      updateBoxSizeTimer = setTimeout(() => {
        setBoxSize({ x: boxRef.current.x, y: boxRef.current.y, width: boxRef.current.offsetWidth, height: boxRef.current.offsetHeight });
        updateBoxSizeTimer = void 0;
      }, timeOut);
    }
    updateBoxSize();
    window.addEventListener('resize', updateBoxSize);
    return () => {
      window.removeEventListener('resize', updateBoxSize);
    };
  }, [boxRef, timeOut]);

  return [boxRef, boxSize];
}

export default useGetSize;
