import type { Invoice } from '@/interfaces/billing';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface Props {
    invoice: Invoice;
    onClose?: () => void;
}

export function InvoicePrintView({ invoice, onClose }: Props) {
    const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 2
    }).format(n);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Botones - no se imprimen */}
                <div className="flex gap-2 justify-end print:hidden">
                    {onClose && (
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    )}
                    <Button onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                    </Button>
                </div>

                {/* Documento imprimible */}
                <Card className="p-12 print:shadow-none print:border-0">
                    {/* Encabezado */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">FACTURA</h1>
                            {invoice.number && (
                                <p className="text-xl font-semibold">#{invoice.number}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Fecha</p>
                            <p className="font-medium">{new Date(invoice.date).toLocaleDateString('es-CO')}</p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Información del cliente */}
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-muted-foreground mb-2">CLIENTE</h2>
                        <div className="space-y-1">
                            <p className="font-semibold text-lg">{invoice.customerSnapshot.name}</p>
                            <p className="text-sm">
                                {invoice.customerSnapshot.documentType}-{invoice.customerSnapshot.documentNumber}
                            </p>
                            {invoice.customerSnapshot.email && (
                                <p className="text-sm text-muted-foreground">{invoice.customerSnapshot.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Líneas de productos */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 font-semibold">Descripción</th>
                                    <th className="text-right py-2 font-semibold w-20">Cant.</th>
                                    <th className="text-right py-2 font-semibold w-28">Precio</th>
                                    <th className="text-right py-2 font-semibold w-20">IVA%</th>
                                    <th className="text-right py-2 font-semibold w-32">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.lines.map((line, idx) => (
                                    <tr key={line.id || idx} className="border-b">
                                        <td className="py-3">
                                            <div className="font-medium">{line.description}</div>
                                            {(line.discountPercent || line.discountAmount) ? (
                                                <div className="text-xs text-muted-foreground">
                                                    {line.discountPercent ? `Desc. ${line.discountPercent}%` : `Desc. ${fmt(line.discountAmount || 0)}`}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="text-right py-3">{line.qty}</td>
                                        <td className="text-right py-3">{fmt(line.unitPrice)}</td>
                                        <td className="text-right py-3">{line.taxRate}%</td>
                                        <td className="text-right py-3 font-medium">{fmt(line.lineTotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totales */}
                    <div className="flex justify-end mb-8">
                        <div className="w-80 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{fmt(invoice.subtotal)}</span>
                            </div>
                            {invoice.lines.reduce((sum, l) => sum + (l.qty * l.unitPrice - l.lineBase), 0) > 0 && (
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Descuentos</span>
                                    <span>-{fmt(invoice.lines.reduce((sum, l) => sum + (l.qty * l.unitPrice - l.lineBase), 0))}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Impuestos</span>
                                <span className="font-medium">{fmt(invoice.taxTotal)}</span>
                            </div>
                            {invoice.rounding !== 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Redondeo</span>
                                    <span className="font-medium">{fmt(invoice.rounding || 0)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>TOTAL</span>
                                <span>{fmt(invoice.total)}</span>
                            </div>

                            {invoice.payments.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-1">
                                        {invoice.payments.map((payment, idx) => (
                                            <div key={payment.id || idx} className="flex justify-between text-sm text-green-600">
                                                <span>{payment.method.toUpperCase()} {payment.reference && `- ${payment.reference}`}</span>
                                                <span>-{fmt(payment.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-orange-600">
                                        <span>SALDO</span>
                                        <span>{fmt(invoice.total - invoice.payments.reduce((s, p) => s + p.amount, 0))}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Notas */}
                    {invoice.notes && (
                        <div className="border-t pt-6">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">NOTAS</h3>
                            <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Estilos de impresión */}
            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border-0 {
                        border: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
