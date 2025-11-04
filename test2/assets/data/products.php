<?php
header('Content-Type: application/json');

// Данные о товарах
$products = [
    'tents' => [
        ['key' => '40', 'name' => 'Minifermer Green 40х40х120см', 'l' => 40, 'w' => 40, 'h' => 120, 'area' => 0.16, 'maxPlants' => 1, 'price' => 9990, 'url' => 'https://minifermer.ru/product_3509.html'],
        ['key' => '60', 'name' => 'Minifermer Green 60х60х140см', 'l' => 60, 'w' => 60, 'h' => 140, 'area' => 0.36, 'maxPlants' => 3, 'price' => 12990, 'url' => 'https://minifermer.ru/product_3510.html'],
        ['key' => '80', 'name' => 'Minifermer Green 80х80х160см', 'l' => 80, 'w' => 80, 'h' => 160, 'area' => 0.64, 'maxPlants' => 5, 'price' => 15990, 'url' => 'https://minifermer.ru/product_3511.html'],
        ['key' => '100', 'name' => 'Minifermer 100х100х200см', 'l' => 100, 'w' => 100, 'h' => 200, 'area' => 1.00, 'maxPlants' => 8, 'price' => 18990, 'url' => 'https://minifermer.ru/product_1534.html'],
        ['key' => '120', 'name' => 'Minifermer 120х120х200см', 'l' => 120, 'w' => 120, 'h' => 200, 'area' => 1.44, 'maxPlants' => 12, 'price' => 19990, 'url' => 'https://minifermer.ru/product_1535.html'],
        ['key' => '150', 'name' => 'Minifermer Green 150х150х200см', 'l' => 150, 'w' => 150, 'h' => 200, 'area' => 2.25, 'maxPlants' => 16, 'price' => 24990, 'url' => 'https://minifermer.ru/product_1373.html'] // Предполагаемый URL для 150
    ],
    'pots' => [
        3 => ['name' => 'Тканевый горшок 3 л', 'price' => 66, 'url' => 'https://minifermer.ru/product_1315.html'],
        5 => ['name' => 'Тканевый горшок 5 л', 'price' => 78, 'url' => 'https://minifermer.ru/product_1316.html'],
        7 => ['name' => 'Тканевый горшок 7 л', 'price' => 104, 'url' => 'https://minifermer.ru/product_1354.html'],
        10 => ['name' => 'Тканевый горшок 10 л', 'price' => 128, 'url' => 'https://minifermer.ru/product_1355.html'],
        15 => ['name' => 'Тканевый горшок 15 л', 'price' => 154, 'url' => 'https://minifermer.ru/product_1358.html'],
        20 => ['name' => 'Тканевый горшок 20 л', 'price' => 176, 'url' => 'https://minifermer.ru/product_1373.html']
    ],
    'filters' => [
        '250' => ['name' => 'Угольный фильтр Magicfilter 250/100', 'price' => 3990, 'url' => 'https://minifermer.ru/product_2273.html'],
        '350' => ['name' => 'Угольный фильтр Magicfilter 350/125', 'price' => 4290, 'url' => 'https://minifermer.ru/product_2274.html'],
        '500' => ['name' => 'Угольный фильтр Magicfilter 500/150', 'price' => 5490, 'url' => 'https://minifermer.ru/product_2275.html'],
        '800' => ['name' => 'Угольный фильтр Magicfilter 800/150', 'price' => 6990, 'url' => 'https://minifermer.ru/product_2276.html']
    ],
    'fans' => [
        '100' => ['name' => 'Канальный вентилятор HF 100', 'price' => 2190, 'url' => 'https://minifermer.ru/product_3737.html'],
        '125' => ['name' => 'Канальный вентилятор HF 125', 'price' => 2490, 'url' => 'https://minifermer.ru/product_3738.html'],
        '150' => ['name' => 'Канальный вентилятор HF 150', 'price' => 2890, 'url' => 'https://minifermer.ru/product_3739.html']
    ]
];

echo json_encode($products);
?>
