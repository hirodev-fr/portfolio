import React, { useState, useEffect, useMemo } from 'react';
import { Image } from 'emdash/ui';
import type { Project } from '../../emdash-env';

export default function ProjectList({ projects }: { projects: Project[] }) {
	const [sortType, setSortType] = useState<'recent' | 'old' | 'alpha'>('recent');

	useEffect(() => {
		const handleSort = (e: CustomEvent<'recent' | 'old' | 'alpha'>) => setSortType(e.detail);
		window.addEventListener('sort-projects', handleSort as EventListener);
		return () => window.removeEventListener('sort-projects', handleSort as EventListener);
	}, []);

	const sortedProjects = useMemo(() => {
		const list = [...projects];
		if (sortType === 'recent') {
			list.sort((a, b) => new Date(b.launch_date).getTime() - new Date(a.launch_date).getTime());
		} else if (sortType === 'old') {
			list.sort((a, b) => new Date(a.launch_date).getTime() - new Date(b.launch_date).getTime());
		} else if (sortType === 'alpha') {
			list.sort((a, b) => a.name.localeCompare(b.name));
		}
		return list;
	}, [projects, sortType]);

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleDateString('fr-FR');
	};

	if (sortedProjects.length === 0) {
		return (
			<div className="flex-1 w-full h-full flex flex-col items-center justify-center py-20 space-y-4">
				<p className="text-xl text-ink">Aucun projet trouvé.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
			{sortedProjects.map((project, i) => (
				<a
					key={project.slug}
					href={`/work/${project.slug || ''}`}
					className="group w-full border border-ink flex flex-col justify-between"
				>
					{project.cover?.src ? (
						<Image
							class="w-full aspect-video p-3 pb-0 group-hover:p-0 transition-all duration-300 object-cover"
							image={project.cover}
							width={project.cover.width || 600}
							height={project.cover.height || 400}
							alt={project.cover.alt || project.name}
							loading={i <= 1 ? 'eager' : 'lazy'}
						/>
					) : (
						<div className="w-full aspect-video p-3 pb-0 group-hover:p-0 transition-all duration-300">
							<div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-dashed border-zinc-400 dark:border-zinc-700">
								<span className="text-sm font-mono text-zinc-500">Pas d'image de couverture</span>
							</div>
						</div>
					)}
					<div className="w-full h-14 flex items-center px-3">
						<h3
							className="relative w-fit uppercase transition-all duration-300
								after:content-[''] after:absolute after:bottom-0 after:left-0
								after:h-0.5 after:w-full after:bg-primary
								after:scale-x-0 after:origin-left after:transition-transform after:duration-300
								group-hover:after:scale-x-100"
						>
							{project.name}
						</h3>
						{project.launch_date && (
							<p className="ml-auto font-light text-xs font-mono">
								{formatDate(project.launch_date)}
							</p>
						)}
					</div>
				</a>
			))}
		</div>
	);
}
