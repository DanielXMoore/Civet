import { ref, watch } from 'vue';

// Read initial value from localStorage
let init = false;
try {
  init = JSON.parse(localStorage.getItem('ligatures') ?? 'false')
} catch (e) {}

// Shared state for ligatures toggle
export const ligatures = ref(init);

// Keep localStorage up-to-date
watch(ligatures, () => {
  try {
    localStorage.setItem('ligatures', JSON.stringify(ligatures.value));
  } catch (e) {}
})
