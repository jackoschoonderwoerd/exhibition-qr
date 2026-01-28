import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { Artifact } from '../../models/artifact.model';

export async function downloadArtifactQrPdf(
    artifact: Artifact
) {
    const url = `${location.origin}/artifact/${artifact.id}`;

    const qrDataUrl = await QRCode.toDataURL(url, {
        margin: 2,
        width: 300,
    });

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Title
    pdf.setFontSize(18);
    pdf.text(artifact.titleNL, 105, 30, { align: 'center' });

    // QR code
    pdf.addImage(qrDataUrl, 'PNG', 55, 50, 100, 100);

    // Optional subtitle
    pdf.setFontSize(10);
    pdf.text(url, 105, 160, { align: 'center' });

    pdf.save(`${artifact.titleNL}-qr.pdf`);
}
