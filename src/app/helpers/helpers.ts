import * as T from '../../features/chat/chatSlice.types';
import {Skill, UserData} from '../../features/auth/authSlice.types';
import {PostsResult, PostState, Reaction} from 'features/post/postSlice.types';
import {PayloadAction} from '@reduxjs/toolkit';
import {setCookie} from 'cookies-next';

/**
 * Render message timestamp if last message was sent more than given time
 *
 * @param prevMessage
 * @param newMessage
 * @param inactivityTime
 */
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


/**
 * Create message timestamp string for rendering
 *
 * @param createdAt
 */
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


/**
 * Calculate remaining percentage of user data and return missing
 *
 * @param user
 */
export const calculateUserCompletion = (user: UserData) => {
  const profile = {avatar: user.avatar_name || null, skills: user.skills?.length || null, ...user.profile};
  const optionalData = ['avatar', 'telephone', 'age', 'nationality', 'address', 'description', 'skills'] as const;
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


/**
 * Calculate most used emoji in a post
 *
 * @param reactions
 */
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


/**
 * Shortens long numbers to a more readable format
 *
 * @param count
 */
export const roundCount = (count: number) => {
  if (count > 1000) {
    return `${Math.round(count / 100) / 10}k`;
  }
  return count;
};


/**
 * Promise that resolves after a given time
 *
 * @param ms
 */
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


/**
 * Save trending comments for each post from rtk-query to postState
 *
 * @param state
 * @param action
 */
export const saveTrendingComments = (state: PostState, action: PayloadAction<PostsResult>) => {
  action.payload.items.forEach((post) => {
    if (post.most_reacted_comment?.id) {
      state.trendingComments = state.trendingComments.map((mostReacted) => {
        if (mostReacted[1] === post.id) {
          return [post.most_reacted_comment!.id, post.id];
        }
        return mostReacted;
      });

      if (!state.trendingComments.some((mostReacted) => mostReacted[1] === post.id)) {
        state.trendingComments.push([post.most_reacted_comment!.id, post.id]);
      }
    }
  });
};


/**
 * SRR will dispatch cookie value to redux store and delete it
 * - app/ssr/initialFunctions.ts - init()
 *
 * @param type
 * @param payload
 */
export const dispatchSSR = (type: string, payload: any) => {
  setCookie('dispatch', JSON.stringify({type, payload}));
};


/**
 * Determine if server side rendering or client side rendering
 */
export const isSSR = () => {
  return typeof window === 'undefined';
};


/**
 * Order skills by tag
 *
 * @param skills
 */
export const skillsByTag = (skills: Skill[]) => {
  const skillsByTag = skills.reduce((acc, skill) => {
    const tag = skill.tag;
    const group = acc.find(g => g.tag === tag);
    if (!group) {
      acc.push({tag, skills: [skill]});
    } else {
      group.skills.push(skill);
    }
    return acc;
  }, [] as { tag: string, skills: typeof skills }[]);

  skillsByTag.sort((a, b) => a.tag.localeCompare(b.tag));

  return skillsByTag;
};
