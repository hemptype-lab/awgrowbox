document.addEventListener('DOMContentLoaded', () => {
    console.log("GrowBox Calculator запущен");

    // Инициализация темы
    ThemeManager.init();

    // Инициализация калькулятора
    Calculator.init();

    // Обновление значения слайдера растений при изменении
    const plantsSlider = document.getElementById('plants');
    const plantsValue = document.getElementById('plants-value');

    plantsSlider.addEventListener('input', () => {
        plantsValue.textContent = plantsSlider.value;
    });

    // Обработчик кнопки
    document.getElementById('calculate').addEventListener('click', () => {
        const plants = parseInt(plantsSlider.value);

        Calculator.calculate(plants);
    });
});
