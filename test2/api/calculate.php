<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$plants = (int)($input['plants'] ?? 0);
$potVol = (int)($input['potVol'] ?? 0);

if ($plants < 1 || $plants > 16 || $potVol < 3 || $potVol > 20) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректные входные данные']);
    exit;
}

// Подключаем данные
include '../assets/data/products.php';

// Логика калькулятора (копируем из JS, но на PHP)
function selectTentAndVentilation($p, $tents, $filters, $fans) {
    $tent = null;
    foreach ($tents as $t) {
        if ($p <= $t['maxPlants']) {
            $tent = $t;
            break;
        }
    }
    if (!$tent) $tent = end($tents);

    $filter = null;
    $fan = null;
    if ($tent['area'] <= 0.36) {
        $filter = $filters['250'];
        $fan = $fans['100'];
    } elseif ($tent['area'] <= 0.72) {
        $filter = $filters['350'];
        $fan = $fans['125'];
    } elseif ($tent['area'] <= 1.0) {
        $filter = $filters['500'];
        $fan = $fans['150'];
    } else {
        $filter = $filters['800'];
        $fan = $fans['150'];
    }

    return ['tent' => $tent, 'filter' => $filter, 'fan' => $fan];
}

function selectPotSize($p, $potVol) {
    $minPotSize = $p <= 3 ? 3 : ($p <= 8 ? 5 : 7);
    $selectedPotSize = max($minPotSize, $potVol);
    if ($selectedPotSize <= 3) return 3;
    if ($selectedPotSize <= 5) return 5;
    if ($selectedPotSize <= 7) return 7;
    if ($selectedPotSize <= 10) return 10;
    if ($selectedPotSize <= 15) return 15;
    return 20;
}

function selectLamp($l, $w) {
    $area = ($l / 100) * ($w / 100);
    if ($area <= 0.64) {
        return ['name' => 'Комплект Quantum Board 240 Вт', 'price' => 18900, 'url' => 'https://minifermer.ru/category/c266/', 'power' => 240];
    } elseif ($area <= 1.2) {
        return ['name' => 'Комплект Quantum Board 360 Вт', 'price' => 25900, 'url' => 'https://minifermer.ru/category/c311/', 'power' => 360];
    } else {
        $units = ceil($area / 2.0);
        return [
            'name' => "Комплект Quantum Board 480 Вт" . ($units > 1 ? " ×{$units}" : ''),
            'price' => 32900 * $units,
            'url' => 'https://minifermer.ru/category/c294/',
            'power' => 480 * $units
        ];
    }
}

$result = selectTentAndVentilation($plants, $products['tents'], $products['filters'], $products['fans']);
$tent = $result['tent'];
$filter = $result['filter'];
$fan = $result['fan'];

$potSize = selectPotSize($plants, $potVol);
$pot = $products['pots'][$potSize];
$lamp = selectLamp($tent['l'], $tent['w']);

$totalPotsPrice = $pot['price'] * $plants;

$calculatedProducts = [
    ['name' => "Гроутент {$tent['name']}", 'price' => $tent['price'], 'url' => $tent['url'], 'icon' => 'fa-tent'],
    ['name' => $lamp['name'], 'price' => $lamp['price'], 'url' => $lamp['url'], 'icon' => 'fa-lightbulb'],
    ['name' => "{$plants} шт. {$pot['name']}", 'price' => $totalPotsPrice, 'url' => $pot['url'], 'icon' => 'fa-seedling'],
    ['name' => $filter['name'], 'price' => $filter['price'], 'url' => $filter['url'], 'icon' => 'fa-filter'],
    ['name' => $fan['name'], 'price' => $fan['price'], 'url' => $fan['url'], 'icon' => 'fa-fan']
];

$total = array_reduce($calculatedProducts, function($sum, $item) {
    return $sum + $item['price'];
}, 0);

echo json_encode([
    'products' => $calculatedProducts,
    'total' => $total
]);
?>
