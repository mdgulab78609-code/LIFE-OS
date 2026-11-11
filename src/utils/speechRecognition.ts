export interface ParsedVoiceCommand {
  type: 'habit' | 'task';
  title: string;
  category: string;
  time?: string;
  date?: string;
  frequency?: 'daily' | 'weekly';
  priority?: 'high' | 'medium' | 'low';
}

export function parseVoiceInput(transcript: string): ParsedVoiceCommand {
  const clean = transcript.trim().toLowerCase();

  const isHabit =
    clean.includes('habit') ||
    clean.includes('daily') ||
    clean.includes('every day') ||
    clean.includes('routine') ||
    clean.startsWith('practice') ||
    clean.startsWith('read');

  // Extract time like "at 6 pm", "at 5:30 am", "at 18:00"
  const timeMatch = clean.match(/(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  let timeStr = '09:00';
  if (timeMatch && timeMatch[1]) {
    timeStr = timeMatch[1].toUpperCase();
  }

  // Detect category
  let category = 'Personal';
  if (clean.includes('code') || clean.includes('coding') || clean.includes('programming') || clean.includes('study') || clean.includes('learn')) {
    category = 'Skills';
  } else if (clean.includes('run') || clean.includes('gym') || clean.includes('workout') || clean.includes('exercise') || clean.includes('water') || clean.includes('sleep') || clean.includes('walk')) {
    category = 'Health';
  } else if (clean.includes('work') || clean.includes('email') || clean.includes('meeting') || clean.includes('pr') || clean.includes('project') || clean.includes('bug')) {
    category = 'Career';
  } else if (clean.includes('pray') || clean.includes('meditate') || clean.includes('quran') || clean.includes('spiritual')) {
    category = 'Spiritual';
  } else if (clean.includes('read') || clean.includes('journal') || clean.includes('book')) {
    category = 'Mind';
  }

  // Priority detection
  let priority: 'high' | 'medium' | 'low' = 'medium';
  if (clean.includes('urgent') || clean.includes('high priority') || clean.includes('asap') || clean.includes('important')) {
    priority = 'high';
  } else if (clean.includes('low priority') || clean.includes('whenever')) {
    priority = 'low';
  }

  // Extract clean title
  let title = transcript
    .replace(/^add\s+(a\s+)?(habit|task)\s+/i, '')
    .replace(/^add\s+/i, '')
    .replace(/\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i, '')
    .trim();

  if (!title) {
    title = transcript;
  }
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);

  if (isHabit) {
    return {
      type: 'habit',
      title,
      category,
      time: timeStr,
      frequency: 'daily',
    };
  } else {
    return {
      type: 'task',
      title,
      category,
      time: timeStr,
      priority,
      date: new Date().toISOString().split('T')[0],
    };
  }
}

export class VoiceRecognitionService {
  private recognition: any = null;
  public isSupported = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    }
  }

  startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) {
        onResult(final, true);
      } else if (interim) {
        onResult(interim, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error || 'Speech error');
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      onError(e.message || 'Could not start microphone');
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }
}

export const voiceService = new VoiceRecognitionService();
