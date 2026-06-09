import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

export default function ProjectSort() {
	const [sortType, setSortType] = useState<'recent' | 'old' | 'alpha'>('recent');
	const [isSortOpen, setIsSortOpen] = useState(false);
	const sortContainerRef = useRef<HTMLDivElement>(null);

	const sortOptions = [
		{ id: 'recent', label: 'Plus récent' },
		{ id: 'old', label: 'Plus ancien' },
		{ id: 'alpha', label: 'A - Z' },
	] as const;

	const currentSortLabel = sortOptions.find((o) => o.id === sortType)?.label;

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
		window.dispatchEvent(new CustomEvent('sort-projects', { detail: id }));
	};

	return (
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
	);
}
