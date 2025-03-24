import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiRefreshCw, FiZoomIn, FiZoomOut } from "react-icons/fi";

interface ExpandableImageProps {
  src: string;
  alt: string;
  allowZoom?: boolean;
}

const ExpandableImage: React.FC<ExpandableImageProps> = ({
  src,
  alt,
  allowZoom = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const imageSrc =
    src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;

  const handleImageClick = () => {
    setIsExpanded(true);
    resetZoom();
  };

  const handleCloseModal = useCallback(() => {
    setIsExpanded(false);
    resetZoom();
  }, []);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.5, 1));
  };

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (scale > 1) {
        event.preventDefault();
        const sensitivity = 0.5;
        setPosition((prevPosition) => ({
          x: prevPosition.x - event.deltaX * sensitivity,
          y: prevPosition.y - event.deltaY * sensitivity,
        }));
      }
    },
    [scale],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        handleCloseModal();
      }
    },
    [isExpanded, handleCloseModal],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (isExpanded && container) {
      container.addEventListener("wheel", handleScroll, { passive: false });
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleScroll);
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded, handleScroll, handleKeyDown]);

  return (
    <>
      <div className="my-4 transition-opacity cursor-pointer hover:opacity-80">
        <Image
          src={imageSrc}
          alt={alt}
          width={800}
          height={600}
          onClick={handleImageClick}
          className="h-auto max-w-full mx-auto"
        />
      </div>
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={handleCloseModal}
        >
          <div
            ref={containerRef}
            className="relative overflow-hidden"
            style={{
              width: "90vw",
              height: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageSrc}
              alt={alt}
              fill
              className="object-contain w-full h-full transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${scale})`,
                cursor: allowZoom && scale > 1 ? "move" : "default",
                transformOrigin: "center",
                translate: `${position.x}px ${position.y}px`,
              }}
            />
            {allowZoom && (
              <div className="absolute flex space-x-2 bottom-4 right-4">
                <button
                  onClick={handleZoomIn}
                  className="p-2 transition-colors bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
                  aria-label="Zoom in"
                >
                  <FiZoomIn size={24} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 transition-colors bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
                  aria-label="Zoom out"
                >
                  <FiZoomOut size={24} />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-2 transition-colors bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
                  aria-label="Reset zoom"
                >
                  <FiRefreshCw size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ExpandableImage;
