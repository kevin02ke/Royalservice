import { ChatMessage, ChatThread } from '../types';

const EVENT_NAME = 'royalservice_chat_updated';

export const chatService = {
  // Fetch user thread
  async getUserThread(userId: string, userInfo?: { name?: string; phone?: string; email?: string; ref?: string }): Promise<ChatThread> {
    try {
      const params = new URLSearchParams();
      if (userInfo?.name) params.append('name', userInfo.name);
      if (userInfo?.phone) params.append('phone', userInfo.phone);
      if (userInfo?.email) params.append('email', userInfo.email);
      if (userInfo?.ref) params.append('ref', userInfo.ref);

      const res = await fetch(`/api/chat/threads/${userId}?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch user thread');
      const data: ChatThread = await res.json();
      return data;
    } catch (err) {
      console.warn('[chatService] Fallback to local storage for getUserThread', err);
      const local = localStorage.getItem(`royalservice_thread_${userId}`);
      if (local) {
        return JSON.parse(local);
      }
      // Return minimal local fallback thread
      return {
        id: `thread-${userId}`,
        userId,
        userName: userInfo?.name || 'Jane Wanjiru',
        userPhone: userInfo?.phone || '+254 712 345 678',
        userEmail: userInfo?.email || 'jane.wanjiru@gmail.com',
        userReferralCode: userInfo?.ref || 'ROYAL-JANE77',
        status: 'active',
        unreadCountUser: 1,
        unreadCountAdmin: 0,
        lastMessageTime: 'Just now',
        lastMessageSnippet: 'Welcome to Royal Service VIP Concierge.',
        messages: [
          {
            id: 'msg-local-1',
            threadId: `thread-${userId}`,
            sender: 'system',
            senderName: 'Royal Concierge System',
            text: 'Direct communication session initialized with Royal Service VIP Desk. Monitored 24/7.',
            timestamp: 'Just now',
            isRead: true,
          },
          {
            id: 'msg-local-2',
            threadId: `thread-${userId}`,
            sender: 'admin',
            senderName: 'VIP Support Manager (Assigned #VIP-402)',
            text: 'Welcome Jane! How can we assist you with your active packages, daily yields, or deposits today?',
            timestamp: 'Just now',
            isRead: false,
          },
        ],
      };
    }
  },

  // Fetch all threads for admin
  async getAllThreads(status = 'all', search = ''): Promise<ChatThread[]> {
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      if (search) params.append('search', search);

      const res = await fetch(`/api/chat/threads?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch threads');
      return await res.json();
    } catch (err) {
      console.warn('[chatService] Fallback for getAllThreads', err);
      return [];
    }
  },

  // Send message
  async sendMessage(userId: string, payload: {
    sender: 'user' | 'admin';
    senderName?: string;
    text?: string;
    voiceNote?: { audioData: string; durationSec: number };
    attachment?: { name: string; sizeBytes: number; type: string; dataUrl: string };
  }): Promise<ChatMessage> {
    try {
      const res = await fetch(`/api/chat/threads/${userId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to send message');
      const msg: ChatMessage = await res.json();

      // Dispatch global event for instant reactivity across tabs/components
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { userId, message: msg } }));
      return msg;
    } catch (err) {
      console.error('[chatService] Error sending message', err);
      throw err;
    }
  },

  // Mark thread as read
  async markAsRead(userId: string, reader: 'user' | 'admin'): Promise<void> {
    try {
      await fetch(`/api/chat/threads/${userId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reader }),
      });
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { userId, action: 'read' } }));
    } catch (err) {
      console.warn('[chatService] Failed to mark as read', err);
    }
  },

  // Update thread status
  async updateStatus(userId: string, status: 'active' | 'resolved' | 'escalated'): Promise<void> {
    try {
      await fetch(`/api/chat/threads/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { userId, action: 'status', status } }));
    } catch (err) {
      console.warn('[chatService] Failed to update status', err);
    }
  },

  // Clear thread messages
  async clearThread(userId: string): Promise<void> {
    try {
      await fetch(`/api/chat/threads/${userId}`, {
        method: 'DELETE',
      });
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { userId, action: 'cleared' } }));
    } catch (err) {
      console.warn('[chatService] Failed to clear thread', err);
    }
  },

  // Subscribe to live chat updates
  subscribe(callback: (event: CustomEvent) => void) {
    const handler = (e: Event) => callback(e as CustomEvent);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  },
};
