class Calculator {
    static async init() {
        try {
            // Загружаем данные из PHP файла через fetch
            const response = await fetch('assets/data/products.php');
            this.data = await response.json();
            console.log("Данные калькулятора загружены:", this.data);
        } catch (error) {
            console.error("Ошибка загрузки данных калькулятора:", error);
            alert("Не удалось загрузить данные для калькулятора. Пожалуйста, обновите страницу.");
        }
    }

    static async calculate(p, potVol) {
        if (!this.data) {
            console.error("Данные калькулятора не загружены");
            return;
        }

        const { tent, filter, fan } = this.selectTentAndVentilation(p);
        const potSize = this.selectPotSize(p, potVol);
        const pot = this.data.pots[potSize];
        const lamp = this.selectLamp(tent.l, tent.w);

        const totalPotsPrice = pot.price * p;

        const products = [
            { name: `Гроутент ${tent.name}`, price: tent.price, url: tent.url, icon: 'fa-tent' },
            { name: lamp.name, price: lamp.price, url: lamp.url, icon: 'fa-lightbulb' },
            { name: `${p} шт. ${pot.name}`, price: totalPotsPrice, url: pot.url, icon: 'fa-seedling' },
            { name: filter.name, price: filter.price, url: filter.url, icon: 'fa-filter' },
            { name: fan.name, price: fan.price, url: fan.url, icon: 'fa-fan' }
        ];

        const total = products.reduce((sum, item) => sum + item.price, 0);
        const formattedTotal = total.toLocaleString('ru-RU') + ' ₽';

        this.displayResult(products, formattedTotal);
    }

    static selectTentAndVentilation(p) {
        const tents = this.data.tents;
        let tent = tents.find(t => p <= t.maxPlants) || tents[tents.length - 1];

        let filter, fan;
        const filters = this.data.filters;
        const fans = this.data.fans;

        if (tent.area <= 0.36) {
            filter = filters['250'];
            fan = fans['100'];
        } else if (tent.area <= 0.72) {
            filter = filters['350'];
            fan = fans['125'];
        } else if (tent.area <= 1.0) {
            filter = filters['500'];
            fan = fans['150'];
        } else {
            filter = filters['800'];
            fan = fans['150'];
        }

        return { tent, filter, fan };
    }

    static selectPotSize(p, potVol) {
        const minPotSize = p <= 3 ? 3 : (p <= 8 ? 5 : 7);
        const selectedPotSize = Math.max(minPotSize, potVol);
        if (selectedPotSize <= 3) return 3;
        if (selectedPotSize <= 5) return 5;
        if (selectedPotSize <= 7) return 7;
        if (selectedPotSize <= 10) return 10;
        if (selectedPotSize <= 15) return 15;
        return 20;
    }

    static selectLamp(l, w) {
        const area = (l / 100) * (w / 100);
        if (area <= 0.64) {
            return { name: 'Комплект Quantum Board 240 Вт', price: 18900, url: 'https://minifermer.ru/category/c266/', power: 240 };
        } else if (area <= 1.2) {
            return { name: 'Комплект Quantum Board 360 Вт', price: 25900, url: 'https://minifermer.ru/category/c311/', power: 360 };
        } else {
            const units = Math.ceil(area / 2.0);
            return {
                name: `Комплект Quantum Board 480 Вт${units > 1 ? ` ×${units}` : ''}`,
                price: 32900 * units,
                url: 'https://minifermer.ru/category/c294/',
                power: 480 * units
            };
        }
    }

    static displayResult(products, formattedTotal) {
        const cardsContainer = document.getElementById('cards');
        cardsContainer.innerHTML = '';

        products.forEach((product, i) => {
            const card = document.createElement('a');
            card.href = product.url;
            card.className = 'card';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            const formattedPrice = product.price.toLocaleString('ru-RU') + ' ₽';
            card.innerHTML = `
                <i class="fas ${product.icon}"></i>
                <div class="card-content">
                    <strong>${product.name}</strong>
                    <div>${formattedPrice}</div>
                </div>
            `;
            card.style.animation = `fadeIn 0.6s forwards`;
            card.style.animationDelay = `${i * 0.1}s`;
            card.style.opacity = '0';
            cardsContainer.appendChild(card);
        });

        document.getElementById('total').textContent = `Итого: ${formattedTotal}`;
        const resultElement = document.getElementById('result');
        resultElement.style.display = 'block';
        setTimeout(() => resultElement.classList.add('show'), 10);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
}
