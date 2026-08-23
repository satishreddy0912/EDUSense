import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type CameraAssistantProps = {
  onActivityChange: (value: number) => void;
};

export default function CameraAssistant({
  onActivityChange,
}: CameraAssistantProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const previousFrameRef =
    useRef<Uint8ClampedArray | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const [active, setActive] = useState(false);
  const [activity, setActivity] = useState(0);
  const [error, setError] = useState('');
  const [requesting, setRequesting] = useState(false);

  /*
   * =========================================================
   * STOP CAMERA
   * =========================================================
   */

  const stopCamera = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    previousFrameRef.current = null;

    setActive(false);
    setActivity(0);
    onActivityChange(0);
  };

  /*
   * =========================================================
   * CLEANUP
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  /*
   * =========================================================
   * FRAME ANALYSIS
   * =========================================================
   */

  const analyzeFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      video.readyState < 2
    ) {
      animationRef.current =
        requestAnimationFrame(analyzeFrame);

      return;
    }

    const width = 160;
    const height = 90;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d', {
      willReadFrequently: true,
    });

    if (!context) {
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    const currentFrame =
      context.getImageData(
        0,
        0,
        width,
        height
      ).data;

    if (previousFrameRef.current) {
      let difference = 0;

      for (
        let i = 0;
        i < currentFrame.length;
        i += 4
      ) {
        difference +=
          Math.abs(
            currentFrame[i] -
              previousFrameRef.current[i]
          ) +
          Math.abs(
            currentFrame[i + 1] -
              previousFrameRef.current[i + 1]
          ) +
          Math.abs(
            currentFrame[i + 2] -
              previousFrameRef.current[i + 2]
          );
      }

      const averageDifference =
        difference /
        ((width * height) * 3);

      const calculatedActivity = Math.round(
        Math.min(
          100,
          Math.max(
            20,
            averageDifference * 7
          )
        )
      );

      setActivity(calculatedActivity);
      onActivityChange(calculatedActivity);
    }

    previousFrameRef.current =
      new Uint8ClampedArray(currentFrame);

    animationRef.current =
      requestAnimationFrame(analyzeFrame);
  };

  /*
   * =========================================================
   * CAMERA PERMISSION
   * =========================================================
   */

  const startCamera = async () => {
    setError('');
    setRequesting(true);

    try {
      /*
       * Check browser support.
       */

      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          'Your browser does not support camera access.'
        );
      }

      /*
       * Camera requires HTTPS or localhost.
       */

      if (
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
      ) {
        throw new Error(
          'Camera access requires HTTPS. Open the deployed HTTPS URL or run the project on localhost.'
        );
      }

      /*
       * Request camera permission.
       *
       * IMPORTANT:
       * This MUST happen directly after clicking
       * the Enable Camera button.
       */

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

      /*
       * Store stream.
       */

      streamRef.current = stream;

      /*
       * Attach stream to video.
       */

      const video = videoRef.current;

      if (!video) {
        throw new Error(
          'Camera preview could not be initialized.'
        );
      }

      video.srcObject = stream;

      /*
       * Make sure the video is visible.
       */

      video.muted = true;
      video.playsInline = true;

      await video.play();

      /*
       * Camera is successfully active.
       */

      setActive(true);
      setRequesting(false);
      setError('');

      previousFrameRef.current = null;

      animationRef.current =
        requestAnimationFrame(analyzeFrame);
    } catch (cameraError) {
      console.error(
        'Camera error:',
        cameraError
      );

      setRequesting(false);
      setActive(false);

      if (
        cameraError instanceof DOMException
      ) {
        switch (cameraError.name) {
          case 'NotAllowedError':
            setError(
              'Camera permission was blocked. Please allow camera access in your browser/site settings and try again.'
            );
            break;

          case 'NotFoundError':
            setError(
              'No camera was found on this device.'
            );
            break;

          case 'NotReadableError':
            setError(
              'The camera is already being used by another application.'
            );
            break;

          case 'SecurityError':
            setError(
              'Camera access was blocked by the browser security policy.'
            );
            break;

          case 'AbortError':
            setError(
              'Camera initialization was interrupted. Please try again.'
            );
            break;

          default:
            setError(
              `Camera error: ${cameraError.name}`
            );
        }
      } else if (
        cameraError instanceof Error
      ) {
        setError(cameraError.message);
      } else {
        setError(
          'Unable to access the camera.'
        );
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }
    }
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <Card className="glass overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Classroom Camera
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Real-time visual activity signal
            </p>
          </div>

          <Badge
            variant="outline"
            className={
              active
                ? 'border-success/30 bg-success/10 text-success'
                : ''
            }
          >
            {active ? 'LIVE' : 'OFF'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />

          {!active && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20">
              <CameraOff className="mb-3 h-8 w-8 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Camera is currently disabled
              </p>
            </div>
          )}

          {active && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              Camera active
            </div>
          )}
        </div>

        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {error && (
          <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p className="font-semibold">
                  Camera access problem
                </p>

                <p className="mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Visual Activity
            </p>

            <p className="text-2xl font-bold">
              {activity}%
            </p>
          </div>

          <div>
            {!active ? (
              <Button
                size="sm"
                onClick={startCamera}
                disabled={requesting}
              >
                <Camera className="mr-2 h-4 w-4" />

                {requesting
                  ? 'Requesting...'
                  : 'Enable Camera'}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={stopCamera}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
          This signal measures visual frame activity only.
          It does not identify students or determine
          emotions.
        </p>
      </CardContent>
    </Card>
  );
}