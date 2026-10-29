/**
 * Finding Peace: 8-Week Mindfulness Roadmap
 * Phase 3 JavaScript Interactivity
 * Focus: Week module filter tabs, local action card completion state, accessible keyboard navigation.
 * Preserves complete user anonymity (browser localStorage only).
 */

document.addEventListener("DOMContentLoaded", () => {
  initWeekFilterTabs();
  initActionCardCheckboxes();
  initSmoothScroll();
});

/**
 * 1. Week Filter / Tab Switcher
 * Allows users to focus on one week at a time or browse all weeks simultaneously.
 */
function initWeekFilterTabs() {
  const roadmapSection = document.getElementById("roadmap");
  const moduleCards = document.querySelectorAll(".module-card");
  if (!roadmapSection || moduleCards.length === 0) return;

  // Create Filter Controls Container
  const filterNav = document.createElement("nav");
  filterNav.className = "week-filter-nav";
  filterNav.setAttribute("aria-label", "Filter Weekly Modules");

  const filterList = document.createElement("ul");

  // Buttons for Weeks 1 to 8 (Week 1 active by default)
  moduleCards.forEach((card, index) => {
    const weekNum = index + 1;
    const btn = createFilterButton(`Week ${weekNum}`, `week-${weekNum}`, index === 0);
    filterList.appendChild(btn);
  });

  filterNav.appendChild(filterList);

  // Insert before the modules grid
  const modulesGrid = document.querySelector(".modules-grid");
  if (modulesGrid) {
    modulesGrid.parentNode.insertBefore(filterNav, modulesGrid);
  }

  // Show only the first week's module on initial load
  moduleCards.forEach((card, index) => {
    card.style.display = index === 0 ? "block" : "none";
  });

  function createFilterButton(text, targetId, isActive) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.className = "filter-btn" + (isActive ? " active" : "");
    button.setAttribute("aria-pressed", isActive ? "true" : "false");

    button.addEventListener("click", () => {
      // Toggle button active state
      document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Filter cards
      moduleCards.forEach(card => {
        if (targetId === "all" || card.id === targetId) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });

    li.appendChild(button);
    return li;
  }
}

/**
 * 2. Daily Action Card Checkboxes with Local Persistence
 * Saves challenge completion state locally in the user's browser.
 */
function initActionCardCheckboxes() {
  const actionSections = document.querySelectorAll(".module-action");

  actionSections.forEach((section, index) => {
    const weekNum = index + 1;
    const storageKey = `mindfulness_week_${weekNum}_completed`;
    const isCompleted = localStorage.getItem(storageKey) === "true";

    // Create completion toggle container
    const toggleContainer = document.createElement("div");
    toggleContainer.className = "action-checkbox-container";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `action-check-${weekNum}`;
    checkbox.checked = isCompleted;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = isCompleted ? "Challenge completed for this week ✓" : "Mark challenge as completed";
    label.style.color = isCompleted ? "var(--color-primary, #244b44)" : "var(--color-text-muted, #566462)";

    checkbox.addEventListener("change", (e) => {
      const checked = e.target.checked;
      try {
        localStorage.setItem(storageKey, checked ? "true" : "false");
      } catch (err) {
        console.warn("localStorage unavailable:", err);
      }
      label.textContent = checked ? "Challenge completed for this week ✓" : "Mark challenge as completed";
      label.style.color = checked ? "var(--color-primary, #244b44)" : "var(--color-text-muted, #566462)";
    });

    toggleContainer.appendChild(checkbox);
    toggleContainer.appendChild(label);
    section.appendChild(toggleContainer);
  });
}

/**
 * 3. Accessible Smooth Scrolling for internal jump links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
        targetElement.setAttribute("tabindex", "-1");
        targetElement.focus();
      }
    });
  });
}
