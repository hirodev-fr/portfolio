import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Image } from 'emdash/ui';
import type { Project } from '../../emdash-env';
import Button from './Button';

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
	const [sortType, setSortType] = useState<'recent' | 'old' | 'alpha'>('recent');
	const [isSortOpen, setIsSortOpen] = useState(false);
	const sortContainerRef = useRef<HTMLDivElement>(null);

	const sortOptions = [
		{ id: 'recent', label: 'Plus récent' },
		{ id: 'old', label: 'Plus ancien' },
		{ id: 'alpha', label: 'A - Z' },
	] as const;

	const currentSortLabel = sortOptions.find((o) => o.id === sortType)?.label;

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

	useEffect(() => {
		function handleOutsideClick(event: MouseEvent) {
			if (
				isSortOpen &&
				sortContainerRef.current &&
				!sortContainerRef.current.contains(event.target as Node)
			) {
				setIsSortOpen(false);
			}
		}
		window.addEventListener('click', handleOutsideClick);
		return () => window.removeEventListener('click', handleOutsideClick);
	}, [isSortOpen]);

	const selectSort = (id: typeof sortType) => {
		setSortType(id);
		setIsSortOpen(false);
	};

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleDateString('fr-FR');
	};

	return (
		<div className="flex flex-col flex-1">
			<div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center w-full border-b-line border-b py-9 px-4 sm:px-10 md:px-14">
				<h1 className="uppercase text-4xl sm:text-5xl md:text-6xl">Nos réalisations.</h1>
				<div className="lg:ml-auto flex lg:justify-end items-center space-x-3 h-full w-full md:max-w-1/2 relative">
					<div className="relative" ref={sortContainerRef}>
						<Button
							onClick={() => setIsSortOpen(!isSortOpen)}
							aria-haspopup="listbox"
							aria-expanded={isSortOpen}
						>
							Trier : {currentSortLabel}
						</Button>

						{isSortOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-base border border-line z-50">
								{sortOptions.map((option) => (
									<button
										key={option.id}
										onClick={() => selectSort(option.id)}
										className={`w-full text-left px-4 py-3 uppercase text-sm font-mono hover:bg-primary hover:text-base transition-colors ${
											sortType === option.id ? 'bg-primary/10 text-primary' : 'text-ink'
										}`}
									>
										{option.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col flex-1 py-9 px-4 sm:px-10 md:px-14">
				{sortedProjects.length === 0 ? (
					<div className="flex-1 w-full h-full flex flex-col items-center justify-center py-20 space-y-4">
						<p className="text-xl text-ink">Aucun projet trouvé.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
						{sortedProjects.map((project, i) => (
							<a
								key={project.slug}
								href={`/work/${project.slug || ''}`}
								className="group w-full border border-ink flex flex-col justify-between"
							>
								{/* TODO: image not loaded */}
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
											<span className="text-sm font-mono text-zinc-500">
												Pas d'image de couverture
											</span>
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
				)}
			</div>
		</div>
	);
}
