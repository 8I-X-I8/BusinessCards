document.addEventListener("DOMContentLoaded", () => {
  // 滚动丝带逻辑
  document.querySelectorAll(".scroll").forEach((scroll) => {
    const direction = scroll.dataset.direction === "right" ? 1 : -1;
    const speed = parseFloat(scroll.dataset.speed || "0.5");
    const text = scroll.dataset.text;

    const container = document.createElement("div");
    container.className = "content";

    for (let i = 0; i < 10; i++) {
      text.split(" ").forEach(word => {
        const span = document.createElement("span");
        span.textContent = word;
        container.appendChild(span);
      });
    }

    scroll.appendChild(container);

    let x = direction === 1 ? -container.scrollWidth / 2 : 0;

    function animate() {
      x += direction * speed;
      if (direction === -1 && Math.abs(x) >= container.scrollWidth / 2) {
        x = 0;
      } else if (direction === 1 && x >= 0) {
        x = -container.scrollWidth / 2;
      }
      container.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(animate);
    }

    animate();
  });

  // ✅ 自动翻转逻辑 + 快速点击3次切换模式
  const card = document.querySelector(".business-card");
  let flipping = true;
  let autoFlip = true;
  const flipInterval = 5000;
  let intervalId = null;

  function startFlipping() {
    if (!intervalId && autoFlip) {
      intervalId = setInterval(() => {
        if (flipping) {
          card.classList.toggle("business-card-active");
        }
      }, flipInterval);
    }
  }

  function stopFlipping() {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (card) {
    startFlipping();

    // 悬停暂停翻转
    card.addEventListener("mouseenter", () => {
      flipping = false;
    });
    card.addEventListener("mouseleave", () => {
      flipping = true;
    });

    // ✅ 点击切换模式 或 翻转
    let clickTimes = [];
    card.addEventListener("click", () => {
      const now = Date.now();
      clickTimes.push(now);
      clickTimes = clickTimes.filter(t => now - t < 1000);

      if (clickTimes.length === 3) {
        autoFlip = !autoFlip;
        clickTimes = [];

        if (autoFlip) {
          startFlipping();
        } else {
          stopFlipping();
        }

        console.log(`模式切换为：${autoFlip ? "自动翻转" : "手动翻转"}`);
        return;
      }

      // 如果是手动模式，点击才触发翻转
      if (!autoFlip) {
        card.classList.toggle("business-card-active");
      } else {
        // 自动模式下，点击只控制暂停状态
        flipping = !flipping;
      }
    });
  }
});
