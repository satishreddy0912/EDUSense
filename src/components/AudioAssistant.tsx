import { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Button,
} from '@/components/ui/button';

import {
  Badge,
} from '@/components/ui/badge';

type AudioAssistantProps = {
  onActivityChange: (value: number) => void;
};

export default function AudioAssistant({
  onActivityChange,
}: AudioAssistantProps) {
  const streamRef =
    useRef<MediaStream | null>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const [active, setActive] =
    useState(false);

  const [activity, setActivity] =
    useState(0);

  const [error, setError] =
    useState('');

  const stopAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current
        .close()
        .catch(() => {});

      audioContextRef.current = null;
    }

    analyserRef.current = null;

    setActive(false);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const analyzeAudio = () => {
    const analyser =
      analyserRef.current;

    if (!analyser) return;

    const data =
      new Uint8Array(
        analyser.fftSize
      );

    analyser.getByteTimeDomainData(
      data
    );

    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      const normalized =
        (data[i] - 128) / 128;

      sum +=
        normalized * normalized;
    }

    const rms =
      Math.sqrt(sum / data.length);

    const calculatedActivity =
      Math.round(
        Math.min(
          100,
          Math.max(
            0,
            rms * 450
          )
        )
      );

    setActivity(
      calculatedActivity
    );

    onActivityChange(
      calculatedActivity
    );

    animationRef.current =
      requestAnimationFrame(
        analyzeAudio
      );
  };

  const startAudio = async () => {
    setError('');

    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setError(
          'Microphone access is not supported by this browser.'
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });

      streamRef.current =
        stream;

      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error(
          'Web Audio API unavailable'
        );
      }

      const audioContext =
        new AudioContextClass();

      await audioContext.resume();

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      const analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant =
        0.7;

      source.connect(analyser);

      audioContextRef.current =
        audioContext;

      analyserRef.current =
        analyser;

      setActive(true);

      animationRef.current =
        requestAnimationFrame(
          analyzeAudio
        );
    } catch (audioError) {
      console.error(audioError);

      setError(
        'Microphone permission was denied or the microphone is unavailable.'
      );

      stopAudio();
    }
  };

  const getParticipationLabel = () => {
    if (activity < 30) return 'Low';
    if (activity < 65) return 'Moderate';
    return 'High';
  };

  return (
    <Card className="glass overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-accent" />
              Classroom Audio
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Real-time classroom audio activity
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
            {active ? 'LISTENING' : 'OFF'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex h-36 items-center justify-center rounded-2xl bg-muted/20">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              {active ? (
                <Volume2 className="h-8 w-8 animate-pulse text-accent" />
              ) : (
                <MicOff className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Participation signal
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Audio Activity
            </p>

            <p className="text-2xl font-bold">
              {activity}%
            </p>

            <p className="text-xs text-muted-foreground">
              Participation: {getParticipationLabel()}
            </p>
          </div>

          {!active ? (
            <Button
              size="sm"
              onClick={startAudio}
            >
              <Mic className="mr-2 h-4 w-4" />
              Enable Microphone
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={stopAudio}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}
        </div>

        <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
          This measures classroom audio activity. It does
          not record or transcribe conversations.
        </p>
      </CardContent>
    </Card>
  );
}