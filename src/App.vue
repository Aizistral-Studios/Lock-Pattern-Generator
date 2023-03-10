<script setup lang="ts">
import LockPad from "./components/LockPad.vue";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import 'animate.css'
import { reactive, ref, onMounted } from "vue";
import * as PatternGenerator from "./patternGenerator"
import * as Html2Canvas from "html2canvas";
import Download from "./components/icons/Download.vue";
import SortNumericUp from "./components/icons/SortNumericUp.vue";

const slider = ref<typeof VueSlider>();
const state = reactive({
	usePoints: getCachedUsePoints(),
	sequence: PatternGenerator.generate(getCachedUsePoints()),
	randomID: generateRandomID(),
	showNumbers: getCachedShowNumbers()
});

function getCachedUsePoints(): number {
	return localStorage.getItem("usePoints") ? parseInt(localStorage.getItem("usePoints") as string) : 5;
}

function getCachedShowNumbers(): boolean {
	return localStorage.getItem("showNumbers") ? localStorage.getItem("showNumbers") === "true" : false;
}

function generateRandomID() {
	return Math.random().toString(36).substring(2, 15);
}

function updateSequence(usePoints: number) {
	localStorage.setItem("usePoints", usePoints.toString());
	state.randomID = generateRandomID();
	state.sequence = PatternGenerator.generate(usePoints);
}

function onChange(value: number, index: number) {
	updateSequence(value);
}

function onChangeShowNumbers(value: boolean) {
	localStorage.setItem("showNumbers", value.toString());
}

function onDownload() {
	Html2Canvas.default(document.getElementById("capture") as HTMLElement, {
		allowTaint: true,
		useCORS: true,
		logging: false,
		backgroundColor: null,
		scale: 2
	}).then(canvas => {
		const link = document.createElement("a");
		link.download = "lock-pattern-" + state.randomID + ".png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	});
}
</script>

<template>
	<main>
		<div class="content-wrapper">
			<header class="animate__animated animate__backInDown">
				<h1>Lock Pattern Generator</h1>
			</header>
			<div class="main-content animate__animated animate__backInLeft">
				<div class="lock-pad-wrapper">
					<LockPad id="capture" class="lock-pad" :pattern="state.sequence" :showNumbers="state.showNumbers" />
				</div>
				<div class="controls-wrapper">
					<div class="controls">
						<div class="guide">
							<div class="guide-header-container">
								<p class="guide-header">Color Guide</p>
								<div class="numbers-control">
									<label for="numbers" class="numbers-label">
										<SortNumericUp class="numbers-icon" />
									</label>
									<input type="checkbox" class="numbers-checkbox" id="numbers" name="numbers" v-model="state.showNumbers" @change="onChangeShowNumbers(state.showNumbers)" />
								</div>
							</div>
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
						<div class="end-buttons">
							<button class="generate-button" @click="updateSequence(state.usePoints)">Generate</button>
							<button class="download-button" @click="onDownload">
								<Download class="download-icon" />
							</button>
						</div>
					</div>
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
	border-bottom: 1px solid var(--color-text);
	border-bottom-left-radius: 10px 10px;
	border-bottom-right-radius: 10px 10px;
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

.lock-pad-wrapper, .controls-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
}

.lock-pad {
	width: 300px;
	height: 300px;
}

.controls {
	width: 300px;
	font-size: 1.2rem;
}

.guide-header-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.numbers-control, .numbers-label {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
}

.numbers-icon {
	width: 20px;
	height: 20px;
}

.numbers-checkbox {
	appearance: none;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 18px;
	height: 18px;
	/* background-color: black; */
	border: 1px solid var(--color-text);
	border-radius: 3px;
}

.numbers-checkbox:checked:after {
	content: '\2714';
	font-size: 16px;
	color: var(--color-text);
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

.end-buttons {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
	margin-bottom: 0.4rem;
	gap: 10px;
}

.generate-button, .download-button {
	font-family: "Roboto", sans-serif;
	font-weight: 400;
	font-size: 1.2rem;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s;
	width: 100%;
	height: 3rem;
}

.generate-button {
	color: var(--color-button-text);
	background-color: var(--color-button);
}

.generate-button:hover {
	background-color: var(--color-button-hover);
}

.download-button {
	color: var(--color-button);
	background-color: var(--color-background);
	border: 3px solid var(--color-button);
	transition-property: border, color;
	transition-duration: 0.2s;
	padding: 0;
	width: 3rem;
	min-width: 3rem;
}

.download-icon {
	width: 30px;
	height: 30px;
	margin-bottom: -5px;
}

.download-button:hover {
	color: var(--color-button-hover);
	border: 3px solid var(--color-button-hover);
}

@media (max-width: 600px) {
	h1 {
		font-size: 2.5rem;
		margin-bottom: -20px;
	}
}
</style>
