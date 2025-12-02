import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Invoice, Payment } from '@/interfaces/billing';

interface Props {
    invoice: Invoice;
    payment: Payment;
    onClose: () => void;
}

export function PaymentReceipt({ invoice, payment, onClose }: Props) {
    const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 2
    }).format(n);

    const getMethodLabel = (method: Payment['method']) => {
        const labels = {
            cash: 'Efectivo',
            card: 'Tarjeta',
            transfer: 'Transferencia',
            other: 'Otro'
        };
        return labels[method] || method;
    };

    useEffect(() => {
        // Opcional: auto-abrir diálogo de impresión al montar
        // setTimeout(() => window.print(), 500);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-white">
            {/* Botones de acción - se ocultan al imprimir */}
            <div className="no-print fixed top-4 right-4 flex gap-2">
                <Button onClick={handlePrint} size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                </Button>
                <Button onClick={onClose} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cerrar
                </Button>
            </div>

            {/* Contenido del recibo */}
            <div className="max-w-2xl mx-auto p-8">
                <div className="space-y-6">
                    {/* Encabezado */}
                    <div className="text-center border-b-2 border-black pb-6">
                        <h1 className="text-3xl font-bold mb-2">RECIBO DE PAGO</h1>
                        <p className="text-lg text-gray-600">#{payment.id}</p>
                    </div>

                    {/* Información del pago */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">DATOS DEL PAGO</h3>
                            <div className="space-y-1">
                                <div>
                                    <span className="text-sm text-gray-500">Fecha:</span>
                                    <p className="font-medium">
                                        {format(new Date(payment.date), "PPP 'a las' p", { locale: es })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Método:</span>
                                    <p className="font-medium">{getMethodLabel(payment.method)}</p>
                                </div>
                                {payment.reference && (
                                    <div>
                                        <span className="text-sm text-gray-500">Referencia:</span>
                                        <p className="font-medium">{payment.reference}</p>
                                    </div>
                                )}
                                {payment.cashboxId && (
                                    <div>
                                        <span className="text-sm text-gray-500">Caja:</span>
                                        <p className="font-medium">{payment.cashboxId}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-sm text-gray-500">Recibido por:</span>
                                    <p className="font-medium">{payment.receivedBy}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">FACTURA RELACIONADA</h3>
                            <div className="space-y-1">
                                <div>
                                    <span className="text-sm text-gray-500">Número:</span>
                                    <p className="font-medium">{invoice.number || invoice.id}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Fecha factura:</span>
                                    <p className="font-medium">
                                        {format(new Date(invoice.date), "PPP", { locale: es })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Cliente:</span>
                                    <p className="font-medium">{invoice.customerSnapshot.name}</p>
                                </div>
                                {invoice.customerSnapshot.documentNumber && (
                                    <div>
                                        <span className="text-sm text-gray-500">Documento:</span>
                                        <p className="font-medium">
                                            {invoice.customerSnapshot.documentType}-{invoice.customerSnapshot.documentNumber}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Montos */}
                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                        <div className="space-y-3">
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-600">Total factura:</span>
                                <span className="font-semibold">{fmt(invoice.total)}</span>
                            </div>
                            <div className="flex justify-between text-lg text-green-600">
                                <span>Monto pagado:</span>
                                <span className="font-bold text-2xl">{fmt(payment.amount)}</span>
                            </div>
                            <div className="border-t-2 border-gray-300 pt-3">
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Saldo restante:</span>
                                    <span className="font-bold text-xl text-orange-600">
                                        {fmt(Math.max(0, invoice.balance))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notas */}
                    {payment.notes && (
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">OBSERVACIONES</h3>
                            <p className="text-sm text-gray-700">{payment.notes}</p>
                        </div>
                    )}

                    {/* Estado del pago */}
                    <div className="text-center pt-6">
                        <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {payment.status === 'confirmed' ? 'PAGO CONFIRMADO' :
                                payment.status === 'pending' ? 'PAGO PENDIENTE' :
                                    'PAGO FALLIDO'}
                        </div>
                    </div>

                    {/* Pie de página */}
                    <div className="border-t pt-6 text-center text-xs text-gray-500">
                        <p>Este recibo es un comprobante de pago y debe ser conservado para futuras referencias.</p>
                        <p className="mt-2">Fecha de emisión: {format(new Date(), "PPP 'a las' p", { locale: es })}</p>
                    </div>
                </div>
            </div>

            {/* Estilos para impresión */}
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    
                    @page {
                        margin: 1cm;
                        size: A4;
                    }
                }
            `}</style>
        </div>
    );
}
