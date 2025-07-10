"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { Loader } from "./ui/loader";

const VIDEOS = [
  "https://storage.googleapis.com/tiktok1234/DrAOFEp0lwdy.mp4",
  "https://storage.googleapis.com/tiktok1234/106SDb0KS7Oy.mp4",
  "https://storage.googleapis.com/tiktok1234/vLKlpV4GDlhN.mp4",
  "https://storage.googleapis.com/tiktok1234/o4aQ8Vwm4WeO.mp4",
  "https://storage.googleapis.com/tiktok1234/4UcMx4V-Gz9y.mp4",
  "https://storage.googleapis.com/tiktok1234/7qnJmdfCuEoz.mp4",
  "https://storage.googleapis.com/tiktok1234/a-_djWDxm-O61.mp4",
  "https://storage.googleapis.com/tiktok1234/Ko1SEcwQ9rTS.mp4",
];

type VideoStatus = "idle" | "loading" | "loaded" | "error";

interface VideoState {
  status: VideoStatus;
  retryCount: number;
}

const MAX_RETRIES = 3;
const LOAD_TIMEOUT = 10000; // 10 секунд

export default function VideoCarousel() {
  const [videoStates, setVideoStates] = useState<VideoState[]>(
    VIDEOS.map(() => ({ status: "idle", retryCount: 0 }))
  );
  const [queue, setQueue] = useState<number[]>(
    Array.from({ length: VIDEOS.length }, (_, i) => i)
  );
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isLoadingRef = useRef(false);

  const logEvent = useCallback(
    (index: number, event: string, details?: Record<string, any>) => {
      console.log(`[VideoCarousel][Video ${index}] ${event}`, {
        url: VIDEOS[index],
        timestamp: new Date().toISOString(),
        queue: queue,
        ...details,
      });
    },
    [queue]
  );

  const handleVideoLoaded = useCallback(
    (index: number) => {
      logEvent(index, "Loaded", { status: "loaded" });
      setVideoStates((prev) => {
        const newStates = [...prev];
        newStates[index] = { ...newStates[index], status: "loaded" };
        return newStates;
      });
      setQueue((prev) => prev.filter((i) => i !== index));
      isLoadingRef.current = false;
    },
    [logEvent]
  );

  const handleVideoError = useCallback(
    (index: number, error: Event | string) => {
      logEvent(index, "Error", {
        error: error.toString(),
        retryCount: videoStates[index].retryCount + 1,
      });
      setVideoStates((prev) => {
        const newStates = [...prev];
        const retryCount = newStates[index].retryCount + 1;
        newStates[index] = {
          status: retryCount < MAX_RETRIES ? "idle" : "error",
          retryCount,
        };
        return newStates;
      });
      setQueue((prev) => prev.filter((i) => i !== index));
      isLoadingRef.current = false;
    },
    [logEvent, videoStates]
  );

  const retryLoad = useCallback(
    (index: number) => {
      logEvent(index, "Retry", {
        retryCount: videoStates[index].retryCount + 1,
      });
      setVideoStates((prev) => {
        const newStates = [...prev];
        newStates[index] = {
          status: "idle",
          retryCount: newStates[index].retryCount,
        };
        return newStates;
      });
      setQueue((prev) => [...prev, index]);
    },
    [logEvent, videoStates]
  );

  const loadVideo = useCallback(
    (index: number) => {
      const videoElement = videoRefs.current[index];
      if (!videoElement) return;

      logEvent(index, "Load Start", { status: "loading" });
      setVideoStates((prev) => {
        const newStates = [...prev];
        newStates[index] = { ...newStates[index], status: "loading" };
        return newStates;
      });

      videoElement.src = VIDEOS[index];
      videoElement.preload = "auto";

      const timeout = setTimeout(() => {
        if (videoStates[index].status === "loading") {
          handleVideoError(index, "Load timeout");
        }
      }, LOAD_TIMEOUT);

      videoElement.onloadeddata = () => {
        clearTimeout(timeout);
        handleVideoLoaded(index);
      };
      videoElement.onerror = (e) => {
        clearTimeout(timeout);
        handleVideoError(index, e);
      };
      videoElement.load();
    },
    [handleVideoLoaded, handleVideoError, logEvent, videoStates]
  );

  const handleManualLoad = useCallback(
    (index: number) => {
      if (videoStates[index].status !== "idle") return;
      logEvent(index, "Manual Load Triggered");
      setQueue((prev) => [index, ...prev.filter((i) => i !== index)]);
    },
    [logEvent, videoStates]
  );

  useEffect(() => {
    if (isLoadingRef.current || queue.length === 0) return;

    const nextIndex = queue[0];
    if (videoStates[nextIndex].status === "idle") {
      isLoadingRef.current = true;
      loadVideo(nextIndex);
    }
  }, [queue, videoStates, loadVideo]);

  return (
    <>
      <h3 className="flex justify-center text-4xl md:text-5xl font-bold ">
        Made with ViralCuts
      </h3>
      <section className="py-16 bg-background">
        <div className="overflow-x-auto no-scrollbar px-4">
          <div className="flex gap-4 md:gap-6 md:justify-center min-w-[1000px] md:min-w-[1500px]">
            {VIDEOS.map((src, index) => (
              <motion.div
                initial={{ width: 160 }}
                animate={{ width: 160 }}
                whileHover={{ width: 400 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                key={index}
                className="relative rounded-xl bg-secondary/30 overflow-hidden h-[300px] md:h-[500px] flex-shrink-0 group"
                onClick={() => handleManualLoad(index)}
              >
                <div className="w-full h-full">
                  {videoStates[index].status === "loaded" ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={src}
                      controls
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out"
                    />
                  ) : videoStates[index].status === "error" ? (
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-red-500/30 text-white text-sm p-4">
                      <p>Failed to load video.</p>
                      {videoStates[index].retryCount < MAX_RETRIES && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            retryLoad(index);
                          }}
                          className="mt-2 px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary/80"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <Loader />
                    </div>
                  )}
                  {videoStates[index].status !== "loaded" && (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="hidden"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// 'use client'

// import { motion } from 'framer-motion'
// import { useEffect, useRef, useState } from 'react'
// import { Loader } from './ui/loader'

// const VIDEOS = [
// 	'https://storage.googleapis.com/tiktok1234/hI2fRz90j7GE.mp4',
// 	'https://storage.googleapis.com/tiktok1234/MZnM1cvk5a2_.mp4',
// 	'https://storage.googleapis.com/tiktok1234/NVLC54K_oipf.mp4',
// 	'https://storage.googleapis.com/tiktok1234/aJc-lm1k5T2P.mp4',
// 	'https://storage.googleapis.com/tiktok1234/co_BWF2tZoky.mp4',
// 	'https://storage.googleapis.com/tiktok1234/C3VsKF6leEtZ.mp4',
// 	'https://storage.googleapis.com/tiktok1234/u5pBSLCFHFUW.mp4',
// 	'https://storage.googleapis.com/tiktok1234/Ko1SEcwQ9rTS.mp4',
// ]

// export default function VideoCarousel() {
// 	const [loaded, setLoaded] = useState<boolean[]>(
// 		new Array(VIDEOS.length).fill(false)
// 	)
// 	const [error, setError] = useState<boolean[]>(
// 		new Array(VIDEOS.length).fill(false)
// 	)

// 	const handleVideoLoaded = (index: number) => {
// 		setLoaded(prev => {
// 			const newVideo = [...prev]
// 			newVideo[index] = true
// 			return newVideo
// 		})
// 	}

// 	const handleVideoError = (index: number) => {
// 		setError(prev => {
// 			const newErrors = [...prev]
// 			newErrors[index] = true
// 			return newErrors
// 		})
// 		setLoaded(prev => {
// 			const copy = [...prev]
// 			copy[index] = true
// 			return copy
// 		})
// 	}

// 	return (
// 		<section className='py-16 bg-background'>
// 			<div className='overflow-x-auto no-scrollbar px-4'>
// 				<div className='flex gap-4 md:gap-6 md:justify-center min-w-[1000px] md:min-w-[1500px]'>
// 					{VIDEOS.map((src, index) => (
// 						<motion.div
// 							key={index}
// 							initial={{ width: 160 }}
// 							animate={{ width: 160 }}
// 							whileHover={{ width: 400 }}
// 							transition={{ duration: 0.5, ease: 'easeInOut' }}
// 							className='relative rounded-xl bg-secondary/30 overflow-hidden h-[300px] md:h-[500px] flex-shrink-0 group'
// 						>
// 							<div className='w-full h-full'>
// 								{loaded[index] ? (
// 									error[index] ? (
// 										<div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-500/30 text-white text-sm p-4'>
// 											Ошибка загрузки видео
// 										</div>
// 									) : (
// 										<video
// 											src={src}
// 											controls
// 											preload='none'
// 											className='absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out'
// 											onLoadedData={() => handleVideoLoaded(index)}
// 											onError={() => handleVideoError(index)}
// 										/>
// 									)
// 								) : (
// 									<Loader />
// 								)}
// 							</div>
// 						</motion.div>
// 					))}
// 				</div>
// 			</div>
// 		</section>
// 	)
// }
