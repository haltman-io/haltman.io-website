export interface AuthorProfile {
  name: string;
  displayName: string;
  role: string;
  avatar: string;
  email?: string;
  profileSlug?: string;
}

export interface MemberProfileMeta {
  slug: string;
  name: string;
  displayName: string;
  role: string;
  avatar: string;
  email: string;
}
