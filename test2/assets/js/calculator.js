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

    static async calculate(p) {
        if (!this.data) {
            console.error("Данные калькулятора не загружены");
            return;
        }

        // Выбираем гроутент и вентиляцию на основе количества растений
        const { tent, filter, fan } = this.selectTentAndVentilation(p);

        // Рассчитываем объём горшка автоматически
        const { selectedPotSize, totalPotsCount, totalSubstrateVolume } = this.calculatePotVolume(tent, p);

        // Выбираем лампу на основе размеров гроутента
        const lamp = this.selectLamp(tent.l, tent.w);

        // Получаем данные о выбранном горшке
        const pot = this.data.pots[selectedPotSize];

        // Рассчитываем общую стоимость горшков
        const totalPotsPrice = pot.price * totalPotsCount;

        // Формируем список продуктов
        const products = [
            { name: `Гроутент ${tent.name}`, price: tent.price, url: tent.url, icon: 'fa-tent' },
            { name: lamp.name, price: lamp.price, url: lamp.url, icon: 'fa-lightbulb' },
            { name: `${totalPotsCount} шт. ${pot.name} (Общий объём субстрата: ${totalSubstrateVolume} л)`, price: totalPotsPrice, url: pot.url, icon: 'fa-seedling' },
            { name: filter.name, price: filter.price, url: filter.url, icon: 'fa-filter' },
            { name: fan.name, price: fan.price, url: fan.url, icon: 'fa-fan' }
        ];

        // Рассчитываем общую стоимость
        const total = products.reduce((sum, item) => sum + item.price, 0);
        const formattedTotal = total.toLocaleString('ru-RU') + ' ₽';

        // Отображаем результат
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

    static calculatePotVolume(tent, p) {
        // 1. Количество горшков = Площадь гроу-бокса (м²) ÷ Площадь под одно растение (м²)
        // Площадь под одно растение варьируется от 0.1 до 0.25 м² в зависимости от фазы роста и сорта.
        // Для упрощения используем среднее значение 0.16 м² на растение как базу, но увеличиваем для меньшего количества.
        // Адаптируем логику: для 1-3 растений - больше места, для 4+ - стандартное.
        let areaPerPlant = 0.25; // м² на растение для 1-2 растений
        if (p > 2 && p <= 5) areaPerPlant = 0.20; // для 3-5 растений
        if (p > 5) areaPerPlant = 0.16; // для 6+ растений

        const calculatedPotsCount = Math.floor(tent.area / areaPerPlant);
        const effectivePotsCount = Math.min(calculatedPotsCount, p); // Не больше, чем запрошено

        // 2. Выбор размера одного горшка на основе количества растений
        // Предположим, что для большего количества растений используются меньшие горшки, и наоборот.
        // Используем простую логику: 1-3 растения -> 10-20л, 4-8 растений -> 7-15л, 9-16 растений -> 3-10л
        let basePotSize = 20; // для 1-2 растений
        if (p > 2 && p <= 5) basePotSize = 15; // для 3-5 растений
        if (p > 5 && p <= 8) basePotSize = 10; // для 6-8 растений
        if (p > 8) basePotSize = 7; // для 9+ растений

        // Выбираем ближайший доступный размер из списка
        const availablePotSizes = Object.keys(this.data.pots).map(Number).sort((a, b) => a - b);
        let selectedPotSize = availablePotSizes[availablePotSizes.length - 1]; // по умолчанию самый большой
        for (const size of availablePotSizes) {
            if (size >= basePotSize) {
                selectedPotSize = size;
                break;
            }
        }

        // 3. Общий объём субстрата = Количество горшков × Объём одного горшка (л)
        const totalSubstrateVolume = effectivePotsCount * selectedPotSize;

        return {
            selectedPotSize: selectedPotSize,
            totalPotsCount: effectivePotsCount,
            totalSubstrateVolume: totalSubstrateVolume.toFixed(1) // Округляем до 1 знака после запятой
        };
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
