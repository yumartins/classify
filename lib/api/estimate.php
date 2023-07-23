<?php 
  function distance_in_days($endAt, $startAt) {
    $end = new DateTime($endAt);
    $start = new DateTime($startAt);

    $interval = $start->diff($end);

    return $interval->days;
  }

  function estimate($params) {
    $data = get_option('classify_configuration');

    $options = $data[$params['calculationType'] ?? 'balcony'];

    $amount = 0;

    $amount += $params['numberOfLinesTitle'] * $options['valuePerLine'];

    if ($params['category'] !== '12 - Atas e Editais') {
      $amount += $params['numberOfLinesBody'] * $options['valuePerLine'];
    }

    $amount += $options[$params['titleType']];

    $amount += $options[$params['bodyType']];

    if ($params['hasLogo']) {
      $amount += $options[$params['logoType']];
    }

    $days = distance_in_days($params['endAt'], $params['startAt']);

    if ($days > 0) {
      $amount += $days * $options['valuePerDay'];
    }

    if ($params['numberOfPhotosInTheGallery'] > 0) {
      $amount += $params['numberOfPhotosInTheGallery'] * $options['valuePerImage'];
    }

    return $amount;
  }
?> 