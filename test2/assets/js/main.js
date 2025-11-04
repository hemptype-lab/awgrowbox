document.addEventListener('DOMContentLoaded', () => {
    console.log("GrowBox Calculator запущен");

    // Инициализация темы
    ThemeManager.init();

    // Инициализация калькулятора
    Calculator.init();

    // Обновление значений слайдеров при изменении
    const plantsSlider = document.getElementById('plants');
    const plantsValue = document.getElementById('plants-value');
    const potSlider = document.getElementById('pot');
    const potValue = document.getElementById('pot-value');

    plantsSlider.addEventListener('input', () => {
        plantsValue.textContent = plantsSlider.value;
    });

    potSlider.addEventListener('input', () => {
        potValue.textContent = potSlider.value;
    });

    // Обработчик кнопки
    document.getElementById('calculate').addEventListener('click', () => {
        const plants = parseInt(plantsSlider.value);
        const potVol = parseInt(potSlider.value);

        Calculator.calculate(plants, potVol);
    });
});
