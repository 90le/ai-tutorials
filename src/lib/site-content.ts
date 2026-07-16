import { siteConfig } from '@/config/site';

export const authorContacts = siteConfig.author.contacts;

export type AuthorContact = (typeof authorContacts)[number];
