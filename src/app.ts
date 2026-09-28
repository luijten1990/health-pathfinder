type Choice = { label: string; value: number };
type Question = { prompt: string; detail: string; choices: Choice[] };
type Result = { title: string; description: string; next: string };

const questions: Question[] = [
  { prompt: "How long have these concerns been present?", detail: "Start with the pattern, not a diagnosis.", choices: [{ label: "Less than 3 months", value: 1 }, { label: "3–12 months", value: 2 }, { label: "More than a year", value: 3 }] },
  { prompt: "How much does it affect your everyday life?", detail: "Consider energy, focus, sleep, and capacity.", choices: [{ label: "Occasionally", value: 1 }, { label: "Most weeks", value: 2 }, { label: "Most days", value: 3 }] },
  { prompt: "Have you already tried approaches that did not help enough?", detail: "Your prior experience is useful context.", choices: [{ label: "Not yet", value: 1 }, { label: "A few", value: 2 }, { label: "Several", value: 3 }] },
  { prompt: "What would feel most useful right now?", detail: "Choose the direction that best reflects your goal.", choices: [{ label: "Understanding possible patterns", value: 1 }, { label: "A more personal plan", value: 2 }, { label: "Support with a complex, long-running issue", value: 3 }] }
];

const results: Result[] = [
  { title: "A clear starting point", description: "Your answers suggest that a focused conversation about your current health goals may be a useful first step.", next: "Bring your questions, current routines, and any relevant health history to an introductory appointment." },
  { title: "A broader look may help", description: "There may be value in looking at the connections between your symptoms, history, lifestyle, and what you have already tried.", next: "An initial assessment can help identify questions worth exploring with an appropriately qualified clinician." },
  { title: "A deeper review could be worthwhile", description: "Your answers point to a long-running or complex pattern. A structured, individual review may help you organize the next steps.", next: "Consider discussing your concerns with a licensed healthcare professional, especially if symptoms are new, severe, or worsening." }
];

let step = 0;
const answers: number[] = [];
const app = document.querySelector<HTMLElement>("#app")!;

function render() {
  if (step >= questions.length) return renderResult();
  const question = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  app.innerHTML = `
    <div class="eyebrow">PERSONAL HEALTH REFLECTION · ${String(step + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}</div>
    <div class="progress" aria-label="Assessment progress"><span style="width:${progress}%"></span></div>
    <article class="card question-card">
      <p class="step-label">QUESTION ${step + 1}</p>
      <h1>${question.prompt}</h1>
      <p class="detail">${question.detail}</p>
      <div class="choices">${question.choices.map((choice, index) => `<button class="choice" data-value="${choice.value}" data-index="${index}"><span>0${index + 1}</span>${choice.label}<b>→</b></button>`).join("")}</div>
    </article>
    <button class="back" ${step === 0 ? "disabled" : ""}>← Back</button>`;
  app.querySelectorAll<HTMLButtonElement>(".choice").forEach(button => button.addEventListener("click", () => {
    answers[step] = Number(button.dataset.value);
    step += 1;
    render();
  }));
  app.querySelector<HTMLButtonElement>(".back")?.addEventListener("click", () => { if (step > 0) { step -= 1; render(); } });
}

function renderResult() {
  const score = answers.reduce((total, value) => total + value, 0);
  const result = results[score >= 10 ? 2 : score >= 7 ? 1 : 0];
  app.innerHTML = `
    <div class="eyebrow">YOUR REFLECTION</div>
    <article class="card result-card">
      <p class="step-label">A POSSIBLE NEXT STEP</p>
      <h1>${result.title}</h1>
      <p class="result-copy">${result.description}</p>
      <div class="next"><strong>What this could mean</strong><p>${result.next}</p></div>
      <button class="restart">Start again</button>
    </article>`;
  app.querySelector<HTMLButtonElement>(".restart")?.addEventListener("click", () => { step = 0; answers.length = 0; render(); });
}
render();
