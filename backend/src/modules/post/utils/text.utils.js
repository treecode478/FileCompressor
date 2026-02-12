// Utilities for extracting hashtags and mentions from content.

export function extractHashtags(text = '') {
  const regex = /#(\w+)/g;
  const tags = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    tags.add(match[1].toLowerCase());
  }
  return Array.from(tags);
}

export function extractMentions(text = '') {
  const regex = /@(\w+)/g;
  const usernames = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    usernames.add(match[1].toLowerCase());
  }
  return Array.from(usernames);
}

