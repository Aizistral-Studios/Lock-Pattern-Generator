export interface Point {
	number: number;
	invalidConnections: { number: number, blocker: number }[];
}

const POINTS: Point[] = [
	{ number: 1, invalidConnections: [{ number: 3, blocker: 2 }, { number: 7, blocker: 4 }, { number: 9, blocker: 5 }] },
	{ number: 2, invalidConnections: [{ number: 8, blocker: 5 }] },
	{ number: 3, invalidConnections: [{ number: 1, blocker: 2 }, { number: 7, blocker: 5 }, { number: 9, blocker: 6 }] },
	{ number: 4, invalidConnections: [{ number: 6, blocker: 5 }] },
	{ number: 5, invalidConnections: [] },
	{ number: 6, invalidConnections: [{ number: 4, blocker: 5 }] },
	{ number: 7, invalidConnections: [{ number: 1, blocker: 4 }, { number: 3, blocker: 5 }, { number: 9, blocker: 8 }] },
	{ number: 8, invalidConnections: [{ number: 2, blocker: 5 }] },
	{ number: 9, invalidConnections: [{ number: 1, blocker: 5 }, { number: 3, blocker: 6 }, { number: 7, blocker: 8 }] }
];

export function generate(usePoints: number): number[] {
	if (usePoints < 4 || usePoints > 9)
		throw new Error('Invalid number of points');

	const pattern = generatePatternInternal(usePoints);

	if (pattern.length !== usePoints)
		throw new Error('Failed to generate pattern');

	return pattern.map(p => p.number);
}

function generatePatternInternal(usePoints: number): Point[] {
	const pattern = [];
	const availablePoints = [...POINTS];
	let currentPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
	pattern.push(currentPoint);

	while (pattern.length < usePoints) {
		const validConnections = getValidConnections(currentPoint, pattern);
		currentPoint = validConnections[Math.floor(Math.random() * validConnections.length)];
		pattern.push(currentPoint);
	}

	return pattern;
}

function getValidConnections(currentPoint: Point, pattern: Point[]): Point[] {
	const validConnections: Point[] = [];

	for (const point of POINTS) {
		if (point.number === currentPoint.number || pattern.indexOf(point) !== -1)
			continue;

		const invalid = currentPoint.invalidConnections.find(c => c.number === point.number);

		if (invalid)
			if (!pattern.find(point => point.number === invalid.blocker))
				continue;

		validConnections.push(point);
	}

	return validConnections;
}