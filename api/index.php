<?php

use Silex\Provider\DoctrineServiceProvider;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

require_once __DIR__ . '/vendor/autoload.php';


$app = new Silex\Application();
date_default_timezone_set('Europe/Helsinki');

# MIDDLEWARE:

$app->before(function (Request $request) {
    $params = [];
    if($request->headers->get('Content-Type') === 'application/json' && $content = $request->getContent()) {
        $params = json_decode($content, true);
        if ($params === null) {
            throw new Exception("Bad JSON");
        }
    }
    $params += $request->query->all();
    $request->request->replace($params);
});



$app->register(new DoctrineServiceProvider(), [
    'db.options' => [
        'driver' => 'pdo_mysql',
        'db' => 'CalendarDemo',
        'host' => 'localhost',
        'user' => 'CalendarDemo',
        'password' => 'password1',
        'charset' => 'utf-8',
        'port' => 3306,
    ],
]);


# ROUTES:

/** @var Doctrine\DBAL\Connection[] $app */

$app->get('/', function () {
    return 'CalendarDemo API';
});

$app->get('/notes', function (Request $request) use ($app) {
    $params = $request->request->all();
    if(isset($params['id'])) {
        $result = $app['db']->fetchAssoc(
            "SELECT * FROM calendar_notes WHERE id = ?",
            [$params['id']]
        );
    }
    elseif(allset($params, 'start', 'end')) {
        $result = $app['db']->fetchAll(
            "SELECT * FROM calendar_notes WHERE date BETWEEN ? AND ?",
            select($params, 'start', 'end')
        );
    }
    else {
        $result = [];
    }

    return new JsonResponse($result);
});

$app->put('/notes', function (Request $request) use ($app) {
    $params = $request->request->all();
    if(allset($params, 'date', 'title', 'description')) {
        if(isset($params['id'])) {
            $count = $app['db']->update("calendar_notes", $params, ['id' => $params['id']]);
        }
        else {
            $count = $app['db']->insert("calendar_notes", $params);
        }
    }
    else $count = 0;
    return new JsonResponse($count);
});

$app->delete('/notes', function (Request $request) use ($app) {
    $params = $request->request->all();
    if(isset($params['id'])) {
        $count = $app['db']->delete('calendar_notes',  ['id' => $params['id']]);
    }
    else $count = 0;
    return new JsonResponse($count);
});


//HELPERS:

function allset(array $arr, ...$keys){
    while($next = next($keys)) {
        if(!isset($arr[$next])) return false;
    }
    return true;
}

function select(array $arr, ...$keys){
    $ret = [];
    while($next = next($keys)) {
        if(isset($arr[$next])) $ret[$next] = $arr[$next];
    }
    return $ret;
}


$app->run();

return $app;