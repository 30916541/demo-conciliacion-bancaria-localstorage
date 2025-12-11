import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import Cl_controlador from "./Cl_controlador.js";
import { categoriasData } from "./_data.js";

export default class Cl_vReporte extends Cl_vGeneral {
    private _btRegresar: HTMLButtonElement;
    private _lblSaldoInicial: HTMLElement;
    private _lblSaldoFinal: HTMLElement;
    private _lblTotalCargos: HTMLElement;
    private _lblTotalAbonos: HTMLElement;
    private _lblPorcentajeCargos: HTMLElement;
    private _lblPorcentajeAbonos: HTMLElement;
    private _divCategoriasGrid: HTMLElement;

    constructor(controlador: Cl_controlador) {
        super({ formName: "vistaReporte" });
        
        this.formName = "reporte";
        
        this.controlador = controlador;

        this._btRegresar = this.crearHTMLButtonElement("btRegresar", {
            onclick: () => this.controlador?.mostrarVistaPrincipal()
        });

        this._lblSaldoInicial = this.crearHTMLElement("saldoInicial") as HTMLElement;
        this._lblSaldoFinal = this.crearHTMLElement("saldoFinal") as HTMLElement;
        this._lblTotalCargos = this.crearHTMLElement("totalCargos") as HTMLElement;
        this._lblTotalAbonos = this.crearHTMLElement("totalAbonos") as HTMLElement;
        this._lblPorcentajeCargos = this.crearHTMLElement("porcentajeCargos") as HTMLElement;
        this._lblPorcentajeAbonos = this.crearHTMLElement("porcentajeAbonos") as HTMLElement;
        
        this._divCategoriasGrid = document.getElementById("categoriasGrid") as HTMLElement;
    }

    mostrar(saldoInicial: number, movimientos: any[]) {
        this.ocultarTodo();
        if (this.vista) {
            this.vista.style.display = "block";
        }
        this.cargarReporte(saldoInicial, movimientos);
    }
    
    ocultarTodo() {
        const secciones = [
            "movimientoBancarios",
            "operaciones",
            "saldoTotal",
            "tablaMovimientos",
            "vistaConciliacion",
            "vistaDetalle",
            "vistaReporte",
            "acciones_contenedor"
        ];

        secciones.forEach(id => {
            const seccion = document.getElementById(id);
            if (seccion) {
                seccion.style.display = "none";
            }
        });
    }

    private cargarReporte(saldoInicial: number, movimientos: any[]) {
        const totalAbonos = movimientos
            .filter((m: any) => m.tipo === "Abono")
            .reduce((sum: number, m: any) => sum + Number(m.abono || 0), 0);

        const totalCargos = movimientos
            .filter((m: any) => m.tipo === "Cargo")
            .reduce((sum: number, m: any) => sum + Number(m.cargo || 0), 0);

        const saldoFinal = saldoInicial + totalAbonos - totalCargos;

        const totalMovimientos = totalAbonos + totalCargos;
        const porcentajeAbonos = totalMovimientos > 0 
            ? ((totalAbonos / totalMovimientos) * 100).toFixed(2) 
            : "0.00";
        const porcentajeCargos = totalMovimientos > 0 
            ? ((totalCargos / totalMovimientos) * 100).toFixed(2) 
            : "0.00";

        this._lblSaldoInicial.textContent = `${saldoInicial.toFixed(2)} Bs`;
        this._lblSaldoFinal.textContent = `${saldoFinal.toFixed(2)} Bs`;
        this._lblTotalCargos.textContent = `${totalCargos.toFixed(2)} Bs`;
        this._lblTotalAbonos.textContent = `${totalAbonos.toFixed(2)} Bs`;
        
        this._lblPorcentajeCargos.textContent = `${porcentajeCargos}%`;
        this._lblPorcentajeAbonos.textContent = `${porcentajeAbonos}%`;

        this.cargarMontosPorCategoria(movimientos);
    }

    private cargarMontosPorCategoria(movimientos: any[]) {
        if (!this._divCategoriasGrid) return;

        this._divCategoriasGrid.innerHTML = "";

        const montosPorCategoria = new Map<string, { nombre: string; totalCargos: number; totalAbonos: number }>();

        categoriasData.forEach((cat: any) => {
            montosPorCategoria.set(cat.nombre, {
                nombre: cat.nombre,
                totalCargos: 0,
                totalAbonos: 0
            });
        });

        movimientos.forEach(mov => {
            const categoriaNombre = mov.categoria;
            const catData = montosPorCategoria.get(categoriaNombre);
            
            if (catData) {
                if (mov.tipo === "Cargo") {
                    catData.totalCargos += Number(mov.cargo || 0);
                } else if (mov.tipo === "Abono") {
                    catData.totalAbonos += Number(mov.abono || 0);
                }
            }
        });

        montosPorCategoria.forEach((data, categoriaId) => {
            const total = data.totalAbonos - data.totalCargos;
            
            if (data.totalCargos > 0 || data.totalAbonos > 0) {
                const categoriaItem = document.createElement("div");
                categoriaItem.className = "categoria-item";

                const nombreSpan = document.createElement("span");
                nombreSpan.className = "categoria-nombre";
                nombreSpan.textContent = data.nombre;

                const montoDiv = document.createElement("div");
                montoDiv.style.textAlign = "right";

                const totalSpan = document.createElement("div");
                totalSpan.className = `categoria-monto ${total >= 0 ? 'abono' : 'cargo'}`;
                totalSpan.textContent = `${total.toFixed(2)} Bs`;
                totalSpan.style.fontWeight = "bold";
                montoDiv.appendChild(totalSpan);

                categoriaItem.appendChild(nombreSpan);
                categoriaItem.appendChild(montoDiv);
                this._divCategoriasGrid.appendChild(categoriaItem);
            }
        });

        if (this._divCategoriasGrid.children.length === 0) {
            const mensajeVacio = document.createElement("p");
            mensajeVacio.textContent = "No hay movimientos registrados aún.";
            mensajeVacio.style.textAlign = "center";
            mensajeVacio.style.color = "#8D6E63";
            mensajeVacio.style.gridColumn = "1 / -1";
            this._divCategoriasGrid.appendChild(mensajeVacio);
        }
    }
}
