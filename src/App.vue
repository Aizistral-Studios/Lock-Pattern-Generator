<script setup lang="ts">
import LockPad from "./components/LockPad.vue";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { reactive, ref } from "vue";
import * as PatternGenerator from "./patternGenerator"

const state = reactive({
	usePoints: 5,
	sequence: PatternGenerator.generate(5)
});

const slider = ref<typeof VueSlider>();

function updateSequence() {
	state.sequence = PatternGenerator.generate(state.usePoints);
	console.log(state.sequence);
}

function onChange(value: number, index: number) {
	console.log("dragging");
	console.log((slider.value as typeof VueSlider).getIndex());
}

</script>

<template>
	<main>
		<header>
			<h1>Lock Pattern Generator</h1>
		</header>
		<div class="content">
			<LockPad class="lock-pad" :pattern="{ sequence: state.sequence }" />
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
						:dotOptions="{ disabled: false, min: 4, max: 9 }" ref="slider"></VueSlider>
				</div>
				<button class="generate-button" @click="updateSequence">Generate</button>
			</div>
		</div>
		<footer>
			<p>&copy; 2023 Aizistral</p>
			<p><a href="">License</a> | <a href="">Issues</a> | <a href="">Source</a></p>
		</footer>
	</main>
</template>

<style scoped>
main {
	min-height: inherit;
	overflow: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-top: 50px;
	padding-bottom: 100px;
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

.content {
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 50px;
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
</style>
