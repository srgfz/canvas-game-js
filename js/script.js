

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

import { Avatar } from "./Avatar.js"

//Variables:
let player
let numEnemigos = 4
let velocidadEnemigos = 1500
let enemigos = []//Array que contendrá la instancia de los enemigos
let casillaJugador = [1, 1]//Controlador de la posición del jugador en el tablero
let enemyInterval
let llave = false//Controlador si tiene la llave o no
let arrayIndexCamino = []

const widthCanvas = 640
const heightCanvas = 352
const widthbox = 32
const heightbox = 32
//Coordenadas del Tilemap de las distintas imgs:
const coordCamino = [64, 0]
const coordPlayer = [32, 32]
const coordEnemy = [0, 32]
const coordTilemapKey = [96, 0]
const coorTilemapPuerta = [32, 0]
const coorTilamapMuro = [0, 0]



// Tilemap
let imgTilemap = document.createElement("img")
imgTilemap.setAttribute("SRC", "./assets/images/tilemap.png")


//*Tablero
let arrayTablero = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 5, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
let tablero = []//la posición 0 será el eje Y y la posición 1 será el eje X

//*Recorro el tablero y voy creando las casillas
const generarTablero = () => {
    let mapX = 0
    let mapY = 0
    let tilemapCoordinates = []
    arrayTablero.map((row, indexY) => {
        let filaCamino = []//Reseteo la fila del camino
        mapX = 0//Reseteo las coordenadas x
        row.map((casilla, indexX) => {
            //Condicional ternario para determinar la imagen de la casilla según las coordenadas del tilemap
            tilemapCoordinates = casilla === 0 ? coorTilamapMuro : casilla === 1 ? coordCamino : casilla === 2 ? coordEnemy : casilla === 3 ? coorTilemapPuerta : coordTilemapKey
            ctx.drawImage(
                imgTilemap,
                tilemapCoordinates[0],
                tilemapCoordinates[1],
                widthbox,
                heightbox,
                mapX,
                mapY,
                widthbox,
                heightbox
            )
            mapX += widthbox//Voy sumando las cordenadas x
            //Guardo un array con el index de l camino para posteriormente generar enemigos aleatoriamente en ese camino a través de este array:
            if (casilla === 1 && !(indexY < 3 && indexX < 3)) {//Controlo también que no aparezcan en un área demasiado cercano al jugador
                filaCamino.push(indexX)
            }
        })
        mapY += heightbox//Voy sumando las cordenadas y
        //Añado la fila de camino al arrayCamino, aunque esté vacia de casillas de camino ya que eso lo compruebo luego al generar los enemigos:
        arrayIndexCamino.push(filaCamino)
    })
}

const borrarCanvas = () => {
    canvas.width = widthCanvas
    canvas.height = heightCanvas
}

const generarAvatar = () => {
    player = new Avatar(
        ctx,
        imgTilemap,
        coordPlayer[0],
        coordPlayer[1],
        widthbox,
        heightbox,
        casillaJugador[0] * widthbox,
        casillaJugador[1] * heightbox,
        "jugador",
    )
    player.dibujarAvatar()
}

const generarEnemigo = () => {
    let posYenemy = 0
    let posXenemy = 0
    let indexXenemy
    do {
        posYenemy = Math.floor(Math.random() * arrayIndexCamino.length)
    } while (arrayIndexCamino[posYenemy].length === 0)//Si no hay ningún camino en la fila generará otro número
    indexXenemy = Math.floor(Math.random() * arrayIndexCamino[posYenemy].length)
    posXenemy = arrayIndexCamino[posYenemy][indexXenemy]
    //Eliminamos la posición que ha salido del array camino
    arrayIndexCamino[posYenemy].splice(indexXenemy, 1)
    enemigos.push(new Avatar(
        ctx,
        imgTilemap,
        coordEnemy[0],
        coordEnemy[1],
        widthbox,
        heightbox,
        posXenemy * widthbox,
        posYenemy * heightbox,
        "enemigo",
    ))
    enemigos.forEach(enemigo => enemigo.dibujarAvatar())
}

const moverEnemigo = () => {
    let movimiento
    enemigos.forEach(enemigo => {
        do {
            movimiento = Math.ceil(Math.random() * 4)
        } while (!moverAvatar(movimiento, enemigo, coordEnemy));
    })
}

const iniciar = () => {
    llave = false
    casillaJugador = [1, 1]
    arrayIndexCamino = []
    generarTablero()
    generarAvatar()
    //Dibujo los enemigos:
    for (let index = 0; index < numEnemigos; index++) {
        generarEnemigo()
    }
    enemyInterval = setInterval(moverEnemigo, velocidadEnemigos)
}

const gameOver = () => {
    enemigos = []
    clearInterval(enemyInterval)
    borrarCanvas()
    iniciar()
}

const comprobarColision = () => {
    if (enemigos.some(enemigo => enemigo.getMapY() === player.getMapY() && enemigo.getMapX() === player.getMapX())) {//Colisión con un enemigo: acaba la partida
        alert("GameOver")
        numEnemigos -= numEnemigos > 4 ? 1 : 0
        velocidadEnemigos += velocidadEnemigos < 1800 ? 100 : 0
        gameOver()
    } else if (arrayTablero[player.getMapY() / heightbox][player.getMapX() / widthbox] === 5 && !llave) {//Si coge la llave
        llave = true
        console.log("Llave conseguida!!")
    } else if (arrayTablero[player.getMapY() / heightbox][player.getMapX() / widthbox] === 3 && llave) {//Si llega a la puerta y tiene la llave
        alert("Ha ganado!!! Ahora será más dificil")
        numEnemigos += numEnemigos < 10 ? 1 : 0
        velocidadEnemigos -= velocidadEnemigos > 1000 ? 100 : 0
        gameOver()
    }
}

const comprobarDestino = (coordsDestino, avatar) => {
    let movimientoPosible = true
    let newPosY = (avatar.getMapY() / heightbox) + coordsDestino[1]
    let newPosX = (avatar.getMapX() / widthbox) + coordsDestino[0]
    //Si el destino es muro no se podrá acceder y no se realizará el movimiento, o si se trata del enemigo no podrá acceder a la llave, ni a la puerta ni a ningún enemigo
    if (arrayTablero[newPosY][newPosX] === 0 || (arrayTablero[newPosY][newPosX] === 3 && !llave)) {//Si no es camino o es la puerta pero no ha cogido la llave
        movimientoPosible = false
    } else if (avatar.getType() == "enemigo" && (arrayTablero[newPosY][newPosX] === 5 || arrayTablero[newPosY][newPosX] === 3
        || enemigos.some(enemigo => enemigo.getMapY() / heightbox == newPosY && enemigo.getMapX() / widthbox == newPosX))) {
        movimientoPosible = false
    }
    //return (arrayTablero[newPosY][newPosX] !== 0) 

    return movimientoPosible//Si es muro no podrá acceder y no se realizará el movimiento o si es llave o un enemigo tampoco
}

const moverAvatar = (movimiento, avatar, coordTilemap) => {
    let movimientoPosible = false
    if (movimiento === 1) {//Izquierda
        if (((avatar.getMapX() / heightbox) - 1 >= 0) && comprobarDestino([-1, 0], avatar)) {//Si está dentro del tablero y el destino es posible
            //Actualizo la posición del avatar y realizo el movimiento
            movimientoPosible = true
            avatar.cambiarCasillaOrigen(coordCamino)
            avatar.moverAvatar(movimiento, coordTilemap)
        }
    } else if (movimiento === 2) {//Derecha
        if (((avatar.getMapX() / heightbox) + 1 <= widthCanvas / widthbox) && comprobarDestino([1, 0], avatar)) {//Si está dentro del tablero y el destino es posible(es tierra, llave, puerta o enemigo)
            //Actualizo la posición del avatar
            //Actualizo la posición del avatar y realizo el movimiento
            movimientoPosible = true
            avatar.cambiarCasillaOrigen(coordCamino)
            avatar.moverAvatar(movimiento, coordTilemap)
        }
    } else if (movimiento === 3) {//Arriba
        if (((avatar.getMapY() / heightbox) - 1 >= 0) && comprobarDestino([0, -1], avatar)) {//Si está dentro del tablero
            //Actualizo la posición del avatar
            //Actualizo la posición del avatar y realizo el movimiento
            movimientoPosible = true
            avatar.cambiarCasillaOrigen(coordCamino)
            avatar.moverAvatar(movimiento, coordTilemap)
        }
    } else if (movimiento === 4) {//Abajo
        if (((avatar.getMapY() / heightbox) + 1 <= heightCanvas / heightbox) && comprobarDestino([0, 1], avatar)) {//Si está dentro del tablero
            //Actualizo la posición del avatar
            //Actualizo la posición del avatar y realizo el movimiento
            movimientoPosible = true
            avatar.cambiarCasillaOrigen(coordCamino)
            avatar.moverAvatar(movimiento, coordTilemap)
        }
    }
    if (movimientoPosible) {
        comprobarColision()
    }
    return movimientoPosible
}


const controladorJuego = (e) => {
    let tecla = e.keyCode
    if (tecla === 37) {//Izquierda
        moverAvatar(1, player, coordPlayer)
    } else if (tecla === 39) {//Derecha
        moverAvatar(2, player, coordPlayer)
    } else if (tecla === 38) {//Arriba
        moverAvatar(3, player, coordPlayer)
    } else if (tecla === 40) {//Abajo
        moverAvatar(4, player, coordPlayer)
    }
}




//*LISTENERS:
document.addEventListener("keydown", controladorJuego)
document.addEventListener("DOMContentLoaded", iniciar)