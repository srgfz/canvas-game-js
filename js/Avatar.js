export class Avatar {

    constructor(ctx, imgTilemap, tilemapX, tilemapY, widthbox, heightbox, mapX, mapY, type) {
        this.ctx = ctx;
        this.imgTilemap = imgTilemap;
        this.tilemapX = tilemapX;
        this.tilemapY = tilemapY;
        this.widthbox = widthbox;
        this.heightbox = heightbox;
        this.mapX = mapX;
        this.mapY = mapY;
        this.type = type;
    }
    //Getters y Setters:
    getCtx() {
        return this.ctx
    }

    getImgTilemap() {
        return this.imgTilemap
    }

    getTilemapX() {
        return this.tilemapX
    }

    getTilemapY() {
        return this.tilemapY
    }

    getWidthbox() {
        return this.widthbox
    }

    getHeightbox() {
        return this.heightbox
    }

    getMapX() {
        return this.mapX
    }

    getMapY() {
        return this.mapY
    }

    getType() {
        return this.type
    }


    setCtx(ctx) {
        this.ctx = ctx
    }

    setImgTilemap(imgTilemap) {
        this.imgTilemap = imgTilemap
    }

    setTilemapX(tilemapX) {
        this.tilemapX = tilemapX
    }

    setTilemapY(tilemapY) {
        this.tilemapY = tilemapY
    }

    setWidthbox(widthbox) {
        this.widthbox = widthbox
    }

    setHeightbox(heightbox) {
        this.heightbox = heightbox
    }

    setMapX(mapX) {
        this.mapX = mapX
    }

    setMapY(mapY) {
        this.mapY = mapY
    }

    setType(type) {
        this.type = type
    }

    //MÉTODOS PROPIOS DE LA CLASE
    dibujarAvatar() {
        this.ctx.drawImage(
            this.imgTilemap,
            this.tilemapX,
            this.tilemapY,
            this.widthbox,
            this.heightbox,
            this.mapX,
            this.mapY,
            this.widthbox,
            this.heightbox
        )
    }

    cambiarCasillaOrigen(coord) {
        this.setTilemapX(coord[0])
        this.setTilemapY(coord[1])
        this.dibujarAvatar()
    }

    moverAvatar(movimiento, coord) {
        this.setTilemapX(coord[0])
        this.setTilemapY(coord[1])
        if (movimiento === 1) {//Izquierda
            this.mapX -= this.widthbox
        } else if (movimiento === 2) {//Derecha
            this.mapX += this.widthbox
        } else if (movimiento === 3) {//Arriba
            this.mapY -= this.heightbox
        } else {//Abajo
            this.mapY += this.heightbox
        }
        //***Comprobar si ha dado contra un enemigo */
        this.dibujarAvatar()
    }


}