'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mic, Square, Loader2, Languages } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  startAudioRecording,
  stopAudioRecording,
  processAudioFile,
} from '@/app/api/api';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [translatedAudioURL, setTranslatedAudioURL] = useState<string | null>(
    null
  );
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [progress, setProgress] = useState(0);
  const [targetLanguage, setTargetLanguage] = useState('hi'); // Default to Hindi
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordingComplete(false);
    setProcessingComplete(false);
    setAudioURL(null);
    setTranslatedAudioURL(null);
    setTranscription('');
    setTranslation('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordingComplete(true);
      };

      mediaRecorder.start();
      startAudioRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      stopAudioRecording();
      setIsRecording(false);

      // Stop all audio tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const processAudio = async () => {
    try {
      setIsProcessing(true);
      setProgress(10); // Initial progress

      const response = await processAudioFile('en', targetLanguage);
      if (!response) {
        throw new Error('No response from server');
      }

      setProgress(50); // Midway progress

      // Set state to update the UI with an audio player
      console.log(response);
      setTranslatedAudioURL(response.audioUrl);
      setTranscription(response.transcript);
      setTranslation(response.translated);
      setProgress(100); // Completed
      setProcessingComplete(true);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="mr-2 h-5 w-5" />
          Record Client Conversation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="flex flex-col items-center space-y-4">
          {isRecording ? (
            <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <Mic className="h-16 w-16 text-red-500" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
              <Mic className="h-16 w-16 text-gray-400" />
            </div>
          )}

          <div className="flex space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        {/* Audio Playback */}
        {audioURL && (
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Recording Preview</h3>
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}

        {/* Language Selection */}
        {recordingComplete && !isProcessing && !processingComplete && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="font-medium">Select Target Language</h3>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={processAudio} className="w-full">
              <Languages className="mr-2 h-4 w-4" />
              Process Recording
            </Button>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Audio
            </h3>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Transcribing and translating your recording...
            </p>
          </div>
        )}

        {/* Results */}
        {processingComplete && (
          <div className="space-y-6 pt-4 border-t">
            <Tabs defaultValue="transcription">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transcription">
                  Original Transcription
                </TabsTrigger>
                <TabsTrigger value="translation">
                  {targetLanguage === 'hi' ? 'Hindi' : 'Marathi'} Translation
                </TabsTrigger>
              </TabsList>
              <TabsContent value="transcription" className="space-y-4">
                <Textarea
                  value={transcription}
                  readOnly
                  className="min-h-[150px]"
                />
                {audioURL && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Original Audio</h4>
                    <audio src={audioURL} controls className="w-full" />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="translation" className="space-y-4">
                <Textarea
                  value={translation}
                  readOnly
                  className="min-h-[150px]"
                />
                {translatedAudioURL && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      {targetLanguage === 'hi' ? 'Hindi' : 'Marathi'} Audio
                    </h4>
                    <audio
                      src={translatedAudioURL}
                      controls
                      className="w-full"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-sm text-muted-foreground">
          {isRecording
            ? 'Recording in progress...'
            : isProcessing
            ? 'Processing your audio...'
            : processingComplete
            ? 'Processing complete!'
            : 'Ready to record'}
        </p>

        {processingComplete && (
          <Button variant="outline" onClick={startRecording}>
            Record New
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
