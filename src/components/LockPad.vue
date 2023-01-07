<script lang="ts" setup>
import { defineProps, onUpdated, ref, onMounted } from "vue";

interface Point { id: number; x: number; y: number; }

const props = defineProps<{ pattern: number[]; showNumbers: boolean }>();
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

function handleUpdate(): void {
	const refs = pointRefs.value.filter(Boolean);
	const width = (refs[0].parentElement as HTMLElement).offsetWidth;

	refs.forEach((ref, index) => {
		if (props.pattern.includes(index + 1)) {
			const indexInPattern = props.pattern.indexOf(index + 1);

			if (indexInPattern >= props.pattern.length - 1)
				return;

			const arrow = ref.querySelector(".arrow") as HTMLElement;

			normalizeProperty(arrow, "height");
			normalizeProperty(arrow, "transform-origin");
			normalizeProperty(arrow, "border-radius");

			const point = points[index];
			const nextPoint = points[props.pattern[indexInPattern + 1] - 1];
			const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
			const dist = distance(point, nextPoint);

			arrow.style.transform = `rotate(${angle}deg)`;
			arrow.style.width = `calc(${dist * width}px + 25%)`;
		}
	});
};

function computePointBackground(point: Point): string {
	const index = props.pattern.indexOf(point.id);
	return index === -1 ? "var(--color-point-empty)" : `var(--color-${index})`;
}

onMounted(handleUpdate);
onUpdated(handleUpdate);
</script>

<template>
	<div class="wrapper" ref="lockpad">
		<div class="point-container" v-for="point in points" :key="point.id">
			<div class="point" ref="pointRefs" :id="`point-${point.id.toString()}`"
				:style="{ '--point-background': computePointBackground(point) }">
				<p class="pattern-index" v-if="showNumbers && pattern.includes(point.id)">{{ pattern.indexOf(point.id) + 1 }}</p>
				<div class=" arrow" v-if="pattern.includes(point.id) && pattern.indexOf(point.id) < pattern.length - 1"
					:style="{
						'--arrow-color-0': `var(--color-${pattern.indexOf(point.id)})`,
						'--arrow-color-1': `var(--color-${pattern.indexOf(point.id) + 1})`,
						'--z-index': `${pattern.indexOf(point.id) + 1}`
					}" />
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
	overflow: visible;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	--point-background: var(--color-point-empty);
	background-color: var(--point-background);
}

.pattern-index {
	font-size: 1rem;
	font-weight: bold;
	color: #fff;
	z-index: 20;
}

.arrow {
	position: absolute;
	top: calc(50% - 12.5%);
	left: calc(50% - 12.5%);
	width: 0;
	height: 8px;
	transform-origin: 4px 4px;
	border-radius: 5px;
	opacity: 0.75;

	--z-index: 1;
	--arrow-color-0: white;
	--arrow-color-1: white;
	z-index: var(--z-index);
	background: linear-gradient(90deg, var(--arrow-color-0) 0%, var(--arrow-color-1) 100%);
}
</style>