import Cl_vMovimiento from "./Cl_vMovimiento.js";
import Cl_vConciliacion from "./Cl_vConciliacion.js";
export default class Cl_controlador {
    modelo;
    vista;
    vMovimiento;
    vConciliacion;
    resultadosConciliacion = [];
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.vMovimiento = new Cl_vMovimiento(this);
        this.vConciliacion = new Cl_vConciliacion(this);
    }
    mostrarRegistrarMovimiento(tipo) {
        this.vista.mostrarRegistrarMovimiento();
        this.vMovimiento.llenarCategorias(this.modelo.listarCategorias());
        this.vMovimiento.prepararFormulario(tipo);
    }
    mostrarConciliacion() {
        this.vista.mostrarConciliacion();
    }
    mostrarTablaMovimientos() {
        this.vista.mostrarTablaMovimientos();
        this.vista.llenarFiltroCategorias(this.modelo.listarCategorias());
        this.vista.llenarTablaMovimientos(this.modelo.listarMovimientos(), this.modelo.saldoInicial());
    }
    mostrarVistaPrincipal() {
        this.vista.mostrarVistaPrincipal();
    }
    agregarMovimiento(movimiento) {
        this.modelo.addMovimiento({
            dtmovimiento: movimiento,
            callback: (error) => {
                if (error)
                    Swal.fire('Error', error, 'error');
                else {
                    Swal.fire('Éxito', 'Movimiento registrado correctamente', 'success');
                    this.vista.actualizarSaldo(this.modelo.saldoTotal());
                    this.vMovimiento.ocultarFormulario();
                    this.mostrarVistaPrincipal();
                }
            }
        });
    }
    verMovimiento(movimiento) {
        this.vista.mostrarDetalle();
        const detalleFecha = document.getElementById("detalle_fecha");
        const detalleReferencia = document.getElementById("detalle_referencia");
        const detalleCategoria = document.getElementById("detalle_categoria");
        const detalleDescripcion = document.getElementById("detalle_descripcion");
        const detalleMonto = document.getElementById("detalle_monto");
        const detalleTipo = document.getElementById("detalle_tipo");
        const btnRegresar = document.getElementById("detalle_btRegresar");
        if (detalleFecha)
            detalleFecha.textContent = movimiento.fechaHora;
        if (detalleReferencia)
            detalleReferencia.textContent = movimiento.referencia;
        if (detalleCategoria)
            detalleCategoria.textContent = movimiento.categoria;
        if (detalleDescripcion)
            detalleDescripcion.textContent = movimiento.descripcion;
        if (detalleMonto)
            detalleMonto.textContent = (movimiento.cargo !== null ? movimiento.cargo : movimiento.abono).toString();
        if (detalleTipo)
            detalleTipo.textContent = movimiento.tipo;
        if (btnRegresar)
            btnRegresar.onclick = () => this.mostrarTablaMovimientos();
    }
    editarMovimiento(movimiento) {
        this.vista.mostrarRegistrarMovimiento();
        this.vMovimiento.llenarCategorias(this.modelo.listarCategorias());
        this.vMovimiento.cargarFormulario(movimiento);
    }
    actualizarMovimiento(movimiento) {
        this.modelo.editMovimiento({
            dtmovimiento: movimiento,
            callback: (error) => {
                if (error)
                    Swal.fire('Error', error, 'error');
                else {
                    Swal.fire('Éxito', 'Movimiento actualizado correctamente', 'success');
                    this.vista.actualizarSaldo(this.modelo.saldoTotal());
                    this.vMovimiento.ocultarFormulario();
                    this.mostrarTablaMovimientos();
                }
            }
        });
    }
    eliminarMovimiento(movimiento) {
        Swal.fire({
            title: '¿Está seguro?',
            text: `¿Desea eliminar el movimiento ${movimiento.descripcion} con la referencia ${movimiento.referencia}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.modelo.deleteMovimiento({
                    dtmovimiento: movimiento,
                    callback: (error) => {
                        if (error)
                            Swal.fire('Error', error, 'error');
                        else {
                            Swal.fire('Eliminado!', 'El movimiento ha sido eliminado.', 'success');
                            this.vista.actualizarSaldo(this.modelo.saldoTotal());
                            this.mostrarTablaMovimientos();
                        }
                    }
                });
            }
        });
    }
    realizarConciliacion(datosBanco) {
        const movimientosSistema = this.modelo.listarMovimientos();
        const resultados = [];
        datosBanco.forEach(movBanco => {
            const movBancoMonto = movBanco.cargo !== null ? movBanco.cargo : movBanco.abono;
            const coincidencia = movimientosSistema.find(movSis => {
                const movSisMonto = (movSis.cargo !== null ? movSis.cargo : movSis.abono) || 0;
                return movSis.referencia === movBanco.referencia &&
                    Math.abs(movSisMonto - Math.abs(movBancoMonto)) < 0.01;
            });
            if (coincidencia) {
                resultados.push({
                    fechaHora: movBanco.fecha || movBanco.fechaHora,
                    categoria: coincidencia.categoria,
                    monto: movBancoMonto,
                    estado: "Conciliado",
                    referencia: movBanco.referencia
                });
            }
            else {
                resultados.push({
                    fechaHora: movBanco.fecha || movBanco.fechaHora,
                    categoria: movBanco.categoria || "No registrado",
                    monto: movBancoMonto,
                    estado: "No Conciliado",
                    referencia: movBanco.referencia,
                    descripcion: movBanco.descripcion,
                    tipo: movBanco.tipo || (movBanco.cargo !== null ? "Cargo" : "Abono"),
                    cargo: movBanco.cargo,
                    abono: movBanco.abono
                });
            }
        });
        this.resultadosConciliacion = resultados;
        this.vConciliacion.llenarTablaConciliacion(resultados);
    }
    agregarMovimientoDesdeConciliacion(movimiento) {
        this.modelo.addMovimiento({
            dtmovimiento: movimiento,
            callback: (error) => {
                if (error)
                    Swal.fire('Error', error, 'error');
                else {
                    Swal.fire('Éxito', 'Movimiento registrado correctamente', 'success');
                    this.vista.actualizarSaldo(this.modelo.saldoTotal());
                    this.vMovimiento.ocultarFormulario();
                    this.actualizarTablaConciliacion(movimiento.referencia);
                    this.mostrarConciliacion();
                }
            }
        });
    }
    actualizarTablaConciliacion(referencia) {
        const resultado = this.resultadosConciliacion.find(r => r.referencia === referencia);
        if (resultado) {
            resultado.estado = "Conciliado";
            resultado.categoria = this.modelo.listarMovimientos().find(m => m.referencia === referencia)?.categoria || resultado.categoria;
        }
        this.vConciliacion.llenarTablaConciliacion(this.resultadosConciliacion);
    }
    prepararConciliacionManual(movimientoBanco) {
        let tipo = "Abono";
        if (movimientoBanco.tipo === "Cargo" || (movimientoBanco.cargo !== null && movimientoBanco.cargo !== undefined)) {
            tipo = "Cargo";
        }
        this.mostrarRegistrarMovimiento(tipo);
        const monto = movimientoBanco.monto !== undefined ? movimientoBanco.monto : (movimientoBanco.cargo !== null ? movimientoBanco.cargo : movimientoBanco.abono);
        const dummyMov = {
            tipo: tipo,
            fechaHora: movimientoBanco.fechaHora,
            referencia: movimientoBanco.referencia,
            categoria: movimientoBanco.categoria || "",
            descripcion: movimientoBanco.descripcion || "Conciliación manual",
            cargo: tipo === "Cargo" ? Math.abs(monto) : null,
            abono: tipo === "Abono" ? Math.abs(monto) : null,
            id: null,
            desdeConciliacion: true
        };
        this.vMovimiento.prellenarFormulario(dummyMov);
    }
}
