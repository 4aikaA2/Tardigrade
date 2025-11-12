const productGrid = document.querySelector("#productGrid");
const filterButtons = document.querySelectorAll(".hero__nav-btn");
const currentYearEl = document.querySelector("#year");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const sizeSelect = document.querySelector("#sizeSelect");
const colorSelect = document.querySelector("#colorSelect");
const priceMinInput = document.querySelector("#priceMin");
const priceMaxInput = document.querySelector("#priceMax");
const resetFiltersBtn = document.querySelector("#resetFilters");
const applyFiltersBtn = document.querySelector("#applyFilters");
const suggestionContainer = document.querySelector("#suggestion");
const suggestionTitle = document.querySelector("#suggestionTitle");
const suggestionList = document.querySelector("#suggestionList");

const filterState = {
  search: "",
  category: "all",
  size: "all",
  color: "all",
  priceMin: null,
  priceMax: null,
};

const normalizeValue = (value) => value.trim().toLowerCase();

const setActiveButton = (current) => {
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn === current);
  });
};

const applyFilters = () => {
  const cards = productGrid.querySelectorAll(".card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const cardCategory = card.dataset.category ?? "";
    const cardSize = card.dataset.size ?? "";
    const cardColor = card.dataset.color ?? "";
    const cardPrice = Number(card.dataset.price ?? 0);

    const title = card.querySelector(".card__title")?.textContent ?? "";
    const description =
      card.querySelector(".card__description")?.textContent ?? "";
    const searchTarget = `${title} ${description}`.toLowerCase();

    const matchesSearch =
      !filterState.search || searchTarget.includes(filterState.search);

    const matchesCategory =
      filterState.category === "all" || cardCategory === filterState.category;

    const matchesSize =
      filterState.size === "all" || cardSize === filterState.size;

    const matchesColor =
      filterState.color === "all" || cardColor === filterState.color;

    const matchesMin =
      filterState.priceMin === null || cardPrice >= filterState.priceMin;
    const matchesMax =
      filterState.priceMax === null || cardPrice <= filterState.priceMax;

    const shouldShow =
      matchesSearch &&
      matchesCategory &&
      matchesSize &&
      matchesColor &&
      matchesMin &&
      matchesMax;

    card.style.display = shouldShow ? "flex" : "none";
    if (shouldShow) {
      visibleCount += 1;
    }
  });

  if (!suggestionContainer || !suggestionList) {
    return;
  }

  if (visibleCount > 0) {
    suggestionContainer.setAttribute("hidden", "hidden");
    suggestionList.innerHTML = "";
    return;
  }

  const allCards = Array.from(cards);
  let sourceCards = [];

  if (filterState.category !== "all") {
    sourceCards = allCards.filter(
      (card) => card.dataset.category === filterState.category
    );
  }

  if (sourceCards.length === 0 && filterState.color !== "all") {
    sourceCards = allCards.filter(
      (card) => card.dataset.color === filterState.color
    );
  }

  if (sourceCards.length === 0 && filterState.size !== "all") {
    sourceCards = allCards.filter(
      (card) => card.dataset.size === filterState.size
    );
  }

  if (sourceCards.length === 0) {
    sourceCards = allCards;
  }

  suggestionList.innerHTML = "";
  sourceCards.slice(0, 3).forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add("card--suggested");
    clone.style.display = "";
    suggestionList.appendChild(clone);
  });

  if (sourceCards.length && filterState.category !== "all") {
    suggestionTitle.textContent = "Мы подобрали похожие позиции «Тихоходка»";
  } else if (sourceCards.length) {
    suggestionTitle.textContent = "Популярные товары «Тихоходка»";
  } else {
    suggestionTitle.textContent =
      "Популярные подборки «Тихоходка» — попробуйте изменить фильтры";
  }

  suggestionContainer.removeAttribute("hidden");
};

const syncCategoryButton = () => {
  const targetButton = Array.from(filterButtons).find(
    (btn) => btn.dataset.filter === filterState.category
  );
  setActiveButton(targetButton ?? null);
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterState.category = button.dataset.filter;
    categorySelect.value = filterState.category;
    syncCategoryButton();
    applyFilters();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    filterState.search = normalizeValue(event.target.value);
  });
}

if (categorySelect) {
  categorySelect.addEventListener("change", (event) => {
    filterState.category = event.target.value;
    syncCategoryButton();
  });
}

if (sizeSelect) {
  sizeSelect.addEventListener("change", (event) => {
    filterState.size = event.target.value;
  });
}

if (colorSelect) {
  colorSelect.addEventListener("change", (event) => {
    filterState.color = event.target.value;
  });
}

const parsePriceValue = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
};

if (priceMinInput) {
  priceMinInput.addEventListener("input", (event) => {
    filterState.priceMin = parsePriceValue(event.target.value);
  });
}

if (priceMaxInput) {
  priceMaxInput.addEventListener("input", (event) => {
    filterState.priceMax = parsePriceValue(event.target.value);
  });
}

const handleApply = () => {
  filterState.search = normalizeValue(searchInput?.value ?? "");
  filterState.priceMin = parsePriceValue(priceMinInput?.value ?? "");
  filterState.priceMax = parsePriceValue(priceMaxInput?.value ?? "");
  applyFilters();
};

if (applyFiltersBtn) {
  applyFiltersBtn.addEventListener("click", handleApply);
}

const handleKeySubmit = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleApply();
  }
};

[searchInput, categorySelect, sizeSelect, colorSelect, priceMinInput, priceMaxInput]
  .filter(Boolean)
  .forEach((element) => {
    element.addEventListener("keydown", handleKeySubmit);
  });

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", () => {
    filterState.search = "";
    filterState.category = "all";
    filterState.size = "all";
    filterState.color = "all";
    filterState.priceMin = null;
    filterState.priceMax = null;

    if (searchInput) searchInput.value = "";
    if (categorySelect) categorySelect.value = "all";
    if (sizeSelect) sizeSelect.value = "all";
    if (colorSelect) colorSelect.value = "all";
    if (priceMinInput) priceMinInput.value = "";
    if (priceMaxInput) priceMaxInput.value = "";

    syncCategoryButton();
    applyFilters();
  });
}

// Установка текущего года в подвале
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// Первичная инициализация
syncCategoryButton();
handleApply();

