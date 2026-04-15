import projectsData from "@/data/projects.json";

export type ProjectTag = "service" | "cli" | "docs" | "blog";

export type Project = {
  name: string;
  href: string;
  description: string;
  tag: ProjectTag;
  shortLabel: string;
  year: number;
  featured?: boolean;
};

export const tagLabels: Record<ProjectTag, string> = {
  service: "Service",
  cli: "CLI",
  docs: "Docs",
  blog: "Blog",
};

export const projects: Project[] = projectsData as Project[];

// Used by footer
export const activeProjects = projects;
export type ActiveProject = Project;
