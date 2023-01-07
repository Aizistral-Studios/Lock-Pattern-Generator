<script setup lang="ts">
import LockPad from "./components/LockPad.vue";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import 'animate.css'
import { reactive, ref } from "vue";
import * as PatternGenerator from "./patternGenerator"

const slider = ref<typeof VueSlider>();
const state = reactive({
	usePoints: getCachedUsePoints(),
	sequence: PatternGenerator.generate(getCachedUsePoints())
});

function getCachedUsePoints(): number {
	const usePoints = localStorage.getItem("usePoints");

	if (usePoints)
		return parseInt(usePoints);

	return 5;
}

function cacheUsePoints(usePoints: number) {
	localStorage.setItem("usePoints", usePoints.toString());
}

function updateSequence(usePoints: number) {
	cacheUsePoints(usePoints);
	state.sequence = PatternGenerator.generate(usePoints);
}

function onChange(value: number, index: number) {
	updateSequence(value);
}
</script>

<template>
	<main>
		<div class="content-wrapper">
			<header class="animate__animated animate__backInDown">
				<h1>Lock Pattern Generator</h1>
			</header>
			<div class="main-content animate__animated animate__backInLeft">
				<LockPad class="lock-pad" :pattern="state.sequence" />
				<div class="controls">
					<div class="guide">
						<p class="guide-header">Color Guide</p>
						<p class="guide-subtext">Pattern points go in this sequence. Some lines may not be visible due to overlapping.</p>
						<div class="guide-colors">
							<div class="guide-color" v-for="i in 9" :key="i">
								<div class="guide-color-dot" :style="{ backgroundColor: `var(--color-${i - 1})` }"></div>
								<p class="guide-color-text">{{ i }}</p>
							</div>
						</div>
					</div>
					<div class="use-points">
						<p class="use-points-desc">Use points:</p>
						<p class="use-points-value">{{ state.usePoints }}</p>
					</div>
					<div class="slider-container">
						<VueSlider v-model="state.usePoints" :min="1" :max="9" :interval="1" :tooltip="'none'"
							:dotOptions="{ disabled: false, min: 4, max: 9 }" ref="slider" :onChange="onChange"></VueSlider>
					</div>
					<button class="generate-button" @click="updateSequence(state.usePoints)">Generate</button>
				</div>
			</div>
			<footer class="animate__animated animate__backInUp">
				<p>&copy; 2023 Aizistral</p>
				<p><a target="_blank" href="https://github.com/Aizistral-Studios/Lock-Pattern-Generator/tree/master/LICENSE">License</a> | <a target="_blank" href="https://github.com/Aizistral-Studios/Lock-Pattern-Generator/issues">Issues</a> | <a target="_blank" href="https://github.com/Aizistral-Studios/Lock-Pattern-Generator">Source</a></p>
			</footer>
		</div>
	</main>
</template>

<style scoped>
main {
	min-height: inherit;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 25px;
}

.content-wrapper {
	margin-bottom: 25px;
}

header {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 60px;
}

h1 {
	font-weight: 500;
	font-size: 3rem;
	text-align: center;
	color: var(--color-header);
	padding-inline: 20px;
	border-radius: 10px;
	border-bottom: 1px solid var(--color-text);
}

footer {
	text-align: center;
	font-size: 1.15rem;
	padding-top: 50px;
}

.main-content {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	column-gap: 50px;
	row-gap: 20px;
}

.lock-pad {
	width: 300px;
	height: 300px;
}

.controls {
	width: 300px;
	font-size: 1.2rem;
}

.guide-subtext {
	font-size: 0.9rem;
	margin-bottom: 10px;
	color: var(--color-text-darker);
}

.guide-colors {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	margin-bottom: 20px;
}

.guide-color {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.guide-color-dot {
	display: inline-block;
	width: 15px;
	height: 15px;
	border-radius: 50%;
	margin: 5px;
}

.guide-color-text {
	display: inline-block;
	font-size: 1rem;
	margin-bottom: 1px;
}

.use-points {
	font-family: "Roboto", sans-serif;
	font-weight: 400;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.generate-button {
	font-family: "Roboto", sans-serif;
	font-weight: 400;
	font-size: 1.2rem;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	background-color: var(--color-button);
	color: var(--color-button-text);
	cursor: pointer;
	transition: background-color 0.3s;
	margin-top: 20px;
	width: 100%;
}

.generate-button:hover {
	background-color: var(--color-button-hover);
}

@media (max-width: 600px) {
	h1 {
		font-size: 2.5rem;
		margin-bottom: -20px;
	}
}
</style>
