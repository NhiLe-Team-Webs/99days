import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';

const GallerySection = () => {
  const reviewImages = useMemo(
    () =>
      Array.from({ length: 27 }, (_, index) => ({
        src: `/reviews/review${index + 1}.png`,
        alt: `Khoảnh khắc ${index + 1}`,
      })),
    []
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isLightboxOpen = activeIndex !== null;
  const touchStartX = useRef<number | null>(null);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % reviewImages.length;
    });
  }, [reviewImages.length]);

  const showPrevious = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + reviewImages.length) % reviewImages.length;
    });
  }, [reviewImages.length]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowRight') {
        showNext();
      } else if (event.key === 'ArrowLeft') {
        showPrevious();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeLightbox, isLightboxOpen, showNext, showPrevious]);

  const handleTouchStart = useCallback((event: ReactTouchEvent<HTMLImageElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: ReactTouchEvent<HTMLImageElement>) => {
      if (touchStartX.current === null) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
      const delta = endX - touchStartX.current;

      if (delta > 50) {
        showPrevious();
      } else if (delta < -50) {
        showNext();
      }

      touchStartX.current = null;
    },
    [showNext, showPrevious]
  );

  const handleBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closeLightbox();
      }
    },
    [closeLightbox]
  );

  const PREVIEW_COLUMNS = 5;
  const PREVIEW_ROWS = 4;
  const PREVIEW_COUNT = PREVIEW_COLUMNS * PREVIEW_ROWS;
  const previewImages = reviewImages.slice(0, PREVIEW_COUNT);
  const remainingCount = Math.max(0, reviewImages.length - PREVIEW_COUNT);

  return (
    <section id="hanh-trinh" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Kho Lưu Giữ Hành Trình</h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Đồng hành cùng nhau trên hành trình 99 ngày. Cùng nhìn lại và tiếp thêm động lực!
          </p>
        </div>

        <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="rounded-3xl bg-white p-4 shadow-xl sm:p-5 md:p-6">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${PREVIEW_COLUMNS}, minmax(0, 1fr))`,
              }}
            >
              {previewImages.map((image, index) => {
                const isOverlayCell = index === previewImages.length - 1 && remainingCount > 0;
                const targetIndex = isOverlayCell && remainingCount > 0 ? PREVIEW_COUNT : index;

                return (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveIndex(targetIndex >= reviewImages.length ? reviewImages.length - 1 : targetIndex)}
                    className="group relative overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    aria-label={`Xem chi tiết ${image.alt}`}
                  >
                    <div className="aspect-square w-full">
                      <img
                        className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                      />
                    </div>
                    {isOverlayCell ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="text-center text-white">
                          <span className="block text-4xl font-semibold">+{remainingCount}</span>
                          <span className="mt-2 block text-xs uppercase tracking-wide text-white/80">
                            Ảnh khác
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Lan tỏa câu chuyện của bạn</h3>
          <p className="text-gray-600 mb-4">
            Chia sẻ hành trình của bạn với các hashtag{' '}
            <span className="font-semibold text-primary">
              #NhiLe #NhiLeTeam #NhiLeFoundation #99dayswithnhile
            </span>{' '}
            để gây dựng động lực cho cộng đồng.
          </p>
          <h4 className="text-lg font-semibold mt-6 mb-2">Lưu ý về bản quyền và sử dụng tài nguyên</h4>
          <p className="text-gray-600 text-sm">
            Bạn được sử dụng hình ảnh và video cho mục đích cá nhân. Vui lòng liên hệ{' '}
            <a href="mailto:99days@nhi.sg" className="text-primary hover:underline">
              99days@nhi.sg
            </a>{' '}
            nếu cần hỗ trợ thêm trước khi chia sẻ cho mục đích thương mại.
          </p>
        </div>
      </div>

      {isLightboxOpen && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close gallery"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="flex w-full max-w-6xl items-center gap-6">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-14 sm:w-14"
              aria-label="Xem ảnh trước"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1">
              <img
                src={reviewImages[activeIndex].src}
                alt={reviewImages[activeIndex].alt}
                className="mx-auto max-h-[80vh] w-full max-w-full rounded-2xl object-contain shadow-2xl"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />
              <p className="mt-4 text-center text-sm text-white/80">
                {activeIndex + 1} / {reviewImages.length}
              </p>
            </div>

            <button
              type="button"
              onClick={showNext}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-14 sm:w-14"
              aria-label="Xem ảnh tiếp theo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
