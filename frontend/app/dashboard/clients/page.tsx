'use client';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function ClientFollowupPage() {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ta', name: 'Tamil' },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const response = await fetch('http://localhost:5000/followup-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          src_lang: sourceLanguage,
          tgt_lang: targetLanguage,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResponse(data.response);
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Real Estate Client Follow-up
      </h1>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Client Information Extraction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Source Language
                </label>
                <Select
                  value={sourceLanguage}
                  onValueChange={setSourceLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Language
                </label>
                <Select
                  value={targetLanguage}
                  onValueChange={setTargetLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Client Input
              </label>
              <Textarea
                placeholder="Enter client's requirements or conversation details"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !inputText}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Extract Client Information'
              )}
            </Button>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            {response && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Extracted Information
                </h3>
                <Card>
                  <CardContent className="p-4 bg-muted/50">
                    <p>{response}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
