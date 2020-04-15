//
var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'visualizador.com',
    // Enable swipe panel
    panel: {
        swipe: 'left'
    },
    // Add default routes
    routes: [
        {
            path: '/home/',
            url: 'index.html'
        }
    ]
});

//
var ipServidor = '';
var idEmpresa = '';
var urlServer = '';
var urlVideos = '';
var urlImagen = '';

//
var $$ = Dom7;

//
var mainView = app.views.create('.view-main');

//
var arrayT = [];
var arrayC = [];
var arrayV = [];
var visualizador = 0;
var videoA = 0;
var sigTurno = false;

//
document.addEventListener('deviceready', function () {
    //
    if (localStorage.ipServidor === undefined) {
        //
        app.dialog.prompt('', 'Ip Servidor?', function (ip) {
            //
            localStorage.ipServidor = ip;
            ipServidor = ip;
            urlServer = 'http://' + ip + '/VisualizadorPortalPhp/';
            comprobarEmpresa();
        });
    } else {
        //
        ipServidor = localStorage.ipServidor;
        urlServer = 'http://' + ipServidor + '/VisualizadorPortalPhp/';
        comprobarEmpresa();
    }
});

//
function iniciar() {
    //inicializamos modal y voz para que lea el 1er paciente si ya hay alguno en espera antes de cargar la app
//    var modal = app.dialog.create({
//        title: 'MAMA',
//        text: 'MIA'
//    }).open();
    voz('', 0);
//    modal.close();
    //
    if (localStorage.visualizador === undefined) {
        //
        cargarListaVisualizadores(1);
    } else {
        //
        visualizador = localStorage.visualizador;
        //
        traerIpVisualizador();
        cargarListaVisualizadores(2);
    }
    //
    setInterval(function () {
        //
        app.request.post(urlServer + 'Read/fechaHora', {},
                function (rsp) {
                    //
                    var data = JSON.parse(rsp);
                    //
                    $$('#fecha').html(data.fecha);
                    $$('#hora').html(data.hora);
                });
    }, 5000);
}

//
function editarIpServidor() {
    //
    app.dialog.prompt('', 'Ip servidor', function (ip) {
        //
        localStorage.ipServidor = ip;
        ipServidor = ip;
        urlServer = 'http://' + ip + '/VisualizadorPortalPhp/';
        comprobarEmpresa();
    });
}

//
function comprobarEmpresa() {
    //
    if (localStorage.idEmpresa === undefined) {
        //
        app.dialog.prompt('', 'Id empresa', function (id) {
            //
            localStorage.idEmpresa = id;
            idEmpresa = id;
            iniciar();
        });
    } else {
        //
        idEmpresa = localStorage.idEmpresa;
        iniciar();
    }
}

//
function editarIdEmpresa() {
    //
    app.dialog.prompt('', 'Id empresa', function (id) {
        //
        localStorage.idEmpresa = id;
        idEmpresa = id;
        iniciar();
    });
}

//
function cargarListaVisualizadores(valor) {
    //
    app.request.post(urlServer + 'Read/cargarListaVisualizadores', {empresa: idEmpresa},
            function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                if (data.length > 0) {
                    //
                    var camposV = '<p>Seleccionar visualizador</p><div class="list"><ul>';
                    //
                    for (var i = 0; i < data.length; i++) {
                        //
                        camposV += '<li><a class="list-button item-link" href="#" onclick="visualizadorSeleccionado(' + data[i] + ')">Visualizador ' + data[i] + '</a></li>';
                    }
                    //
                    camposV += '</ul></div>';
                    //
                    document.getElementById("divListaVisualizadores").innerHTML = camposV;
                    //
                    if (valor === 1) {
                        //
                        document.getElementById("btnListaVisualizadores").click();
                    }
                }
            });
}

//
function visualizadorSeleccionado(valor) {
    //
    for (var i = 0; i < 5; i++) {
        //
        $$('#modulo' + i).html('');
        $$('#cliente' + i).html('');
    }
    //
    arrayT = [];
    arrayC = [];
    arrayV = [];
    visualizador = 0;
    videoA = 0;
    sigTurno = false;
    //
    visualizador = valor;
    localStorage.visualizador = visualizador;
    //
    traerIpVisualizador();
    //
    app.popup.close('.popover-visualizadores', true);
}

//
function traerIpVisualizador() {
    //
    app.request.post(urlServer + 'Read/traerIpVisualizador', {visualizador: visualizador, empresa: idEmpresa},
            function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                if (data.length !== 2) {
                    //
                    urlImagen = 'http://' + ipServidor + '/Magisoftv1Medico/Visualizador1/Imagenes/' + data[0]['ipVisualizador'] + '/';
                    urlVideos = 'http://' + ipServidor + '/Magisoftv1Medico/Visualizador1/Videos/' + data[0]['ipVisualizador'] + '/';
                    //
                    consultarTurnos();
                    cargarConfig();
                    cargarVideos();
                }
            });
}

//
function cargarVideos() {
    //
    app.request.post(urlServer + 'Read/cargarVideos', {visualizador: visualizador, empresa: idEmpresa},
            function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                if (data.length > 0) {
                    //
                    arrayV = data;
                    //
                    if (videoA === 0) {
                        //
                        actualizarVideos();
                    }
                }
            });
}

//
function actualizarVideos() {
    //
    var videoR = document.getElementById("video");
    //
    if (arrayV.length === videoA) {
        //
        videoA = 0;
    }
    //
    if (arrayV.length > 0) {
        //
        var vol = (arrayV[videoA]['volumen'] > 9) ? 1 : parseFloat("0." + arrayV[videoA]['volumen']);
        //
        videoR.volume = vol;
        //
        document.getElementById("video").innerHTML = '<source src="' + urlVideos + arrayV[videoA]['nombreVideo'] + '.mp4' + '" type="video/mp4">';
        //
        videoR.load();
        videoR.play();
        //
        videoA++;
    } else {
        //
        document.getElementById("video").innerHTML = '<source src="video/video.mp4" type="video/mp4">';
        //
        videoR.volume = 1;
        //
        videoR.load();
        videoR.play();
    }
    //
    setInterval(function () {
        //
        if (videoR.ended) {
            //
            actualizarVideos();
        }
    }, 1000);
}

//
function cargarConfig() {
    //
    app.request.post(urlServer + 'Read/cargarConfig', {visualizador: visualizador, empresa: idEmpresa},
            function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                if (data.length > 0) {
                    //
                    for (var i = 0; i < 5; i++) {
                        //
                        document.getElementById("modulo" + i).style.fontSize = data[0]['tamanoLetra'] + 'px';
                        document.getElementById("cliente" + i).style.fontSize = data[0]['tamanoLetra'] + 'px';
                    }
                    //
                    var valorT = data[0]['tamanoLetra'] / 2;
                    document.getElementById("divFecha").style.fontSize = valorT + 'px';
                    document.getElementById("mesaje").style.fontSize = data[0]['tamanoLetra'] + 'px';
                    //
                    if (data[0]['nombrelogo'] !== '') {
                        //
                        document.getElementById("logoCambiar").setAttribute('src', urlImagen + data[0]['nombrelogo']);
                    }
                    //
                    $$('#mesaje').html('<MARQUEE WIDTH=100%>' + data[0]['mensaje'] + '</MARQUEE>');
                    //
                    arrayC = data[0];
                } else {
                    //
                    app.dialog.alert('Error al Cargar', 'Alerta');
                }
            });
}

//
function actualizarTurnos() {
    //
    console.log(arrayT.length);
    //
    if (arrayT.length > 0) {
        //
        for (var i = 0; i < arrayT.length; i++) {
            //
            $$('#modulo' + i).html(arrayT[i]['modulo']);
            $$('#cliente' + i).html(arrayT[i]['nombre']);
        }
        //
        var llamado = '';
        //
        if (arrayT[0]['tipo'] === 'TURNO') {
            //
            var arreglo = arrayT[0]['nombre'].split("");
            //
            var per = false;
            //
            arreglo.forEach(function (item) {
                //
                if (per) {
                    //
                    llamado += item;
                } else {
                    if (item === "-") {
                        //
                        llamado += " ";
                        per = true;
                    } else {
                        //
                        llamado += item;
                        llamado += ",";
                    }
                }
            });
        } else {
            //
            llamado = arrayT[0]['nombre'];
        }
        //
        var controlColorDiv = false;
        var controlColorDivT = 0;
        //
        var intervaloC = setInterval(function () {
            //
            controlColorDivT++;
            //
            if (controlColorDiv) {
                //
                document.getElementById("conttL").style.background = "linear-gradient(to bottom, rgba(43,123,160,1) 0%, rgba(16,63,84,1) 100%)";
                document.getElementById("divcontt").style.border = "2px #256e90 solid";
                //
                controlColorDiv = false;
            } else {
                //
                document.getElementById("conttL").style.background = "linear-gradient(to bottom, rgba(156,34,46,1) 0%, rgba(156,34,46,1) 12%, rgba(221,75,86,1) 100%)";
                document.getElementById("divcontt").style.border = "2px #c93e4a solid";
                //
                controlColorDiv = true;
            }
            //
            if (controlColorDivT >= 10) {
                //
                document.getElementById("conttL").style.background = "linear-gradient(to bottom, rgba(43,123,160,1) 0%, rgba(16,63,84,1) 100%)";
                document.getElementById("divcontt").style.border = "2px #256e90 solid";
                //
                clearInterval(intervaloC);
                //
                controlColorDivT = 0;
            }
        }, 1000);
        //
        modal = app.dialog.create({
            title: arrayT[0]['tipo'] + ', ' + arrayT[0]['nombre'],
            text: arrayT[0]['descripcion'] + ' ' + arrayT[0]['modulo']
        }).open();
        //
        var VolumenVoz = 0;
        //
        VolumenVoz = (parseInt(arrayC.volumenVoz));
        VolumenVoz = (VolumenVoz > 9) ? 1 : parseFloat("0." + VolumenVoz);
        //
        var video = document.getElementById("video");
        video.muted = true;
        //
        mensaje = "atencion " + arrayT[0]['tipo'] + " " + llamado + " diríjase al " + arrayT[0]['descripcion'] + " " + arrayT[0]['modulo'];
        voz(mensaje, VolumenVoz);
        //
        var intervalo = setInterval(function () {
            //
            modal.close();
            video.muted = false;
            consultarTurnos();
            //
            clearInterval(intervalo);
        }, 7000);
    }
}

//
function voz(text, volumen) {
    //
    var u = new SpeechSynthesisUtterance();
    //
    u.text = text;
    u.lang = 'es-ES';
    u.volume = volumen;
    speechSynthesis.speak(u);
}

//
function consultarTurnos() {
    //
    app.request.post(urlServer + 'Read/cargarTurno', {visualizador: visualizador, empresa: idEmpresa},
            function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                if (data !== 2) {
                    //
                    if (data[0]['modulo'] === '#12#.3421D') {
                        //
                        cargarVideos();
                        //
                        siguienteTruno();
                    } else {
                        //
                        if (arrayT.length > 0) {
                            //
                            var j = -1;
                            //
                            for (var i = 0; i < arrayT.length; i++) {
                                //
                                if (arrayT[i]['nombre'] === data[0]['nombre'] && arrayT[i]['modulo'] === data[0]['modulo']) {
                                    //
                                    j = i;
                                }
                            }
                            //
                            if (j !== -1) {
                                //
                                while (j >= 0) {
                                    //
                                    if (j === 0) {
                                        //
                                        arrayT[j] = data[0];
                                    } else {
                                        //
                                        arrayT[j] = arrayT[j - 1];
                                    }
                                    //
                                    j--;
                                }
                            } else {
                                //
                                var k = arrayT.length;
                                //
                                if (k > 4) {
                                    //
                                    k = 4;
                                }
                                //
                                while (k > 0) {
                                    //
                                    arrayT[k] = arrayT[k - 1];
                                    //
                                    k--;
                                    //
                                    if (k === 0) {
                                        //
                                        arrayT[k] = data[0];
                                    }
                                }
                            }
                        } else {
                            //
                            arrayT[0] = data[0];
                        }
                        //
                        actualizarTurnos();
                    }
                } else {
                    //
                    siguienteTruno();
                }
            }, function (error) {
        //
        siguienteTruno();
    });
}

//
function siguienteTruno() {
    //
    var intervaloT2 = setInterval(function () {
        //
        consultarTurnos();
        //
        clearInterval(intervaloT2);
    }, 2000);
}