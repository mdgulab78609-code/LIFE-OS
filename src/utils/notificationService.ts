/**
 * Samsung Galaxy A16 5G Notification & Haptic Feedback Service
 * Supports Web Notifications API, Android Vibrate / Haptic feedback,
 * and One UI floating banner alerts.
 */

export interface LifeOSNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  timestamp: number;
  category?: 'habit' | 'goal' | 'routine' | 'focus' | 'streak';
}

type NotificationListener = (notification: LifeOSNotification) => void;
const listeners: NotificationListener[] = [];

export const notificationService = {
  subscribe(fn: NotificationListener) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch {
      return 'denied';
    }
  },

  triggerHaptic(pattern: number[] = [80, 40, 80]) {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore if not allowed by browser context
      }
    }
  },

  send(title: string, body: string, category: LifeOSNotification['category'] = 'habit') {
    const item: LifeOSNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      body,
      icon: '/icon.svg',
      timestamp: Date.now(),
      category,
    };

    // Samsung haptic pulse
    this.triggerHaptic([60, 40, 60]);

    // Dispatch to in-app One UI floating banner listeners
    listeners.forEach((fn) => fn(item));

    // Also trigger system notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: category,
        });
      } catch (err) {
        console.warn('Native notification dispatch failed, banner displayed in-app', err);
      }
    }
  },

  // Specific Samsung A16 notification presets
  sendMorningKickoff() {
    this.send(
      '🌅 Good Morning! (Samsung Galaxy A16 5G)',
      'Your 5 daily habits and 3 priority goals are ready. Let\'s build your streak!',
      'routine'
    );
  },

  sendHabitReminder(habitName: string) {
    this.send(
      `⚡ Habit Reminder: ${habitName}`,
      'Time to check in! Consistency builds your best self.',
      'habit'
    );
  },

  sendFocusTimerDone(minutes: number) {
    this.send(
      '🎯 Focus Session Completed!',
      `Great deep work! You logged ${minutes} minutes of distraction-free focus.`,
      'focus'
    );
  },

  sendStreakCelebration(streakCount: number) {
    this.send(
      `🔥 ${streakCount}-Day Streak Maintained!`,
      'Unstoppable momentum on your Samsung Galaxy A16 5G. Keep shining!',
      'streak'
    );
  },

  sendEveningReview() {
    this.send(
      '🌙 Evening Reflection Ready',
      'Take 2 minutes to record your journal and celebrate today\'s wins.',
      'habit'
    );
  },
};
