const celdas = [];
const RETICULA = 28;
let ancho;
let alto;

const azulejos = [];
const NA = 11; // número de azulejos

const reglas = [
  //Reglas de los bordes de cada azulejo

  // tile0
  {
    UP: 0,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 0,
  },
  //tile1
  {
    UP: 1,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 0,
  },
  //tile2
  {
    UP: 0,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 1,
  },
  //tile3
  {
    UP: 1,
    RIGHT: 1,
    DOWN: 0,
    LEFT: 1,
  },
  //tile4
  {
    UP: 1,
    RIGHT: 0,
    DOWN: 1,
    LEFT: 1,
  },
  //tile5
  {
    UP: 1,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 1,
  },
  //tile6
  {
    UP: 1,
    RIGHT: 1,
    DOWN: 0,
    LEFT: 0,
  },
  //tile7
  {
    UP: 0,
    RIGHT: 0,
    DOWN: 1,
    LEFT: 1,
  },
  //tile8
  {
    UP: 0,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 0,
  },
  //tile9
  {
    UP: 1,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 1,
  },
  //tile10
  {
    UP: 0,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 0,
  },
];

function preload() {
  for (let i = 0; i < NA; i++) {
    azulejos[i] = loadImage("azulejos/tile" + i + ".png");
  }
}

function setup() {
  createCanvas(1080, 1080);
  ancho = width / RETICULA;
  alto = height / RETICULA;

  let opcionesInit = [];

  for (let i = 0; i < azulejos.length; i++) {
    opcionesInit.push(i);
  }

  for (let i = 0; i < RETICULA * RETICULA; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesInit,
    };
  }
}

function draw() {
  const celdaDis = celdas.filter((celda) => {
    return celda.colapsada == false;
  });

  if (celdaDis.length > 0) {
    celdaDis.sort((a, b) => {
      return a.opciones.length - b.opciones.length;
    });
    const celdasXColapsar = celdaDis.filter((celda) => {
      return celda.opciones.length == celdaDis[0].opciones.length;
    });

    const celdaSelec = random(celdasXColapsar);
    celdaSelec.colapsada = true;

    const opcionSelec = random(celdaSelec.opciones);
    celdaSelec.opciones = [opcionSelec];

    print(opcionSelec);

    for (let x = 0; x < RETICULA; x++) {
      for (let y = 0; y < RETICULA; y++) {
        const celdaIndex = x + y * RETICULA;
        const celdaActual = celdas[celdaIndex];
        if (celdaActual.colapsada) {
          const indiceAzulejo = celdaActual.opciones[0];
          image(azulejos[indiceAzulejo], x * ancho, y * alto, ancho, alto);
        } else {
          strokeWeight(4);
          rect(x * ancho, y * alto, ancho, alto);
        }
      }
    }

    // Actualizar las opciones de las celdas vecinas
    for (let x = 0; x < RETICULA; x++) {
      for (let y = 0; y < RETICULA; y++) {
        const celdaIndex = x + y * RETICULA;
        const celdaActual = celdas[celdaIndex];

        if (celdaActual.colapsada) {
          const indiceAzulejo = celdaActual.opciones[0];
          const reglasActuales = reglas[indiceAzulejo];

          // Monitorear UP
          if (y > 0) {
            const indiceUP = x + (y - 1) * RETICULA;
            const celdaUp = celdas[indiceUP];
            if (!celdaUp.colapsada) {
              cambiarDireccion(celdaUp, reglasActuales["UP"], "DOWN");
            }
          }

          // Monitorear RIGHT
          if (x < RETICULA - 1) {
            const indiceRight = x + 1 + y * RETICULA;
            const celdaRight = celdas[indiceRight];
            if (!celdaRight.colapsada) {
              cambiarDireccion(celdaRight, reglasActuales["RIGHT"], "LEFT");
            }
          }

          // Monitorear DOWN
          if (y < RETICULA - 1) {
            const indiceDown = x + (y + 1) * RETICULA;
            const celdaDown = celdas[indiceDown];
            if (!celdaDown.colapsada) {
              cambiarDireccion(celdaDown, reglasActuales["DOWN"], "UP");
            }
          }

          // Monitorear LEFT
          if (x > 0) {
            const indiceLeft = x - 1 + y * RETICULA;
            const celdaLeft = celdas[indiceLeft];
            if (!celdaLeft.colapsada) {
              cambiarDireccion(celdaLeft, reglasActuales["LEFT"], "RIGHT");
            }
          }
        }
      }
    }
  } else {
    noLoop();
  }
}
