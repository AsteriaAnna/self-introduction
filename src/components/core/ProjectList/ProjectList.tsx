import { useEffect, useState } from 'react';
import { Project } from '@/types';
import { getAllProjects } from '@/utils/markdownParser';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  filterKeywords?: string[];
  highlightedIds?: string[];
}

export function ProjectList({ filterKeywords = [], highlightedIds = [] }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadedProjects = getAllProjects();
    setProjects(loadedProjects);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('projects');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const filteredProjects =
    filterKeywords.length > 0
      ? projects.filter((p) =>
          filterKeywords.some(
            (keyword) =>
              p.skillTags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase())) ||
              p.abilityTags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase()))
          )
        )
      : projects;

  if (filteredProjects.length === 0 && filterKeywords.length > 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">没有找到匹配的项目</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredProjects.map((project, index) => (
        <div
          key={project.id}
          className={`transition-all duration-700 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0 translate-x-0'
              : 'opacity-0 translate-y-8 translate-x-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <ProjectCard project={project} isHighlighted={highlightedIds.includes(project.id)} />
        </div>
      ))}
    </div>
  );
}
