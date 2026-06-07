import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
	[
		'flex w-full items-center justify-center bg-primary py-3 text-base uppercase ring-base transition-all duration-300 whitespace-nowrap',
		'hover:bg-base hover:text-primary hover:ring-1 hover:ring-primary hover:cursor-pointer',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base',
	],
	{
		variants: {
			variant: {
				default: 'px-4 md:px-6 lg:px-8',
				compact: 'px-2',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

export interface ButtonProps
	extends React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>, VariantProps<typeof button> {
	as?: 'a' | 'button';
	href?: string;
	class?: string;
	className?: string;
	children?: React.ReactNode;
	type?: 'button' | 'submit' | 'reset';
}

export default function Button({
	as = 'button',
	href,
	variant,
	class: classProp,
	className,
	children,
	type = 'button',
	...props
}: ButtonProps) {
	const isExternal = href && (href.startsWith('http') || href.startsWith('//'));
	const classes = button({ variant, className: className || classProp });

	if (as === 'a' || href) {
		// Clean up props that shouldn't be passed to native anchor tag
		const { type: _type, ...anchorProps } = props as any;
		return (
			<a
				href={href}
				className={classes}
				rel={isExternal ? 'noopener noreferrer' : undefined}
				{...anchorProps}
			>
				{children}
			</a>
		);
	}

	return (
		<button
			type={type}
			className={classes}
			{...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{children}
		</button>
	);
}
