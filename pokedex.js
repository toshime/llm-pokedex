document.addEventListener("DOMContentLoaded", function () {
  // ポケモンデータをJSONから読み込む
  // 実際のアプリでは fetch() でデータを取得する
  const pokemonData = getPokemonData();

  // 検索機能
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase().trim();

      if (searchTerm === "") {
        // 検索語がない場合はすべてのグループを表示
        document.querySelectorAll(".evolution-group").forEach((group) => {
          group.style.display = "block";
        });
        return;
      }

      // 進化グループごとにフィルタリング
      document.querySelectorAll(".evolution-group").forEach((group) => {
        const pokemonCards = group.querySelectorAll(".pokemon-card");
        let groupVisible = false;

        pokemonCards.forEach((card) => {
          const pokemonNumber = card
            .querySelector(".pokemon-number")
            .textContent.replace("No.", "")
            .trim();
          const pokemonName = card
            .querySelector(".pokemon-name")
            .textContent.toLowerCase();

          // 検索条件に一致するか確認
          const matchesSearch =
            pokemonName.includes(searchTerm) ||
            pokemonNumber.includes(searchTerm);

          // 検索結果に応じて表示/非表示
          card.style.display = matchesSearch ? "flex" : "none";

          // グループ内に表示されるポケモンがあれば、グループも表示
          if (matchesSearch) {
            groupVisible = true;
          }
        });

        // グループの表示/非表示を設定
        group.style.display = groupVisible ? "block" : "none";
      });
    });
  }

  // ポケモンカードのクリックイベント
  document.querySelectorAll(".pokemon-card").forEach((card) => {
    card.addEventListener("click", function () {
      const pokemonId = this.getAttribute("data-id");
      openPokemonModal(pokemonId);
    });
  });

  // モーダルを閉じる
  const closeModalBtn = document.querySelector(".close-modal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  // モーダル外クリックで閉じる
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("pokemon-modal");
    if (event.target === modal) {
      closeModal();
    }
  });

  // ESCキーでモーダルを閉じる
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // ポケモン詳細モーダルを開く
  function openPokemonModal(pokemonId) {
    // DOM要素から情報を取得
    const pokemonCard = document.querySelector(
      `.pokemon-card[data-id="${pokemonId}"]`
    );
    if (!pokemonCard) return;

    const number = pokemonCard.querySelector(".pokemon-number").textContent;
    const name = pokemonCard.querySelector(".pokemon-name").textContent;
    const typeElements = pokemonCard.querySelectorAll(".type-badge");
    const types = Array.from(typeElements).map((el) => el.textContent);
    const typeClasses = Array.from(typeElements).map((el) =>
      Array.from(el.classList).find((cls) => cls.startsWith("type-"))
    );
    const imageSrc = pokemonCard
      .querySelector(".pokemon-icon")
      .getAttribute("src");

    // モーダルにデータをセット
    const detailContainer = document.getElementById("pokemon-detail");

    let detailHTML = `
        <div class="detail-header">
          <div class="detail-number">${number}</div>
          <h2 class="detail-name">${name}</h2>
          <div class="detail-types">
      `;

    // タイプバッジの追加
    types.forEach((type, index) => {
      detailHTML += `<span class="type-badge ${typeClasses[index]}">${type}</span>`;
    });

    detailHTML += `
          </div>
        </div>
        
        <div class="pokemon-image-container">
          <img src="${imageSrc}" alt="${name}">
        </div>
      `;

    detailContainer.innerHTML = detailHTML;

    // モーダルを表示
    document.getElementById("pokemon-modal").style.display = "block";
  }

  // モーダルを閉じる
  function closeModal() {
    const modal = document.getElementById("pokemon-modal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  // ダミーデータ取得関数
  function getPokemonData() {
    return [
      // このデータはJSONファイルから読み込む予定
    ];
  }
});
