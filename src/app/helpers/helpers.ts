import * as T from '../../features/chat/chatSlice.types';
import {UserData} from '../../features/auth/authSlice.types';
import { Reaction } from 'features/post/postSlice.types';

export const appendDatesToMessages = (prevMessage: T.Message, newMessage: T.Message, inactivityTime = 300000) => {
  if (!prevMessage) {
    newMessage.showDate = true;
  } else {
    (new Date(newMessage.created_at).getTime() - new Date(prevMessage.created_at).getTime()) > inactivityTime
      ? newMessage.showDate = true
      : newMessage.showDate = false;
  }
  if (newMessage.showDate) {
    newMessage.formattedDate = formatMessageTime(newMessage.created_at);
  }
};

export const formatMessageTime = (createdAt: string) => {
  const currentTime = new Date();
  const messageTime = new Date(createdAt);

  return (currentTime.getTime() - messageTime.getTime()) > 86400000
    ? (currentTime.getTime() - messageTime.getTime()) > 604800000
      ? (currentTime.getTime() - messageTime.getTime()) > 31556952000
        ? messageTime.toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
        : messageTime.toLocaleDateString('en-GB', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
      : messageTime.toLocaleDateString('en-GB', {weekday: 'long', hour: 'numeric', minute: 'numeric'})
    : messageTime.toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric'});
};

export const calculateUserCompletion = (user: UserData) => {
  const profile = {avatar: user.avatar_name || null, skills: user.skills?.length || null, ...user.profile};
  const optionalData = ['avatar', 'address', 'age', 'description', 'nationality', 'telephone', 'skills'] as const;
  let count = 0;
  const result = {
    missing: [] as string[],
    percent: 0
  };
  optionalData.forEach((key) => {
    if (profile[key] === null) {
      result.missing.push(key);
    } else {
      count++;
    }
  });
  result.percent = Math.round((count / optionalData.length) * 100);

  return result;
};

export const getMostUsedReaction = (reactions: Reaction[]): number => {
  const counts = new Map<number, number>();
  reactions.forEach((reaction) => {
    const count = counts.get(reaction.reaction) || 0;
    counts.set(reaction.reaction, count + 1);
  });
  let mostUsedReaction = 1000;
  let mostUsedCount = -1;
  counts.forEach((count, reaction) => {
    if (count > mostUsedCount || (count === mostUsedCount && reaction < mostUsedReaction)) {
      mostUsedReaction = reaction;
      mostUsedCount = count;
    }
  });
  return mostUsedReaction;
};

export const roundCount = (count: number) => {
  if (count > 1000) {
    return `${Math.round(count / 100) / 10}k`;
  }
  return count;
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
