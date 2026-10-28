import { team } from "@/components/nexa/data";
import type { Maker, MakerProfile } from "../rankings.types";

type MakerSeed = Maker & Pick<MakerProfile, "bio" | "location" | "joinedAt" | "links">;

export const mockMakers: MakerSeed[] = team.map((member) => ({
  slug: member.name.toLowerCase(),
  name: member.name,
  role: member.role,
  avatar: member.avatar,
  bio: member.bio,
  location: "Ho Chi Minh City, Vietnam",
  joinedAt: "2024-03-01",
  links: { github: member.github, linkedin: member.linkedin },
}));

export const toMaker = ({ slug, name, role, avatar }: MakerSeed): Maker => ({ slug, name, role, avatar });
