const navItems = [
  { icon: "✦", label: "AI工作台", active: true },
  { icon: "☷", label: "全部会话" },
  { icon: "◎", label: "机会客户" },
  { icon: "◇", label: "客户池" },
  { icon: "⚡", label: "自动化策略" },
  { icon: "◉", label: "AI学习中心" },
];

const tasks = [
  {
    priority: "high",
    customer: "客户A",
    insight: "已咨询价格3次，犹豫中",
    suggestedAction: "发送限时优惠",
    cta: ["查看会话", "一键发送"],
  },
  {
    priority: "medium",
    customer: "客户B",
    insight: "3天未回复",
    suggestedAction: "轻提醒跟进",
    cta: ["生成话术"],
  },
];

const conversations = [
  {
    id: "wait-1",
    tab: "待回复",
    customer: "客户A",
    message: "价格可以再优惠一点吗？我今天想确认方案。",
    time: "10:42",
    initial: "A",
  },
  {
    id: "wait-2",
    tab: "待回复",
    customer: "客户C",
    message: "麻烦发一下企业版功能对比。",
    time: "09:58",
    initial: "C",
  },
  {
    id: "active-1",
    tab: "进行中",
    customer: "客户B",
    message: "上次看的套餐还在考虑，晚点回复你。",
    time: "昨天",
    initial: "B",
  },
  {
    id: "done-1",
    tab: "已完成",
    customer: "客户D",
    message: "已确认合同，等待财务付款。",
    time: "周二",
    initial: "D",
  },
];

const analysis = {
  customerProfile: {
    intent: "高购买意向",
    emotion: "犹豫",
    score: 0.82,
  },
  recommendations: ["建议使用限时优惠", "避免频繁打扰"],
};

const scriptVariants = ["温和型话术", "强促单话术", "情感型话术"];
const tabs = ["待回复", "进行中", "已完成"];
const rightTabs = ["AI分析", "话术"];

let selectedConversationTab = tabs[0];
let selectedRightTab = rightTabs[0];
let selectedConversationId = conversations[0].id;

const sidebarNav = document.querySelector("#sidebarNav");
const taskFeed = document.querySelector("#taskFeed");
const conversationTabs = document.querySelector("#conversationTabs");
const conversationList = document.querySelector("#conversationList");
const rightTabsEl = document.querySelector("#rightTabs");
const rightContent = document.querySelector("#rightContent");
const automationToggle = document.querySelector("#automationToggle");
const aiPrompt = document.querySelector("#aiPrompt");
const sendPrompt = document.querySelector("#sendPrompt");
const templateButton = document.querySelector("#templateButton");

function renderNav() {
  sidebarNav.innerHTML = navItems
    .map(
      (item) => `
        <button class="nav-item ${item.active ? "active" : ""}" type="button">
          <span class="nav-icon" aria-hidden="true">${item.icon}</span>
          <span>${item.label}</span>
        </button>
      `,
    )
    .join("");
}

function renderTasks() {
  const priorityLabel = { high: "高优先级", medium: "中优先级" };

  taskFeed.innerHTML = tasks
    .map(
      (task) => `
        <article class="task-card ${task.priority}">
          <div class="task-top">
            <div class="customer-line">
              <strong>${task.customer}</strong>
              <span>${task.insight}</span>
            </div>
            <span class="priority-badge ${task.priority}">${priorityLabel[task.priority]}</span>
          </div>
          <p class="task-insight">${task.insight}</p>
          <div class="suggestion"><strong>建议动作：</strong>${task.suggestedAction}</div>
          <div class="task-actions">
            ${task.cta
              .map(
                (label) =>
                  `<button class="${label === "一键发送" ? "primary-mini" : ""}" data-task-action="${label}" data-customer="${task.customer}" type="button">${label}</button>`,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderConversationTabs() {
  conversationTabs.innerHTML = tabs
    .map(
      (tab) =>
        `<button class="tab-button ${selectedConversationTab === tab ? "active" : ""}" type="button" role="tab" aria-selected="${selectedConversationTab === tab}" data-conversation-tab="${tab}">${tab}</button>`,
    )
    .join("");
}

function renderConversations() {
  const visible = conversations.filter((item) => item.tab === selectedConversationTab);

  if (!visible.some((item) => item.id === selectedConversationId)) {
    selectedConversationId = visible[0]?.id || "";
  }

  conversationList.innerHTML = visible.length
    ? visible
        .map(
          (item) => `
            <button class="conversation-item ${selectedConversationId === item.id ? "active" : ""}" type="button" data-conversation="${item.id}">
              <span class="customer-avatar">${item.initial}</span>
              <span class="conversation-main">
                <strong>${item.customer}</strong>
                <span>${item.message}</span>
              </span>
              <time class="conversation-time">${item.time}</time>
            </button>
          `,
        )
        .join("")
    : `<div class="empty-state">当前没有${selectedConversationTab}会话</div>`;
}

function renderRightTabs() {
  rightTabsEl.innerHTML = rightTabs
    .map(
      (tab) =>
        `<button class="tab-button ${selectedRightTab === tab ? "active" : ""}" type="button" role="tab" aria-selected="${selectedRightTab === tab}" data-right-tab="${tab}">${tab}</button>`,
    )
    .join("");
}

function renderAnalysis() {
  const score = Math.round(analysis.customerProfile.score * 100);
  rightContent.innerHTML = `
    <section class="analysis-card">
      <h3>客户画像</h3>
      <div class="profile-score">
        <div class="score-ring" style="--score: ${score}">${score}</div>
        <div class="profile-meta">
          <div><span>意向</span><strong>${analysis.customerProfile.intent}</strong></div>
          <div><span>情绪</span><strong>${analysis.customerProfile.emotion}</strong></div>
          <div><span>评分</span><strong>${analysis.customerProfile.score.toFixed(2)}</strong></div>
        </div>
      </div>
    </section>
    <section class="analysis-card">
      <h3>推荐动作</h3>
      <div class="recommendation-list">
        ${analysis.recommendations.map((item) => `<div>${item}</div>`).join("")}
      </div>
    </section>
  `;
}

function renderScripts() {
  rightContent.innerHTML = `
    <section class="script-card">
      <h3>话术变体</h3>
      <div class="script-list">
        ${scriptVariants
          .map(
            (variant) => `
              <div class="script-item">
                <span>${variant}</span>
                <button type="button" data-script="${variant}">使用</button>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderRightContent() {
  if (selectedRightTab === "AI分析") {
    renderAnalysis();
  } else {
    renderScripts();
  }
}

function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2200);
}

function renderAll() {
  renderNav();
  renderTasks();
  renderConversationTabs();
  renderConversations();
  renderRightTabs();
  renderRightContent();
}

automationToggle.addEventListener("click", () => {
  const isOn = automationToggle.classList.toggle("is-on");
  automationToggle.setAttribute("aria-pressed", String(isOn));
  showToast(isOn ? "自动化已开启" : "自动化已关闭");
});

taskFeed.addEventListener("click", (event) => {
  const button = event.target.closest("[data-task-action]");
  if (!button) return;

  const { taskAction, customer } = button.dataset;
  if (taskAction === "查看会话") {
    selectedConversationTab = "待回复";
    selectedConversationId = "wait-1";
    renderConversationTabs();
    renderConversations();
    showToast(`已定位到${customer}的会话`);
  } else if (taskAction === "一键发送") {
    showToast(`已为${customer}发送限时优惠话术`);
  } else {
    selectedRightTab = "话术";
    renderRightTabs();
    renderRightContent();
    showToast(`已生成${customer}跟进话术`);
  }
});

conversationTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-conversation-tab]");
  if (!button) return;
  selectedConversationTab = button.dataset.conversationTab;
  renderConversationTabs();
  renderConversations();
});

conversationList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-conversation]");
  if (!button) return;
  selectedConversationId = button.dataset.conversation;
  renderConversations();
});

rightTabsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-right-tab]");
  if (!button) return;
  selectedRightTab = button.dataset.rightTab;
  renderRightTabs();
  renderRightContent();
});

rightContent.addEventListener("click", (event) => {
  const button = event.target.closest("[data-script]");
  if (!button) return;
  aiPrompt.value = `请生成一段${button.dataset.script}，用于跟进高意向但仍在犹豫的客户。`;
  aiPrompt.focus();
  showToast(`已填入${button.dataset.script}`);
});

templateButton.addEventListener("click", () => {
  aiPrompt.value = "帮我优先跟进高意向客户，并给出每个客户下一步动作。";
  aiPrompt.focus();
});

sendPrompt.addEventListener("click", () => {
  const text = aiPrompt.value.trim();
  showToast(text ? "AI已开始处理你的请求" : "先输入一个问题或选择模板");
});

renderAll();
