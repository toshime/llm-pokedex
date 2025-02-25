/**
 * ポケモン図鑑のHTMLを動的に生成するためのスクリプト
 * JSONデータを読み込み、DOMに反映する
 */
document.addEventListener("DOMContentLoaded", function () {
  loadPokemonData();
});

// JSONデータを読み込む
async function loadPokemonData() {
  try {
    const response = await fetch("pokemon-data.json");
    if (!response.ok) {
      throw new Error("ポケモンデータの読み込みに失敗しました");
    }

    const data = await response.json();
    renderPokemonGroups(data.evolutionGroups);

    // イベントリスナーを再設定
    setupEventListeners();
  } catch (error) {
    console.error("データ読み込みエラー:", error);
    document.getElementById("evolution-groups").innerHTML =
      '<div class="error-message">データの読み込みに失敗しました。</div>';
  }
}

// 進化グループをレンダリング
function renderPokemonGroups(groups) {
  const container = document.getElementById("evolution-groups");
  if (!container) return;

  let html = "";

  groups.forEach((group) => {
    html += `
      <div class="evolution-group">
        <div class="evolution-header">
          <div class="pokeball-mini"></div>
          <h2 class="evolution-title">${group.name}</h2>
        </div>
        <div class="pokemon-list">
    `;

    group.pokemon.forEach((pokemon) => {
      html += `
        <div class="pokemon-card" data-id="${pokemon.id}">
          <div class="pokemon-number">No.${pokemon.number}</div>
          <div class="pokemon-info">
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-types">
      `;

      pokemon.types.forEach((type, index) => {
        html += `
          <span class="type-badge ${pokemon.typeClasses[index]}">${type}</span>
        `;
      });

      html += `
            </div>
          </div>
          <div class="pokemon-icon-wrapper">
            <img src="${pokemon.image}" class="pokemon-icon" alt="${pokemon.name}">
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// イベントリスナーを設定
function setupEventListeners() {
  // ポケモンカードのクリックイベント
  document.querySelectorAll(".pokemon-card").forEach((card) => {
    card.addEventListener("click", function () {
      const pokemonId = this.getAttribute("data-id");
      showPokemonDetail(pokemonId);
    });
  });

  // モーダル背景のクリックイベント（閉じる）
  document.addEventListener("click", function (event) {
    const modal = document.querySelector(".modal");
    if (modal && event.target.classList.contains("modal")) {
      closeModal();
    }
  });

  // 閉じるボタンのクリックイベント
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-modal")) {
      closeModal();
    }
  });

  // ESCキーでモーダルを閉じる
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

// ポケモン詳細モーダルを表示
function showPokemonDetail(pokemonId) {
  // カードから情報を取得
  const card = document.querySelector(`.pokemon-card[data-id="${pokemonId}"]`);
  if (!card) return;

  const number = card.querySelector(".pokemon-number").textContent;
  const name = card.querySelector(".pokemon-name").textContent;
  const typeElements = card.querySelectorAll(".type-badge");
  const types = Array.from(typeElements).map((el) => el.outerHTML);
  const imageSrc = card.querySelector(".pokemon-icon").getAttribute("src");

  // モーダルを作成して表示
  const modalHtml = `
    <div class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="pokemon-detail">
          <div class="detail-header">
            <div class="detail-number">${number}</div>
            <h2 class="detail-name">${name}</h2>
            <div class="detail-types">
              ${types.join("")}
            </div>
          </div>
          
          <div class="pokemon-image-container">
            <div class="pokeball-background"></div>
            <img src="${imageSrc}" alt="${name}">
          </div>
        </div>
      </div>
    </div>
  `;

  // モーダルをDOM末尾に追加
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // スクロールを無効化
  document.body.style.overflow = "hidden";

  // モーダルが表示された直後にイベントを再設定
  setupEventListeners();
}

// モーダルを閉じる
function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    // フェードアウトアニメーション
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.remove();
      // スクロールを再度有効化
      document.body.style.overflow = "auto";
    }, 200);
  }
}

// URLからパラメータを取得（例：?id=001で特定のポケモンを直接表示）
function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");

  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  }

  return params;
}

// URLに指定されたポケモンがある場合、そのポケモンを表示
function checkUrlForPokemon() {
  const params = getUrlParams();
  if (params.id) {
    // ページの読み込み完了後に実行
    setTimeout(() => {
      showPokemonDetail(params.id);
    }, 500);
  }
}

// 検索機能
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim();

    document.querySelectorAll(".pokemon-card").forEach((card) => {
      const name = card
        .querySelector(".pokemon-name")
        .textContent.toLowerCase();
      const number = card
        .querySelector(".pokemon-number")
        .textContent.toLowerCase();

      // 検索語が名前または番号に含まれるか
      const isVisible =
        name.includes(searchTerm) || number.includes(searchTerm);

      // カードの表示/非表示を設定
      card.style.display = isVisible ? "flex" : "none";
    });

    // 各グループ内に表示されるカードがあるかチェック
    document.querySelectorAll(".evolution-group").forEach((group) => {
      const visibleCards = group.querySelectorAll(
        '.pokemon-card[style*="display: flex"]'
      ).length;
      group.style.display = visibleCards > 0 ? "block" : "none";
    });
  });
}

// 初期化時に検索機能をセットアップし、URLパラメータをチェック
document.addEventListener("DOMContentLoaded", function () {
  loadPokemonData().then(() => {
    setupSearch();
    checkUrlForPokemon();
  });
});
