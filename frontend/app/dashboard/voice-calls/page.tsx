'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Camera, StopCircle } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function VoiceCallsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/start_analysis');
      const data = await response.json();

      if (response.ok) {
        setIsAnalyzing(true);
        // Optional: Start periodic result checking
        checkResults();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to start analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const stopAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/stop_analysis');
      const data = await response.json();

      if (response.ok) {
        setIsAnalyzing(false);
        // Fetch final results
        await checkResults();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to stop analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const checkResults = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_results');
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      }
    } catch (err) {
      setError('Failed to retrieve results');
    }
  };

  // Convert sentiment scores to pie chart data
  const preparePieChartData = (sentimentScores) => {
    if (!sentimentScores) return [];

    return Object.entries(sentimentScores).map(([emotion, score]) => ({
      name: emotion,
      value: score,
    }));
  };

  // Color palette for emotions
  const COLORS = {
    happy: '#34D399', // Emerald green
    sad: '#6366F1', // Indigo
    angry: '#EF4444', // Red
    surprised: '#F59E0B', // Amber
    neutral: '#6B7280', // Gray
    fearful: '#9333EA', // Purple
  };

  const pieChartData = preparePieChartData(results?.sentiment_scores);

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Voice Calls Sentiment Analysis
      </h1>
      <p className="text-muted-foreground">
        Analyze real-time sentiment during your voice and video calls using
        webcam emotion detection.
      </p>

      <div className="flex gap-4">
        <Button onClick={startAnalysis} disabled={isAnalyzing || isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          Start Analysis
        </Button>

        <Button
          variant="destructive"
          onClick={stopAnalysis}
          disabled={!isAnalyzing || isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <StopCircle className="mr-2 h-4 w-4" />
          )}
          Stop Analysis
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name.toLowerCase()] || '#00C49F'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <h3 className="font-semibold">AI Summary:</h3>
              <p className="bg-muted p-4 rounded-md">{results.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
