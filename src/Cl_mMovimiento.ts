import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

export interface iMovimiento {
    id: number | null;
    creadoEl: string | null;
    alias: string | null;
    fechaHora: string;
    referencia: string;
    tipo: string;
    categoria: string;
    descripcion: string;
    cargo: number | null;
    abono: number | null;
}

export default class Cl_mMovimiento extends Cl_mTablaWeb{
    private _fechaHora = "";
    private _referencia = "";
    private _tipo = "";
    private _categoria = "";
    private _descripcion = "";
    private _cargo: number | null = null;
    private _abono: number | null = null;
    
    constructor(datos: any = {
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
        super({id: datos.id, creadoEl: datos.creadoEl, alias: datos.alias});
        this.fechaHora = datos.fechaHora;
        this.referencia = datos.referencia;
        this.tipo = datos.tipo;
        this.categoria = datos.categoria;
        this.descripcion = datos.descripcion;
        
        if (datos.cargo !== undefined && datos.cargo !== null) {
            this.cargo = datos.cargo;
        } else if (datos.tipo === "Cargo" && datos.monto !== undefined) {
            this.cargo = datos.monto;
        } else {
            this.cargo = null;
        }

        if (datos.abono !== undefined && datos.abono !== null) {
            this.abono = datos.abono;
        } else if (datos.tipo === "Abono" && datos.monto !== undefined) {
            this.abono = datos.monto;
        } else {
            this.abono = null;
        }
    }

    set fechaHora(fechaHora: string) {
        this._fechaHora = fechaHora;
    }

    get fechaHora(): string {
        return this._fechaHora;
    }

    set referencia(referencia: string) {
        this._referencia = referencia;
    }

    get referencia(): string {
        return this._referencia;
    }

    set tipo(tipo: string) {
        this._tipo = tipo;
    }

    get tipo(): string {
        return this._tipo;
    }

    set categoria(categoria: string) {
        this._categoria = categoria;
    }

    get categoria(): string {
        return this._categoria;
    }

    set descripcion(descripcion: string) {
        this._descripcion = descripcion;
    }

    get descripcion(): string {
        return this._descripcion;
    }

    set cargo(cargo: number | null) {
        this._cargo = cargo;
    }

    get cargo(): number | null {
        return this._cargo;
    }

    set abono(abono: number | null) {
        this._abono = abono;
    }

    get abono(): number | null {
        return this._abono;
    }

    montoOperacion(): number {
        if (this._cargo !== null && this._cargo !== undefined) return -this._cargo;
        if (this._abono !== null && this._abono !== undefined) return this._abono;
        return 0;
    }

    get fechaHoraOK(): boolean {
        const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
        return regex.test(this._fechaHora);
    }

    get referenciaOK(): boolean {
        const regex = /^[A-Za-z]{3}-\d{3}$/;
        this._referencia = this._referencia.toUpperCase();
        return regex.test(this._referencia);
    } 

    get tipoOK(): boolean {
        return this._tipo === "Abono" || this._tipo === "Cargo";
    }

    get categoriaOK(): boolean {
        return this._categoria.length > 0;
    }

    get descripcionOK(): boolean {
        return this._descripcion.length > 0 && this._descripcion.length < 50;
    }

    get montoOK(): boolean {
        if (this._tipo === "Cargo") {
            return (this._cargo !== null && this._cargo > 0) && this._abono === null;
        }
        if (this._tipo === "Abono") {
            return (this._abono !== null && this._abono > 0) && this._cargo === null;
        }
        return false;
    }

    get movimientoOK(): string | true {
        if (!this.fechaHoraOK) return "Fecha y Hora";
        if (!this.referenciaOK) return "Referencia";
        if (!this.tipoOK) return "Tipo";
        if (!this.categoriaOK) return "Categoria";
        if (!this.descripcionOK) return "Descripcion";
        if (!this.montoOK) return "Monto";
        return true;
    }

    toJSON(): iMovimiento {
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