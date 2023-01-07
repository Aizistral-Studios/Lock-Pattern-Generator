<script lang="ts" setup>
import { defineProps, onUpdated, ref, onMounted } from "vue";

export interface Pattern {
	sequence: number[];
}

interface Point {
	id: number;
	x: number;
	y: number;
}

const props = defineProps<{
	pattern: Pattern;
}>();

const lockpad = ref<HTMLElement>();
const pointRefs = ref<HTMLElement[]>([]);
const points: Point[] = [
	{ id: 1, x: 0, y: 0 }, { id: 2, x: 1, y: 0 }, { id: 3, x: 2, y: 0 },
	{ id: 4, x: 0, y: 1 }, { id: 5, x: 1, y: 1 }, { id: 6, x: 2, y: 1 },
	{ id: 7, x: 0, y: 2 }, { id: 8, x: 1, y: 2 }, { id: 9, x: 2, y: 2 }
];

function distance(one: Point, two: Point): number {
	return Math.sqrt(Math.pow(one.x - two.x, 2) + Math.pow(one.y - two.y, 2));
}

function normalizeProperty(element: HTMLElement, property: string): void {
	const defaultSize = 300;
	const size = (lockpad.value as HTMLElement).offsetWidth;
	const ratio = size / defaultSize;
	const value = getComputedStyle(element)[<any>property];

	if (property.startsWith("transform-origin")) {
		const [x, y] = value.split(" ").map(x => x.replace("px", ""));
		element.style[<any>property] = `${parseInt(x) * ratio}px ${parseInt(y) * ratio}px`;
	} else {
		element.style[<any>property] = `${parseInt(value) * ratio}px`;
	}
}

function getIndexInSequence(index: number): number {
	return props.pattern.sequence.indexOf(index + 1);
}

function handleUpdate() {
	const refs = pointRefs.value.filter(Boolean);
	const width = (refs[0].parentElement as HTMLElement).offsetWidth;

	refs.forEach((ref, index) => {
		if (props.pattern.sequence.includes(index + 1)) {
			ref.style.backgroundColor = `var(--color-${props.pattern.sequence.indexOf(index + 1)})`;
		} else {
			ref.style.backgroundColor = "";
		}

		if (props.pattern.sequence.includes(index + 1)) {
			const indexInSequence = getIndexInSequence(index);

			if (indexInSequence >= props.pattern.sequence.length - 1)
				return;

			const point = points[index];
			const nextPoint = points[props.pattern.sequence[indexInSequence + 1] - 1];

			const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
			const dist = distance(point, nextPoint);

			const arrow = ref.querySelector(".arrow") as HTMLElement;

			normalizeProperty(arrow, "transform-origin");
			normalizeProperty(arrow, "border-radius");

			arrow.style.transform = `rotate(${angle}deg)`;
			arrow.style.width = `calc(${dist * width}px + 25%)`;
			arrow.style.background = `linear-gradient(90deg, var(--color-${indexInSequence}), var(--color-${indexInSequence + 1}))`;
			arrow.style.zIndex = (indexInSequence + 1).toString();
		}
	});
};

onMounted(handleUpdate);
onUpdated(handleUpdate);

</script>

<template>
	<div class="wrapper" ref="lockpad">
		<div class="point-container" v-for="point in points" :key="point.id">
			<div class="point" ref="pointRefs" :id="`point-${point.id.toString()}`">
				<div class="arrow" v-if="pattern.sequence.includes(point.id) &&
				pattern.sequence.indexOf(point.id) < pattern.sequence.length - 1"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	place-items: center;
	width: 300px;
	height: 300px;
	background-color: var(--color-lockpad-background);
	border-radius: 10%;
}

.point-container {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.point {
	width: 30%;
	height: 30%;
	border-radius: 50%;
	background-color: var(--color-point-empty);
	overflow: visible;
	position: relative;
}

.arrow {
	position: absolute;
	top: calc(50% - 12.5%);
	left: calc(50% - 12.5%);
	width: 0;
	height: 25%;
	transform-origin: 4px 4px;
	border-radius: 5px;
	background: linear-gradient(90deg, var(--color-0) 0%, var(--color-1) 100%);
	z-index: 1;
	opacity: 0.75;
}
</style>