import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mMovimiento extends Cl_mTablaWeb {
    _fechaHora = "";
    _referencia = "";
    _tipo = "";
    _categoria = "";
    _descripcion = "";
    _cargo = null;
    _abono = null;
    constructor(datos = {
        id: null,
        creadoEl: null,
        alias: null,
        fechaHora: "",
        referencia: "",
        tipo: "",
        categoria: "",
        descripcion: "",
        cargo: null,
        abono: null,
    }) {
        super({ id: datos.id, creadoEl: datos.creadoEl, alias: datos.alias });
        this.fechaHora = datos.fechaHora;
        this.referencia = datos.referencia;
        this.tipo = datos.tipo;
        this.categoria = datos.categoria;
        this.descripcion = datos.descripcion;
        if (datos.cargo !== undefined && datos.cargo !== null) {
            this.cargo = datos.cargo;
        }
        else if (datos.tipo === "Cargo" && datos.monto !== undefined) {
            this.cargo = datos.monto;
        }
        else {
            this.cargo = null;
        }
        if (datos.abono !== undefined && datos.abono !== null) {
            this.abono = datos.abono;
        }
        else if (datos.tipo === "Abono" && datos.monto !== undefined) {
            this.abono = datos.monto;
        }
        else {
            this.abono = null;
        }
    }
    set fechaHora(fechaHora) {
        this._fechaHora = fechaHora;
    }
    get fechaHora() {
        return this._fechaHora;
    }
    set referencia(referencia) {
        this._referencia = referencia;
    }
    get referencia() {
        return this._referencia;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
    get tipo() {
        return this._tipo;
    }
    set categoria(categoria) {
        this._categoria = categoria;
    }
    get categoria() {
        return this._categoria;
    }
    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }
    get descripcion() {
        return this._descripcion;
    }
    set cargo(cargo) {
        this._cargo = cargo;
    }
    get cargo() {
        return this._cargo;
    }
    set abono(abono) {
        this._abono = abono;
    }
    get abono() {
        return this._abono;
    }
    montoOperacion() {
        if (this._cargo !== null && this._cargo !== undefined)
            return -this._cargo;
        if (this._abono !== null && this._abono !== undefined)
            return this._abono;
        return 0;
    }
    get fechaHoraOK() {
        const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
        return regex.test(this._fechaHora);
    }
    get referenciaOK() {
        const regex = /^[A-Za-z]{3}-\d{3}$/;
        this._referencia = this._referencia.toUpperCase();
        return regex.test(this._referencia);
    }
    get tipoOK() {
        return this._tipo === "Abono" || this._tipo === "Cargo";
    }
    get categoriaOK() {
        return this._categoria.length > 0;
    }
    get descripcionOK() {
        return this._descripcion.length > 0 && this._descripcion.length < 50;
    }
    get montoOK() {
        if (this._tipo === "Cargo") {
            return (this._cargo !== null && this._cargo > 0) && this._abono === null;
        }
        if (this._tipo === "Abono") {
            return (this._abono !== null && this._abono > 0) && this._cargo === null;
        }
        return false;
    }
    get movimientoOK() {
        if (!this.fechaHoraOK)
            return "Fecha y Hora";
        if (!this.referenciaOK)
            return "Referencia";
        if (!this.tipoOK)
            return "Tipo";
        if (!this.categoriaOK)
            return "Categoria";
        if (!this.descripcionOK)
            return "Descripcion";
        if (!this.montoOK)
            return "Monto";
        return true;
    }
    toJSON() {
        return {
            id: this.id,
            creadoEl: this.creadoEl,
            alias: this.alias,
            fechaHora: this.fechaHora,
            tipo: this.tipo,
            referencia: this.referencia,
            categoria: this.categoria,
            descripcion: this.descripcion,
            cargo: this.cargo,
            abono: this.abono,
        };
    }
}
