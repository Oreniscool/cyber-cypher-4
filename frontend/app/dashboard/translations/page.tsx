import AudioRecorder from '@/components/audio-recorder';
export default function AudioRecorderPage() {
  return (
    <div className="max-w-3xl mx-auto min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-6">Audio Recorder</h1>
      <p className="text-muted-foreground mb-8">
        Record your client conversations and convert them to your desired
        language. Our system helps you capture important details from
        multilingual real estate discussions.
      </p>

      <AudioRecorder />
    </div>
  );
}
