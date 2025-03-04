import { useState } from 'react';
import { startRecording, stopRecording, processAudio } from '../utils/api';

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);

  const handleStart = async () => {
    await startRecording();
    setIsRecording(true);
  };

  const handleStop = async () => {
    await stopRecording();
    setIsRecording(false);
  };

  const handleProcess = async () => {
    await processAudio('en', 'hi');
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={handleStart}
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={isRecording}
      >
        🎤 Start Recording
      </button>

      <button
        onClick={handleStop}
        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
        disabled={!isRecording}
      >
        ⏹ Stop Recording
      </button>

      <button
        onClick={handleProcess}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        🔄 Translate & Download
      </button>
    </div>
  );
}
